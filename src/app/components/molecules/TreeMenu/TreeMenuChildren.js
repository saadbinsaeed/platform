import styled from 'styled-components';

const TreeMenuChildren = styled.div`
    display: ${ ( { show } ) => show ? 'block' : 'none' };
    margin-left: 1rem;
`;

export default TreeMenuChildren;