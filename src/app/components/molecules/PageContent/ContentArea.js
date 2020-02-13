import React from 'react';
import styled from 'styled-components';

const ContentAreaStyle = styled.div`
  position: relative;
  grid-area: pContent;
  display: block;
  overflow: auto;
  max-height: 100%;
`;

const ContentArea = ({children, style, innerRef}) => <ContentAreaStyle innerRef={innerRef} className={'content-area'} style={style}>{children}</ContentAreaStyle>;

export default ContentArea;
