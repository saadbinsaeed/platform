/*  @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debouncePromise from 'debounce-promise';
import memoize from 'memoize-one';

import Autocomplete from 'app/components/molecules/Autocomplete/Autocomplete';
import { get } from 'app/utils/lo/lo';
import { graphql } from 'graphql/client';


/**
 * @deprecated when we use the Autocomplete family components we should pass the selected objects as value to avoid the usage of this wrapper.
 *
 * Wrapper for the Autocomplete family components to get the labels for the selected values when the component is initialized.
 */
class AutocompleteWrapper extends PureComponent<Object, Object> {

    static propTypes = {
        ...Autocomplete.propTypes,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))]),
        graphqlQuery: PropTypes.object.isRequired,
        valueProperty: PropTypes.string,
    }

    unmounted = false;

    // We checked value second time because with slow internet async function can override the correct state;
    updateState = (value: any) => (records: any) => !this.unmounted && value === this.props.value && this.setState({ value: records });

    constructor(props: Object) {
        super(props);
        this.state = { value: null };
        const { value, valueProperty = 'id', graphqlQuery } = props;
        this.fetchRecords(this.normalizeValue(value), valueProperty, graphqlQuery)
            .then(this.updateState(value));
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    normalizeValue(value: any) {
        return (!value || (Array.isArray(value) && value.length === 0)) ? null : value;
    }


    valueChanged = memoize((prevPropsValue, propsValue, stateValue, valueProperty) => {
        if (prevPropsValue === propsValue) {
            return false;
        }
        if (!propsValue) {
            return !!stateValue;
        }
        if (!stateValue) {
            return true;
        }
        const propsValueArray = Array.isArray(propsValue) ? propsValue : [propsValue];
        const stateValueArray = Array.isArray(stateValue) ? stateValue : [stateValue];
        if (propsValueArray.length !== stateValueArray.length) {
            return true;
        }
        return !propsValueArray.map(value => stateValueArray.some(record => record[valueProperty] === value)).every(r => r);
    })

    componentDidUpdate(prevProps: Object) {
        const { value, valueProperty = 'id', graphqlQuery } = this.props;
        if (this.valueChanged(prevProps.value, value, this.state.value, valueProperty)) {
            this.fetchRecords(this.normalizeValue(value), valueProperty, graphqlQuery)
                .then(this.updateState(value));
        }
    }

    fetchRecords = debouncePromise((value, valueProperty, graphqlQuery) => {
        if (!value) {
            return null;
        }
        const identifiers = Array.isArray(value) ? value : [value];
        return graphql.query({
            query: graphqlQuery,
            variables: { filterBy: [{ field: valueProperty, op: 'in', value: identifiers }] },
            fetchPolicy: 'no-cache',
        }).then((response) => {
            const records = get(response, 'data.result') || [];
            // even if the user cannot see some value we have to keep the id in the selected options
            const options = identifiers.map(id => records.find(record => record[valueProperty] === id) || { [valueProperty]: id });
            return Array.isArray(value) ? options : options[0];
        });
    }, 300);

    onChange = (event: Object) => {
        const { valueProperty = 'id' } = this.props;
        this.setState({ value: event.value }, () => {
            let value = null;
            if (event.value) {
                if (Array.isArray(event.value)) {
                    value = event.value.map(option => option[valueProperty]);
                } else {
                    value = event.value[valueProperty];
                }
            }
            this.props.onChange({ ...event, value, target: { ...event.target, value } });
        });
    }

    buildKey = memoize(value => JSON.stringify(value));

    render() {
        const { Autocomplete, ...autocompleteProps } = this.props;
        const { value } = this.state || {};
        return (
            <Autocomplete
                {...autocompleteProps}
                key={this.buildKey(value)}
                value={value}
                onChange={this.onChange}
            />
        );
    }
}

export default AutocompleteWrapper;
