import React from 'react';
import styled from 'styled-components';
import Bar from 'app/components/atoms/Bar/Bar';
import HeaderActions from 'app/components/atoms/HeaderActions/HeaderActions';
import PopoverFooterProps from './PopoverFooterProps';

const PopoverFooterStyle = styled(Bar)`
    padding: .3rem;
`;

const PopoverFooter = (props) => {

    const { footer } = props;

    return (
        <PopoverFooterStyle>
            <HeaderActions>{footer}</HeaderActions>
        </PopoverFooterStyle>
    );
};

PopoverFooter.propTypes = {
    ...PopoverFooterProps
};

export default PopoverFooter;