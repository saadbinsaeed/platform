/* @flow */

// $FlowFixMe
import React, { useCallback } from 'react';
import { Dropzone } from '@mic3/platform-ui';
import styled from 'styled-components';

const WrapperContent = styled.div`
width: 100%;
height: 100%;
`;

const DropzoneWrapper = ({ children, className,  ...restProps }: Object) => {
    const disablePropagation = useCallback((event) => {
        event.stopPropagation();
    }, []);
    return (
        <Dropzone
            accept="image/*,video/*,application/*,video/*,audio/*,text/*"
            {...restProps}
            dropZoneClasses={className}
            showPreviews={false}
            showAlerts={false}
            noClick
        >
            <WrapperContent onClick={disablePropagation}>
                {children}
            </WrapperContent>
        </Dropzone>
    );
};


export default DropzoneWrapper;
