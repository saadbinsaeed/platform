/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { onlyUpdateForKeys, compose, setPropTypes } from 'recompose';

import Image from 'app/components/atoms/Image/Image';

const NoImageStyled = styled.p`
padding: 0 1rem 1rem 1rem;
`;

const ImageStyled = styled(Image)`
display: block;
max-width: 100%;
margin: 0 auto;
padding-bottom: 6rem;
filter: invert(80%);
`;

const ProcessDiagramCard = (({ processDefinition }: Object) => {
    if (!processDefinition) {
        return <NoImageStyled>No image found related to this process</NoImageStyled>;
    }
    const src = processDefinition.snapshot && processDefinition.snapshot.bytes;
    return src ?
        <ImageStyled src={`data:image/png;base64,${src}`}/>
        : <p>No Process Diagram Available</p>;
});

export default compose(onlyUpdateForKeys(['processDefinition']), setPropTypes({
    processDefinition: PropTypes.object,
}))(ProcessDiagramCard);
