import { css } from 'styled-components';

export const breakText = css`
     text-overflow: ellipsis;
     overflow-wrap: break-word;
     word-wrap: break-word;
     -ms-word-break: break-all;
     word-break: break-word;
`;

export const CssGrid = css`
    display: grid;
    grid-template-columns: repeat(12, 1fr);
`;
