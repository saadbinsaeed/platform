import styled from 'styled-components';

const Required = styled.span`
  color: ${ ( { theme } ) => theme.color.error };
`;

export default Required;