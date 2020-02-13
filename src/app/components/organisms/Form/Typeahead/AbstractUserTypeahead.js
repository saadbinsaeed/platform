/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '@mic3/platform-ui';

import { bind, debounce } from 'app/utils/decorators/decoratorUtils';
import { TypeaheadChipInitials } from './TypeaheadChip';

/**
 * Select one or more users using lazy loading.
 */
class AbstractUserTypeahead extends PureComponent<Object, Object> {

    static propTypes = {
        ...Autocomplete.propTypes,
        options: PropTypes.array,
    }

    @bind
    optionTemplate({ image, name, login, id }: Object){
        return ({
            ChipProps: {
                avatar: <TypeaheadChipInitials src={image} initials={name} />,
            },
            startAdornment: <TypeaheadChipInitials src={image} initials={name} />,
            label: `${name || 'Name not available'} (${login || 'Login not available'})`,
        });};

    @bind
    @debounce()
    suggest(event: Object) {
        const { value, filterBy } = this.props;
        const query = event.target.value;
        const filters = [{ or: [
            { field: 'name', op: 'contains', value: query },
            { field: 'login', op: 'contains', value: query },
        ] }];
        if (filterBy) {
            if (typeof filterBy === 'function') {
                filters.push(...filterBy(value));
            } else if (filterBy.length) {
                filters.push(...filterBy);
            }
        }
        if (value) {
            const excludes = Array.isArray(value) ? value : [value];
            filters.push(
                ...excludes
                    .filter(({ id }) => Number.isInteger(id))
                    .map(({ id }) => ({ field: 'id', op: '<>', value: id }))
            );
        }
        this.props.loadOptions({
            page: 1,
            pageSize: 50,
            filterBy: filters,
            orderBy: [ { field: 'name', direction: 'asc' } ],
        });
    };

    render() {
        const { loadOptions, filterBy, isLoading, placeholder, ...typeaheadProps } = this.props; // eslint-disable-line no-unused-vars
        return <Autocomplete {...typeaheadProps} optionTemplate={this.optionTemplate} suggest={this.suggest} placeholder={placeholder || 'Search for an user...'} />;
    }
};

export default AbstractUserTypeahead;
