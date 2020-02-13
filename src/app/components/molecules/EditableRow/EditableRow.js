/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from 'app/components/atoms/Icon/Icon';
import Flex from 'app/components/atoms/Flex/Flex';

const Container = styled.div`
display: flex;
justify-content: space-between;
`;

const ActionIcon = styled(Icon)`
margin-left: 8px;
line-height: 0;
`;

/**
 *
 */
class EditableRow extends PureComponent<Object, Object> {

    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.any,
        save: PropTypes.func.isRequired,
        EditComponent: PropTypes.func.isRequired,
        onChange: PropTypes.func,
    };

    unmouted = false;

    componentWillUnmount() {
        this.unmouted = true;
    }

    // $FlowFixMe
    elementRef = React.createRef();
    state: Object = { editing: false };

    getInput = () => {
        const ref = this.elementRef.current;
        return ref && (ref.querySelector('input')
            || ref.querySelector('textarea')
            || ref.querySelector('select'));
    };

    setFocus = () => {
        const input = this.getInput();
        input && input.focus();
    }

    enableEditing = () => {
        this.setState({ editing: true, value: this.props.value }, this.setFocus);
    }

    disableEditing = () => {
        setTimeout(() => !this.unmouted && this.setState({ editing: false }), 300);
    }

    onChange = (event: Object) => {
        const { name, value } = event.target || event;
        this.setState({ name, value }, this.props.onChange && this.props.onChange(event));
    }

    onSave = () => {
        const { name } = this.props;
        const { value } = this.state;
        if (value !== undefined) { // if the value is changed
            this.props.save({ name, value, target: { name, value } });
        }
        this.disableEditing();
    }

    render() {
        const { EditComponent, showClose, disabled, name } = this.props;
        const { value } = this.state;
        return (
            <Container innerRef={this.elementRef} onBlur={showClose ? null : this.disableEditing}>
                {
                    this.state.editing ?
                        <Flex grow spaceBetween>
                            <EditComponent name={name} value={value} onChange={this.onChange} />
                            { showClose && <ActionIcon name="close" onClick={this.disableEditing} /> }
                            <ActionIcon name="content-save" onClick={this.onSave} />
                        </Flex>
                        :
                        <Fragment>
                            <Flex grow spaceBetween style={{ overflow: 'hidden'}}>
                                {this.props.children}
                            </Flex>
                            <Flex>
                                {!disabled && <ActionIcon name="pencil" onClick={this.enableEditing} />}
                            </Flex>
                        </Fragment>
                }
            </Container>
        );
    }

}

export default EditableRow;
