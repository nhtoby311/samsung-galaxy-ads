import styled from 'styled-components';
import DynamicIsland from '../DynamicIsland';

export default function BottomOverlay() {
	return (
		<Container>
			{/* <ColorPicker /> */}
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
`;
