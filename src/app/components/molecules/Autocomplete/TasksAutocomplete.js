/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deepEquals } from 'app/utils/utils';

import { loadTasksAutocomplete } from 'store/actions/entities/tasksActions';
import Autocomplete from './Autocomplete';
import AbstractEntityAutocomplete from './AbstractEntityAutocomplete';

/**
 * Select one or more custom entities using lazy loading.
 */
class TasksAutocomplete extends PureComponent<Object, Object> {
    static propTypes = {
        ...Autocomplete.propTypes,
        loadTasksAutocomplete: PropTypes.func.isRequired,
        options: PropTypes.arrayOf(PropTypes.object),
        isLoading: PropTypes.bool,
        filterBy: PropTypes.arrayOf(PropTypes.object),
    };

    // TODO: remove when id becomes bigint
    _normalizeFilterBy(filterBy) {
        if (Array.isArray(filterBy)) {
            return filterBy.map(this._normalizeFilterBy.bind(this));
        }
        if (typeof filterBy === 'object') {
            if (filterBy.field && filterBy.field === 'id') {
                return { ...filterBy, value: String(filterBy.value) };
            }
            if (filterBy.or && Array.isArray(filterBy.or)) {
                return { ...filterBy, or: filterBy.or.map(this._normalizeFilterBy.bind(this)) };
            }
        }
        return filterBy;
    }

    loadData = (options: Object) => {
        if (this.props.filterBy && !deepEquals(options.filterBy, this.props.filterBy)) {
            this.props.filterBy.forEach((opts) => {
                const result = options.filterBy.find(({ field }) => field === opts.field);
                !result && options.filterBy.push(opts);
            });
        }
        if (options.filterBy) {
            options.filterBy = this._normalizeFilterBy(options.filterBy);
        }
        return this.props.loadTasksAutocomplete(options);
    };

    render() {
        // remove the properties that we do not have to pass to the AbstractEntityAutocomplete
        const { loadTasksAutocomplete, ...abstractEntityAutocompleteProps } = this.props;
        return <AbstractEntityAutocomplete
            placeholder="Search for a task..."
            {...abstractEntityAutocompleteProps}
            loadOptions={this.loadData}
            orderBy={null}
        />;
    }
}

export default connect(
    state => ({
        isLoading: state.common.autocomplete.tasks.isLoading,
        options: state.common.autocomplete.tasks.data,
    }),
    { loadTasksAutocomplete },
)(TasksAutocomplete);
