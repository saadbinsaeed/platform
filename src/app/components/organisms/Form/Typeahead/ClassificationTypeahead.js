/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Autocomplete } from '@mic3/platform-ui';

import { bind, debounce } from 'app/utils/decorators/decoratorUtils';
import { TypeaheadChipInitials } from './TypeaheadChip';
import { loadClassificationAutocomplete } from 'store/actions/classifications/classificationsActions';
import theme from 'app/themes/theme.default';

/**
 * Select one or more classification using lazy loading.
 */
class ClassificationTypeahead extends PureComponent<Object, Object> {

    static propTypes = {
        ...Autocomplete.propTypes,
        options: PropTypes.array,
    };

    @bind
    optionTemplate({ id, name, color }: Object) {
        return ({
            ChipProps: {
                avatar: <TypeaheadChipInitials initials={name} />,
                style: {
                    backgroundColor: color,
                    color: theme.isLightColor(color) ? 'black' : 'white',
                }
            },
            label: `${name || 'Name not available'} (${id || 'ID not Available'})`,
        });
    };

    @bind
    @debounce()
    suggest(event: Object) {
        const { value, loadOptions, filterBy, applicableOn } = this.props;
        const filters = [];
        const query = event.target.value;
        if (query) {
            if (Number.isInteger(Number(query))) {
                filters.push({
                    or: [
                        { field: 'id', op: '=', value: Number(query) },
                        { field: 'name', op: 'contains', value: query },
                        { field: 'uri', op: 'contains', value: query },
                    ],
                });
            } else {
                filters.push({
                    or: [
                        { field: 'name', op: 'contains', value: query },
                        { field: 'uri', op: 'contains', value: query },
                    ],
                });
            }
        }
        if (applicableOn) {
            filters.push({ field: 'abstract', op: '=', value: false });
            filters.push({ field: 'applicableOn', op: '=', value: applicableOn });
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
                    .map(({ id }) => ({ field: 'id', op: '<>', value: id })),
            );
        }
        loadOptions({
            page: 1,
            pageSize: 50,
            filterBy: filters,
            orderBy: [{ field: 'name', direction: 'asc' }],
        });
    };

    render() {
        const { loadOptions, filterBy, isLoading, placeholder, applicableOn, ...typeaheadProps } = this.props; // eslint-disable-line no-unused-vars
        return <Autocomplete {...typeaheadProps} optionTemplate={this.optionTemplate} suggest={this.suggest} placeholder={placeholder || 'Search for a classification...'} />;
    }

};

export default connect(
    state => ({
        isLoading: state.common.autocomplete.classification.isLoading,
        options: state.common.autocomplete.classification.data,
    }),
    { loadOptions: loadClassificationAutocomplete },
)(ClassificationTypeahead);
