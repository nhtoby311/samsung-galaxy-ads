import styled from 'styled-components';
import DynamicIsland from '../DynamicIsland';
import Toast from '../Toast';
import { useMediaQuery } from '@uidotdev/usehooks';

export default function BottomOverlay() {
	const isMobile = useMediaQuery('(max-width: 700px)');

	return (
		<Container>
			<Toast bottom={isMobile ? 90 : 120} />
			<DynamicIsland />
		</Container>
	);
}

const Container = styled.div`
	position: relative;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 48px 26px;
	color: rgba(255, 255, 255, 0.7);
	font-size: 16px;
	font-weight: 500;

	@media (max-width: 700px) {
		padding: 24px 12px;
	}
`;
