import styled from 'styled-components';
import PropTypes from 'prop-types';

const Pill = styled.div`
  display: inline-flex;
  align-items: center;
  border-radius: 1em;
  font-weight: 500;
  padding: 1px 8px;
  font-size: .9em;
  color: ${({ theme, textColor }) => theme && textColor ? theme.color[textColor] : theme.base.textColor};
  background: ${({ theme, backgroundColor }) => theme && backgroundColor ? theme.color[backgroundColor] : theme.color.primary};
`;

Pill.propTypes = {
    textColor: PropTypes.string,
    backgroundColor: PropTypes.string
};

export default Pill;
