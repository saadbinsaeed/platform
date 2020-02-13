// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import InputWrapper from 'app/components/atoms/InputWrapper/InputWrapper';

/**
 * Generate the styled for the ToolBar
 */
const Row = styled.div`
    display: flex;
    flex-direction: column;
    background: #343A45;
    box-shadow: 0 1.83px 1px rgba(0, 0, 0, 0.26), 0 0 1.33px rgba(0, 0, 0, 0.08);
    padding: 10px 5%;
    align-items: stretch;
    @media screen and (min-width: ${({ theme }) => theme.media.md}) {
        flex-direction: row;
        padding: 5px 0.5rem;
    }
`;

const Col = styled.div`
    width: 100%;
`;

const ColLeft = styled(Col)`
    display: flex;
    flex-direction: column;
    align-items: center;
    ${InputWrapper} {
        padding: 0;
        width: 100%;
    }
    &:after {
        content: '';
        display: block;
        background: rgba(255, 255, 255, 0.24);
        margin: 5px 0;
        width: 100%;
        height: 1px;
    }
    @media screen and (min-width: ${({ theme }) => theme.media.md}) {
        flex-direction: row;
        width: 20%;
        min-width: 250px;
        &:after {
            margin: 0 25px;
            width: 1px;
            height: 24px;
        }
    }
`;

const ColRight = styled(Col)`
    display: flex;
    flex-direction: column;
    align-items: center;
    &:before {
        content: '';
        display: block;
        background: rgba(255, 255, 255, 0.24);
        margin: 5px 0;
        width: 100%;
        height: 1px;
    }
    @media screen and (min-width: ${({ theme }) => theme.media.md}) {
        flex-direction: row;
        width: auto;
        &:before {
            margin: 0 25px;
            width: 1px;
            height: 24px;
        }
    }
`;

const ColFull = styled(Col)`
    width: 100%;
    input {
        width: 100%;
    }
`;
/**
 * The Toolbar component.
 */
class ToolBar extends PureComponent<Object, Object> {

    static propTypes = {
        leftSide: PropTypes.node,
        rightSide: PropTypes.node,
    };

    render() {
        const { leftSide, rightSide, children, className } = this.props;
        return (
            <Row className={className}>
                {
                    leftSide &&
                    <ColLeft middle="xs" xs={ 12 } md={ 2 }>
                        { leftSide }
                    </ColLeft>
                }
                <ColFull bottom="xs" xs={ 12 } md={ !leftSide && !rightSide ? 12 : !leftSide ? 10 : 9 }>
                    { children && children }
                </ColFull>
                {
                    rightSide &&
                    <ColRight top="xs" xs={ 12 } md={ 1 }>
                        { rightSide }
                    </ColRight>
                }
            </Row>
        );
    }
}


export default ToolBar;
