import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Text from 'app/components/atoms/Text/Text';

const InfoLineStyle = styled.div`
  display: inline-block;
  margin: 0 1rem;
`;

const InfoLabel = styled(Text)`
  font-weight: 500;
  margin-right: .3rem;
`;

const InfoLine = (props) => {

    const { label, text } = props;

    return (
        <InfoLineStyle>
            <InfoLabel>{label}</InfoLabel>
            <Text>{text}</Text>
        </InfoLineStyle>
    );
};

InfoLine.propTypes = {
    label: PropTypes.string,
    text: PropTypes.string
};

export default InfoLine;
