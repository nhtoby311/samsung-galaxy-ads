import { useAppStore } from '../store';
import {
	COLORS,
	useColorTransition,
} from '../3D/TransitionMaterial/useColorTransition';
import styled from 'styled-components';

export function ColorPicker() {
	const currentPhoneColor = useAppStore((s) => s.currentPhoneColor);
	const { transitionTo, isTransitioning } = useColorTransition();

	return (
		<Container>
			{COLORS.map((c) => {
				const isActive = currentPhoneColor === c.value;
				return (
					<Button
						key={c.value}
						title={c.label}
						onClick={() => transitionTo(c.value)}
						disabled={isActive || isTransitioning}
						color={c.value}
						$isActive={isActive}
						$isTransitioning={isTransitioning}
					/>
				);
			})}
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	gap: 12px;
`;

const Button = styled.button<any>`
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background: ${(props) => props.color};
	border: ${(props) =>
		props.$isActive ? '3px solid white' : '2px solid transparent'};
	cursor: ${(props) => (props.$isActive ? 'default' : 'pointer')};
	opacity: ${(props) =>
		props.$isTransitioning && !props.$isActive ? 0.5 : 1};
	transition:
		border 0.2s,
		opacity 0.2s;
	outline: none;
	padding: 0;
`;
