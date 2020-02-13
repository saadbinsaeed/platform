import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Label from '../Label/Label';
import Icon from 'app/components/atoms/Icon/Icon';
import Text from 'app/components/atoms/Text/Text';

const InfoBlockStyle = styled.div`
    font-size: inherit;
    &:not(:last-child) {
        margin-bottom: 1rem;
    }
    label {
        margin-bottom: 0;
    }
`;

const InfoBlock = (props) => {
    const { label, icon, text, type } = props;

    return (
        <InfoBlockStyle>
            <Label>{label}</Label>
            <Icon name={icon} type={type} size="sm" /> <Text>{text}</Text>
        </InfoBlockStyle>
    );
};

InfoBlock.propTypes = {
    label: PropTypes.string,
    icon: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.string
};

InfoBlock.defaultProps = {
    type: 'mdi'
};

export default InfoBlock;
