/*  @flow */

import React, { PureComponent } from 'react';
import debouncePromise from 'debounce-promise';

import { get } from 'app/utils/lo/lo';
import { graphql } from 'graphql/client';
import classificationAutocompleteQuery from 'graphql/entities/classifications/classificationAutocompleteQuery';

/**
 * @deprecated Instead of using this component we should get all the id and name of the selected options when we init the autocomplete.
 *
 * Wrapper for the entity Autocomplete family components.
 */
class ClassificationAutocompleteWrapper extends PureComponent<Object, Object> {

    constructor(props: Object) {
        super(props);
        this.state = {};
        const value = props.value;
        this.fetchEntity(value).then(entity => this.setState({ value: entity }));
    }

    componentDidUpdate(prevProps: Object) {
        const value = this.props.value;
        if (get(this.state, 'value.id') !== value) {
            this.fetchEntity(value).then(entity => this.setState({ value: entity }));
        }
    }

    fetchEntity = debouncePromise((id: number) => {
        if (!id || !Number.isInteger(id)) {
            return Promise.resolve(null);
        }

        return graphql.query({
            query: classificationAutocompleteQuery,
            variables: { filterBy: [{ field: 'id', op: '=', value: id }] },
            fetchPolicy: 'no-cache',
        }).then((response) => {
            const entity = get(response, 'data.result[0]');
            return entity || { id, name: 'Data not available' };
        });
    }, 300);

    onChange = (event: Object) => {
        this.setState({ value: event.value }, () => {
            const value = event.value && event.value.id;
            this.props.onChange({
                ...event,
                value,
                target: { ...event.target, value },
            });
        });
    };

    render() {
        const { Autocomplete, ...autocompleteProps } = this.props;
        const { value } = this.state || {};
        return (
            <Autocomplete
                {...autocompleteProps}
                key={value && value.id}
                value={value}
                onChange={this.onChange}
            />
        );
    }
}

export default ClassificationAutocompleteWrapper;
