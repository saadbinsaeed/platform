import styled from 'styled-components';

const HeaderActions = styled.div`
    display: flex;
    margin-left: auto;
    padding-right: ${({ headerPadding }) => headerPadding ? '0' : '0.5' }rem;
`;

export default HeaderActions;
