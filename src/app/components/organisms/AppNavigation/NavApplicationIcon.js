/* @flow */

import React from 'react';

import { Tooltip } from 'primereact/components/tooltip/Tooltip';
import styled from 'styled-components';
import Icon from 'app/components/atoms/Icon/Icon';
import IconProps from 'app/components/atoms/Icon/IconProps';
import Image from 'app/components/atoms/Image/Image';
import Popover from 'app/components/molecules/Popover/Popover';

import NavApplicationIconPopoverContent from './NavApplicationIconPopoverContent';

const AppIconButton = styled.div`
    padding: 1rem 0;
`;

const AppIcon = styled(Icon)`
    display: block;
    line-height: 1;
    &:before {
        color: rgba(255,255,255,0.4);
    }
`;

const AppImage = styled(Image)`
    background: white;
`;

const NavApplicationIcon = (props: Object): Object => {
    const { name, type, image, title, ...rest } = props;
    const ApplicationIcon = () =>
        <AppIconButton id={`${name}-${type}`} {...rest} title={title}>
            {!image && <AppIcon name={name} type={type} size="lg" {...rest} />}
            {image && <AppImage src={image} size="lg" rounded {...rest} /> }
        </AppIconButton>;
    return (
        <div>
            <Tooltip for={`${name}-${type}`} title={title} tooltipPosition="right" />
            {
                name === 'process-call-conversation' ?
                    <Popover placement="middle right" width="260px" content={<NavApplicationIconPopoverContent />}>
                        <ApplicationIcon />
                    </Popover>
                    :
                    <ApplicationIcon />
            }
        </div>
    );
};

NavApplicationIcon.propTypes = {
    ...IconProps,
};

export default NavApplicationIcon;
