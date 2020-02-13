/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '@mic3/platform-ui';

import { bind, debounce } from 'app/utils/decorators/decoratorUtils';
import { TypeaheadChipInitials } from './TypeaheadChip';

/**
 * Select one or more entities using lazy loading.
 */
class AbstractEntityTypeahead extends PureComponent<Object,Object> {

    static propTypes = {
        ...Autocomplete.propTypes,
        options: PropTypes.array,
        filterBy: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.arrayOf(PropTypes.object),
        ]),
    }

    @bind
    optionTemplate (data: Object) {
        if (this.props.optionTemplate) {
            return this.props.optionTemplate(data);
        }
        const { id, name } = data;
        return ({
            ChipProps: {
                avatar: <TypeaheadChipInitials initials={name} />,
            },
            label: `${name || 'Name not available'} (${id || 'ID not Available'})`,
        });};

    @bind
    @debounce()
    suggest(event: Object) {
        const { value, loadOptions, directoryType, filterBy, orderBy = [{ field: 'name', direction: 'asc' }] } = this.props;
        const filters = [];
        const query = event.target.value;
        if (query) {
            if (Number.isInteger(Number(query))) {
                filters.push({ or: [
                    { field: 'id', op: '=', value: Number(query) },
                    { field: 'name', op: 'contains', value: query },
                ] });
            } else {
                filters.push({ field: 'name', op: 'contains', value: query });
            }
        }
        if (directoryType) {
            filters.push({ field: 'classes.uri', op: '=', value: directoryType });
        }
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
        loadOptions({
            page: 1,
            pageSize: 50,
            filterBy: filters,
            orderBy: orderBy,
        });
    };

    render() {
        const { loadOptions, filterBy, isLoading, directoryType, ...typeaheadProps } = this.props; // eslint-disable-line no-unused-vars
        return <Autocomplete {...typeaheadProps} optionTemplate={this.optionTemplate} suggest={this.suggest} />;
    }
};

export default AbstractEntityTypeahead;
