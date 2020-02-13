/* @flow */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CarotRight = styled.span`
  position: relative;
  margin-left: ${( { indentation } ) => `${indentation}rem` };
  cursor: pointer;
  padding-left: 20px;
  &:before {
    content: '';
    position: absolute;
    top: 25%;
    left: 0px;
    border-top: 6px solid transparent;
    border-left: 6px solid #999;
    border-bottom: 6px solid transparent;
  }
  &:hover {
    border-top-color: #222;
  }
`;

const CarotDown = styled.span`
  position: relative;
  margin-left: ${( { indentation } ) => `${indentation}rem` };
  cursor: pointer;
  padding-left: 20px;
  &:before {
    content: '';
    position: absolute;
    top: 25%;
    left: 0px;
    border-top: 6px solid #999;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
  }
  &:hover {
    border-top-color: #222;
  }
`;

const CaretRenderer = ( props: Object ) => {
    const { data, children } = props;
    const indentationLevel = data.level * 0.5;
    if (data.children && data.children.length > 0) {
        const Carot = data.isOpen ? CarotDown : CarotRight;
        return <Carot indentation={indentationLevel} className="carot">{children}</Carot>;
    }
    return <Fragment><span style={{ paddingLeft: `${indentationLevel + 1.2}rem`, display: 'inline-block' }}></span><span>{children}</span></Fragment>;
};

CaretRenderer.propTypes = {
    data: PropTypes.object,
    parent: PropTypes.object,
    children: PropTypes.array,
};

export default CaretRenderer;
