import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import {
	COLORS,
	useColorTransition,
} from '../3D/TransitionMaterial/useColorTransition';
import type { ColorValue } from '../3D/TransitionMaterial/useColorTransition';
import styled from 'styled-components';
import { motion } from 'motion/react';

const BTN_SIZE = 28;
const STROKE_W = 2.5;
const SVG_SIZE = BTN_SIZE + 10; // 5px padding each side
const CX = SVG_SIZE / 2;
const CY = SVG_SIZE / 2;
const R = CX - 3; // ring just outside button edge
const CIRCUMFERENCE = 2 * Math.PI * R;
const DURATION = 1.2;

export function ColorPicker() {
	const currentPhoneColor = useAppStore((s) => s.currentPhoneColor);
	const { transitionTo, isTransitioning } = useColorTransition();
	const [pendingColor, setPendingColor] = useState<ColorValue | null>(null);

	const handleClick = (value: ColorValue) => {
		setPendingColor(value);
		transitionTo(value);
	};

	useEffect(() => {
		if (!isTransitioning) setPendingColor(null);
	}, [isTransitioning]);

	return (
		<Container>
			{COLORS.map((c) => {
				const isActive = currentPhoneColor === c.value;
				const isPending = pendingColor === c.value;
				const opacity = isTransitioning ? (isPending ? 1 : 0.5) : 1;
				const ringVisible =
					isPending || (isActive && pendingColor === null);
				const dashoffset = ringVisible ? 0 : CIRCUMFERENCE;
				const animDuration = isPending ? DURATION : 0;

				return (
					<ColorItem
						key={c.value}
						style={{ opacity, transition: 'opacity 0.3s' }}>
						<Button
							title={c.label}
							onClick={() => handleClick(c.value)}
							disabled={isActive || isTransitioning}
							$color={c.value}
						/>
						<RingSVG
							width={SVG_SIZE}
							height={SVG_SIZE}
							viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
							<g transform={`rotate(-90, ${CX}, ${CY})`}>
								<motion.circle
									cx={CX}
									cy={CY}
									r={R}
									fill='none'
									stroke='white'
									strokeWidth={STROKE_W}
									strokeLinecap='round'
									strokeDasharray={CIRCUMFERENCE}
									initial={false}
									animate={{ strokeDashoffset: dashoffset }}
									transition={{
										duration: animDuration,
										ease: 'easeInOut',
									}}
								/>
							</g>
						</RingSVG>
					</ColorItem>
				);
			})}
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	gap: 12px;
`;

const ColorItem = styled.div`
	position: relative;
	width: ${BTN_SIZE}px;
	height: ${BTN_SIZE}px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Button = styled.button<{ $color: string }>`
	width: ${BTN_SIZE}px;
	height: ${BTN_SIZE}px;
	border-radius: 50%;
	background: ${(props) => props.$color};
	border: none;
	cursor: pointer;
	outline: none;
	padding: 0;
	flex-shrink: 0;
	&:disabled {
		cursor: default;
	}
`;

const RingSVG = styled.svg`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	pointer-events: none;
	overflow: visible;
`;
