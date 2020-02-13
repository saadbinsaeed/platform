import { css } from 'styled-components';

const ScrollBarMin = css`
    &::-webkit-scrollbar
    {
      width: 0px !important;
      height: 0px !important;
    }
`;

export default ScrollBarMin;
