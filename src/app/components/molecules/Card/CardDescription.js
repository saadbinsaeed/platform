import styled from 'styled-components';

const CardDescription = styled.article`
   padding: ${({ descriptionPadding }) => descriptionPadding ? '1' : '0'}rem;
`;

export default CardDescription;
