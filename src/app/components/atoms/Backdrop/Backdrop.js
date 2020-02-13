/* @flow */

import styled from 'styled-components';
import { pure } from 'recompose';

const Backdrop = styled.div`
position: absolute;
left: 0; right: 0; top: 0; bottom: 0;
display: flex;
align-items: center;
justify-content: center;
background: ${({ theme }) => theme.modal.backdrop.background};
z-index: 1400;
@media(min-width: ${ ( { theme } ) => theme.media.md }) {
  padding: 1rem;
}
`;

export default pure(Backdrop);
