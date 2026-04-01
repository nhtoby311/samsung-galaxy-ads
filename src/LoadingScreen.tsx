import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDebounce } from '@uidotdev/usehooks';
import styled from 'styled-components';
import { useAppStore } from './store';

// ────────────────────────────────────────────────────────────────────────────

const VIEWBOX = '0 0 275 568';

const PHONE_BODY_D =
	'M248 1H27C12.6406 1 1 12.6406 1 27V541C1 555.359 12.6406 567 27 567H248C262.359 567 274 555.359 274 541V27C274 12.6406 262.359 1 248 1Z';

const CAMERA_D =
	'M88 164V48.5C88 28.0655 71.4345 11.5 51 11.5C30.5655 11.5 14 28.0655 14 48.5V164C14 184.435 30.5655 201 51 201C71.4345 201 88 184.435 88 164Z ' +
	'M77 48V47C77 32.6406 65.3594 21 51 21C36.6406 21 25 32.6406 25 47V48C25 62.3594 36.6406 74 51 74C65.3594 74 77 62.3594 77 48Z ' +
	'M77 106V105C77 90.6406 65.3594 79 51 79C36.6406 79 25 90.6406 25 105V106C25 120.359 36.6406 132 51 132C65.3594 132 77 120.359 77 106Z ' +
	'M76 164V163C76 148.641 64.3594 137 50 137C35.6406 137 24 148.641 24 163V164C24 178.359 35.6406 190 50 190C64.3594 190 76 178.359 76 164Z';

const INITIAL_SCALE = 1;

export function LoadingScreen() {
	const loadingProgress = useAppStore((s) => s.loadingProgress);
	const loaded = useAppStore((s) => s.loaded);
	const phoneSize = useAppStore((s) => s.phoneSize);
	const setSceneVisible = useAppStore((s) => s.setSceneVisible);
	const [dismissed, setDismissed] = useState(false);

	const debouncedProgress = useDebounce(loadingProgress, 300);

	useEffect(() => {
		if (loaded && phoneSize && debouncedProgress >= 100) {
			const timer = setTimeout(() => setDismissed(true), 400);
			return () => clearTimeout(timer);
		}
	}, [loaded, phoneSize, debouncedProgress]);

	const traceOffset = 1 - debouncedProgress / 100;

	// Fallback size estimate (before 3D phone is measured)
	const fallbackHeight = Math.min(window.innerHeight * 0.6, 500);
	const fallbackWidth = fallbackHeight * 0.48367;

	// Ghost starts at a slightly smaller size
	const initialWidth = fallbackWidth * INITIAL_SCALE;
	const initialHeight = fallbackHeight * INITIAL_SCALE;

	// Expand to phone size once measured, otherwise stay at initial size
	const targetWidth = phoneSize?.width ?? initialWidth;
	const targetHeight = phoneSize?.height ?? initialHeight;

	return (
		<AnimatePresence onExitComplete={() => setSceneVisible(true)}>
			{!dismissed && (
				<Overlay
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1, ease: 'easeInOut' }}>
					<ProgressText
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}>
						{Math.round(loadingProgress)}%
					</ProgressText>

					<SvgStack
						initial={false}
						animate={{
							width: targetWidth,
							height: targetHeight,
						}}
						transition={{
							duration: phoneSize ? 0.8 : 0,
							ease: [0.25, 0.1, 0.25, 1],
						}}>
						{/* Ghost — always-visible tracer outline */}
						<LayerSvg
							viewBox={VIEWBOX}
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d={PHONE_BODY_D}
								fill='none'
								stroke='white'
								strokeWidth={2}
								opacity={0.2}
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeMiterlimit={4.13357}
							/>
							<path
								d={CAMERA_D}
								fill='none'
								stroke='white'
								strokeWidth={2}
								opacity={0.2}
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeMiterlimit={4.13357}
							/>
						</LayerSvg>

						{/* Progress — draws white line over the ghost tracer */}
						<LayerSvg
							viewBox={VIEWBOX}
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d={PHONE_BODY_D}
								pathLength={1}
								fill='none'
								stroke='rgba(255,255,255,0.8)'
								strokeWidth={2}
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeMiterlimit={4.13357}
								strokeDasharray={1}
								strokeDashoffset={traceOffset}
								style={{
									transition: 'stroke-dashoffset 0.7s linear',
								}}
							/>
							<path
								d={CAMERA_D}
								pathLength={1}
								fill='none'
								stroke='rgba(255,255,255,0.7)'
								strokeWidth={2}
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeMiterlimit={4.13357}
								strokeDasharray={1}
								strokeDashoffset={traceOffset}
								style={{
									transition: 'stroke-dashoffset 0.7s linear',
								}}
							/>
						</LayerSvg>

						{/* Glow — bloom effect on the progress line */}
						<GlowSvg
							viewBox={VIEWBOX}
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d={PHONE_BODY_D}
								pathLength={1}
								fill='none'
								stroke='rgba(255,255,255,1)'
								strokeWidth={4}
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeMiterlimit={4.13357}
								strokeDasharray={1}
								strokeDashoffset={traceOffset}
								style={{
									transition: 'stroke-dashoffset 0.7s linear',
								}}
							/>
							<path
								d={CAMERA_D}
								pathLength={1}
								fill='none'
								stroke='rgba(255,255,255,0.5)'
								strokeWidth={2}
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeMiterlimit={4.13357}
								strokeDasharray={1}
								strokeDashoffset={traceOffset}
								style={{
									transition: 'stroke-dashoffset 0.7s linear',
								}}
							/>
						</GlowSvg>
					</SvgStack>
				</Overlay>
			)}
		</AnimatePresence>
	);
}

// ─── Styled Components ──────────────────────────────────────────────────────

const Overlay = styled(motion.div)`
	position: fixed;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 100;
	background: #000;
	pointer-events: none;
`;

const ProgressText = styled(motion.div)`
	position: absolute;
	bottom: 10%;
	left: 50%;
	transform: translateX(-50%);
	color: rgba(255, 255, 255, 0.35);
	font-family: 'Helvetica Neue', Arial, sans-serif;
	font-size: 14px;
	font-weight: 300;
	letter-spacing: 0.15em;
	user-select: none;
`;

const SvgStack = styled(motion.div)`
	position: relative;
	overflow: visible;
`;

const LayerSvg = styled.svg`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: visible;
`;

const GlowSvg = styled(LayerSvg)`
	filter: blur(6px);
`;

// ─── Component ───────────────────────────────────────────────────────────────
