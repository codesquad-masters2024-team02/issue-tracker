import styled from 'styled-components';

export function IconXsquare({ className }) {
	return (
		<StyledWrapper className={className}>
			<svg
				width='16'
				height='16'
				viewBox='0 0 16 16'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					d='M11.2999 4.70026L4.70025 11.2999M4.7002 4.7002L11.2999 11.2999'
					stroke='currentColor'
					strokeWidth='1.6'
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</svg>
		</StyledWrapper>
	);
}
const StyledWrapper = styled.i`
	padding: 0;
`;
