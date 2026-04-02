import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store';

interface ToastProps {
	bottom?: number;
}

export default function Toast({ bottom = 80 }: ToastProps) {
	const toastMessage = useAppStore((s) => s.toastMessage);

	return (
		<AnimatePresence>
			{toastMessage && (
				<Container
					$bottom={bottom}
					initial={{ opacity: 0, y: 10, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -10, scale: 0.95 }}
					transition={{
						type: 'spring',
						duration: 0.4,
						bounce: 0.15,
					}}>
					{toastMessage}
				</Container>
			)}
		</AnimatePresence>
	);
}

const Container = styled(motion.div)<{ $bottom: number }>`
	position: absolute;
	bottom: ${(props) => props.$bottom}px;
	pointer-events: none;
	padding: 10px 20px;
	background: rgba(0, 0, 0, 0.52);
	border-radius: 41px;
	color: rgba(255, 255, 255, 0.85);
	font-size: 14px;
	font-weight: 500;
	white-space: nowrap;
`;
