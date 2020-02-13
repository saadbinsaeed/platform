/* @flow */

import React, { PureComponent } from 'react';
import memoize from 'memoize-one';
import styled from 'styled-components';
import { Badge, MdiIcon, Tooltip } from '@mic3/platform-ui';
import greenlet from 'greenlet';

import { isDefined, serialPromises } from 'app/utils/utils';
import { get, set } from 'app/utils/lo/lo';
import Immutable from 'app/utils/immutable/Immutable';

const pick = (object: Object, fields: Array<string> ) => !object ? {} :
    fields.reduce((acc, field) => {
        if(get(object, field)) {
            acc = set(acc, field, get(object, field));
        }
        return acc;
    }, {});

const BadgeStyled = styled(Badge)`
    width: 100%;
    display: block !important   ;
    & > span {
        display: block;
        top: 1.7rem;
        position: absolute;
        right: 1rem;
    }
`;

export const events = Immutable(['onClick', 'onBlur', 'onFocus', 'onChange']);

class FormField extends PureComponent<Object> {

    onClickAction: Function
    onBlurAction: Function
    onChangeAction: Function
    onFocusAction: Function

    constructor(props: Object) {
        super(props);
        this._bindActions(events);
    }

    _bindActions(functionNames: Array<string>) {
        functionNames.forEach((name) => {
            if (this.props[name]) {
                const self: Object = this;
                const fnWorkerName = `${name}Worker`;
                const fnActionName = `${name}Action`;
                self[fnWorkerName] = greenlet(this.props[name]);
                const action = (event) => {
                    const { target: { name, value } } = event;
                    const e = { target: { name, value } };
                    const workerPromise = self[fnWorkerName](e, self.props.variables);
                    workerPromise.then((changes) => {
                        if (changes) {
                            if (Array.isArray(changes)) {
                                serialPromises(changes, change => self.props.changeVariable(change));
                            } else {
                                self.props.changeVariable(changes);
                            }
                        }
                    });
                };
                self[fnActionName] = action.bind(self);
            }
        });
    }

    componentDidUpdate(prevProps: Object) {
        const { props } = this;
        const changedHandlers = events.filter(eventHandler => props[eventHandler] !== prevProps[eventHandler]);
        this._bindActions(changedHandlers);
    }

    onClick = this.onClickAction;

    onBlur = this.onBlurAction;

    onFocus = this.onFocusAction;

    onChange = (event: Object) => {
        if (this.onChangeAction) {
            this.onChangeAction(event);
        } else {
            const { target: { name, type } } = event;
            let value = event.target.value;
            if (type === 'number') {
                value = Number(value);
            }
            this.props.changeVariable({ name, value });
        }
    }

    isVisible = memoize((isVisible, variables) => {
        if(!isDefined(isVisible)) {
            return true;
        }
        if (typeof isVisible === 'boolean') {
            return isVisible;
        }
        if (typeof isVisible === 'function') {
            return isVisible(variables);
        }
        throw new Error(`${this.props.name}: isVisible contains an invalid value (${typeof isVisible}): ${isVisible}`);
    });

    render() {
        const eventsHandlers = pick(this, events);
        const { Component, variables, changeVariable, isVisible, local, help, action, ...props } = this.props;
        if (!this.isVisible(isVisible, variables)) {
            return null;
        }

        if (action && typeof action === 'function') {
            props.action = action;
        }

        const fieldForm = <Component autoComplete="off" {...props} {...eventsHandlers} />;
        const helpHtml = get(help, 'innerHTML');
        if (React.isValidElement(help) || helpHtml || typeof help === 'string') {
            const helperComponent = React.isValidElement(help) ? help : <div dangerouslySetInnerHTML={{ __html: help.innerHTML || ''}} />;
            return <BadgeStyled badgeContent={<Tooltip title={helperComponent} placement="top"><MdiIcon size={17} name="help-circle" color="secondary"/></Tooltip>} >{fieldForm}</BadgeStyled>;
        }
        return fieldForm;
    }
}

export const fieldify = (Component: Object) => (props: Object) => <FormField {...props} Component={Component} />;

export default FormField;
