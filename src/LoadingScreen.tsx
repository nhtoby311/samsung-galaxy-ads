import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDebounce } from '@uidotdev/usehooks';
import { useAppStore } from './store';

//
//
// In Figma: File → Export → SVG, then open the file and copy the `d`
// attribute from each <path>. Replace PHONE_BODY_D and CAMERA_ISLAND_D below.
//
// The viewBox below must match your Figma artboard dimensions exactly.
// Current artboard ratio target: width / height = 0.48367
// Suggested Figma artboard: 484 × 1001 px  →  viewBox="0 0 484 1001"
//
// Each path uses pathLength="1" so stroke-dash animation works regardless
// of the actual path geometry — no getTotalLength() needed.
// ────────────────────────────────────────────────────────────────────────────

const VIEWBOX = '0 0 275 568';

const PHONE_BODY_D =
	'M248 1H27C12.6406 1 1 12.6406 1 27V541C1 555.359 12.6406 567 27 567H248C262.359 567 274 555.359 274 541V27C274 12.6406 262.359 1 248 1Z';

const CAMERA_D =
	'M88 164V48.5C88 28.0655 71.4345 11.5 51 11.5C30.5655 11.5 14 28.0655 14 48.5V164C14 184.435 30.5655 201 51 201C71.4345 201 88 184.435 88 164Z ' +
	'M77 48V47C77 32.6406 65.3594 21 51 21C36.6406 21 25 32.6406 25 47V48C25 62.3594 36.6406 74 51 74C65.3594 74 77 62.3594 77 48Z ' +
	'M77 106V105C77 90.6406 65.3594 79 51 79C36.6406 79 25 90.6406 25 105V106C25 120.359 36.6406 132 51 132C65.3594 132 77 120.359 77 106Z ' +
	'M76 164V163C76 148.641 64.3594 137 50 137C35.6406 137 24 148.641 24 163V164C24 178.359 35.6406 190 50 190C64.3594 190 76 178.359 76 164Z';
// ────────────────────────────────────────────────────────────────────────────

export function LoadingScreen() {
	const loadingProgress = useAppStore((s) => s.loadingProgress);
	const loaded = useAppStore((s) => s.loaded);
	const phoneSize = useAppStore((s) => s.phoneSize);
	const setSceneVisible = useAppStore((s) => s.setSceneVisible);
	const [dismissed, setDismissed] = useState(false);

	// Debounce the progress so each update lingers, making the trace visible
	const debouncedProgress = useDebounce(loadingProgress, 300);

	// Once loaded AND size measured, wait a beat then dismiss
	useEffect(() => {
		if (loaded && phoneSize && debouncedProgress >= 100) {
			const timer = setTimeout(() => setDismissed(true), 400);
			return () => clearTimeout(timer);
		}
	}, [loaded, phoneSize, debouncedProgress]);

	// pathLength="1" normalizes the path — dashoffset simply goes 1 → 0
	const traceOffset = 1 - debouncedProgress / 100;

	// Use measured 3D phone projection size, fallback to ratio-correct estimate
	const svgHeight =
		phoneSize?.height ?? Math.min(window.innerHeight * 0.6, 500);
	const svgWidth = phoneSize?.width ?? svgHeight * 0.48367;

	return (
		<AnimatePresence onExitComplete={() => setSceneVisible(true)}>
			{!dismissed && (
				<motion.div
					className='loading-screen'
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1, ease: 'easeInOut' }}>
					{/* Progress text */}
					<motion.div
						className='loading-progress-text'
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}>
						{Math.round(loadingProgress)}%
					</motion.div>

					{/*
					 * SVG outline — flex-centered by .loading-screen
					 * To swap in your Figma design: replace PHONE_BODY_D and
					 * CAMERA_ISLAND_D above, and update VIEWBOX to match your
					 * Figma artboard. Add pathLength="1" to every <path>.
					 */}
					<svg
						width={svgWidth}
						height={svgHeight}
						viewBox={VIEWBOX}
						xmlns='http://www.w3.org/2000/svg'>
						<path
							d={PHONE_BODY_D}
							pathLength={1}
							fill='none'
							stroke='rgba(255,255,255,0.6)'
							strokeWidth={2}
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeMiterlimit={4.13357}
							strokeDasharray={1}
							strokeDashoffset={traceOffset}
							style={{
								transition: 'stroke-dashoffset 0.6s linear',
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
								transition: 'stroke-dashoffset 0.6s linear',
							}}
						/>
					</svg>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
