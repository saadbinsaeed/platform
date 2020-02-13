/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
import Bar from 'app/components/atoms/Bar/Bar';

const FooterBarStyle = styled(Bar)`
    grid-area: pFooter;
    color: ${({ theme }) => theme.base.textColor};
    background: ${ ( { theme } ) => lighten(0.03, theme.base.background) };
    height: ${ ( { theme } ) => theme.bar.height };
    box-shadow: ${( { theme } ) => theme.shadow.z2 };
    button {
      margin: 0;
    }
`;

const FooterBar = (props) => {
    return (
        <FooterBarStyle className={`footer-bar ${props.className}`}>{props.children}</FooterBarStyle>
    );
};

export default FooterBar;
