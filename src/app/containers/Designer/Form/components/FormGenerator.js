/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { List, ListItem } from '@mic3/platform-ui';

import FormValidator from 'app/utils/validator/FormValidator';
import { getFieldByType, fillProperties } from 'app/utils/designer/form/fieldUtils';
import { get, set } from 'app/utils/lo/lo';
import Immutable from 'app/utils/immutable/Immutable';
import { bind, debounce, memoize } from 'app/utils/decorators/decoratorUtils';

const ListStyled = styled(List)`
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    & li {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
    }
`;

class FormGenerator extends PureComponent<Object, Object> {

    static propTypes = {
        components: PropTypes.arrayOf(PropTypes.object),
        data: PropTypes.object,
        useDataContext: PropTypes.bool,
        ListItemProps: PropTypes.object,
    };

    static defaultProps = {
        components: [],
        data: {},
        action: '#',
        ListItemProps: {},
    }

    validator: Object;

    constructor(props: Object) {
        super(props);
        const { components } = props;
        this.validator = new FormValidator(components);
        this.state = { data: props.data || {}, onChangeSet: new Set(), globalValidation: false, errors: null };
    }

    componentDidUpdate(prevProps: Object) {
        const { components, data } = this.props;
        if (components !== prevProps.components || data !== prevProps.data) {
            if (components !== prevProps.components) {
                this.validator = new FormValidator(components);
            }
            this.setState({ data, components });
        }
    }

    @bind
    @debounce()
    onChange() {
        this.validate(() => {
            if(!this.state.errors && this.props.onChange) {
                this.props.onChange(this.state.data);
            }
        });
    }

    @bind
    changeVariable({ name, value }: Object) {
        return new Promise<Object>((resolve) => {
            const data = set(this.state.data, name, value);
            const onChangeSet = new Set([ ...this.state.onChangeSet.values(), name]);
            this.setState({ data, onChangeSet }, () => {
                this.onChange();
                resolve(this.state.data);
            });
        });
    }

    @bind
    async isValidForm() {
        return new Promise((resolve, reject) => {
            this.setState({ globalValidation: true }, () => this.validate(() => {
                const { errors, data } = this.state;
                resolve({ data, errors });
            }));
        });
    }

    @bind
    validate(fn: Function = () => {}) {
        const errors = this.validator.getErrors(this.state.data);
        this.setState({ errors }, fn);
        this.props.onValidate && this.props.onValidate(errors);
    }

    // helped function for keeping buildComponents memoized
    @bind
    _buildComponents(components: Object, data: Object, useDataContext: boolean, validator: Object, errors: Object, ListItemProps: Object) {
        return components.map((component, index) => this._buildComponent(component, index, data, useDataContext, validator, errors, ListItemProps));
    }

    @bind
    _buildComponent(component: Object, index: number, data: Object, useDataContext: boolean, validator: Object, errors: Object, ListItemProps: Object) {
        const {onChangeSet, globalValidation} = this.state;
        const { changeVariable } = this;
        const { type, defaults, constraints } = component;
        const { required } = constraints || {};
        const properties = fillProperties(component.properties, defaults);

        let name = properties.name;
        if (useDataContext) {
            const prefix = properties.local ? 'local' : 'global';
            name = properties.name && `${prefix}.${properties.name}`;
        }
        const value = name && get(data, name);

        const children = component.children ?
            this._buildComponents(component.children, data, useDataContext, validator, errors, ListItemProps)
            : null;

        // Render error propertires
        let errorProps = {};
        if (onChangeSet.has(name) || globalValidation) {
            const messages = validator.formatMessages(name, component);
            errorProps = messages ? { error: errors && true, helperText: messages.join('\n') } : {};
        }

        const { onValue, ...componentProperties } = properties;

        const variables = Immutable(this.state.data);
        const builtComponent =  getFieldByType(
            type,
            { ...componentProperties, ...errorProps, name, value, required, changeVariable, variables },
            children
        );
        return (
            <ListItem ContainerComponent={component.type === 'panel' ? 'div' : 'li'} key={index} {...ListItemProps}>{builtComponent}</ListItem>
        );
    }

    @bind
    @memoize()
    buildComponents(...args: Array<any>){
        return this._buildComponents(...args);
    };

    render() {
        const { components, useDataContext, ListItemProps } = this.props;
        const { data, errors } = this.state;
        return (
            <ListStyled>
                { this.buildComponents(components || [], data, useDataContext, this.validator, errors, ListItemProps) }
            </ListStyled>
        );
    }
}

export default FormGenerator;
