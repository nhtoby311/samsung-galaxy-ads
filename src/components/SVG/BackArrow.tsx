import { type Props } from './type';

const BackArrow = ({ className }: Props) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width={24}
		fill='none'
		viewBox='0 0 24 24'
		className={className}>
		<path
			stroke='#fff'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={2}
			d='M9 15 3 9m0 0 6-6M3 9h12a6 6 0 1 1 0 12h-3'
		/>
	</svg>
);
export default BackArrow;
