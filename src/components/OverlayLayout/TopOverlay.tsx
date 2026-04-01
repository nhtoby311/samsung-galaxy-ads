import styled from 'styled-components';
import SamsungSVG from '../SVG/SamsungSVG';

export default function TopOverlay() {
	return (
		<Container>
			<InnerCont>
				<SamsungSVG />
				<Title>Galaxy S26</Title>
			</InnerCont>
		</Container>
	);
}

const Container = styled.div`
	position: relative;
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding: 28px 26px;
	color: rgba(255, 255, 255, 0.7);
	font-size: 16px;
	font-weight: 500;

	@media (max-width: 700px) {
		padding: 24px 20px;
	}
`;

const InnerCont = styled.div`
	display: flex;
	flex-direction: column;
	gap: 3px;
	pointer-events: all;
`;

const Title = styled.div`
	font-family: 'Samsung Sans Medium', sans-serif;
	font-size: 46px;
	color: white;
`;
