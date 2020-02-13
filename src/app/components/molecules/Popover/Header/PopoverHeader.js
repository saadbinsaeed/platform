import React from 'react';
import styled from 'styled-components';
import Bar from 'app/components/atoms/Bar/Bar';
import HeaderActions from 'app/components/atoms/HeaderActions/HeaderActions';
import PopoverHeaderProps from './PopoverHeaderProps';

const PopoverHeaderStyle = styled(Bar)`
    padding: .3rem .3rem 0 .3rem;
`;

const PopoverHeader = (props) => {

    const { headerActions } = props;

    return (
        <PopoverHeaderStyle>
            <HeaderActions>{headerActions}</HeaderActions>
        </PopoverHeaderStyle>
    );
};

PopoverHeader.propTypes = {
    ...PopoverHeaderProps
};

export default PopoverHeader;