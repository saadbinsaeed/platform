/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deepEquals } from 'app/utils/utils';
import { loadCustomEntitesAutocomplete } from 'store/actions/entities/customEntitiesActions';

import Autocomplete from './Autocomplete';
import AbstractEntityAutocomplete from './AbstractEntityAutocomplete';

/**
 * Select one or more custom entities using lazy loading.
 */
class CustomEntitesAutocomplete extends PureComponent<Object, Object> {
    static propTypes = {
        ...Autocomplete.propTypes,
        loadCustomEntitesAutocomplete: PropTypes.func.isRequired,
        options: PropTypes.arrayOf(PropTypes.object),
        isLoading: PropTypes.bool,
        filterBy: PropTypes.arrayOf(PropTypes.object)
    };

    loadData = (options: Object) => {
        if (this.props.filterBy && !deepEquals(options.filterBy, this.props.filterBy)) {
            this.props.filterBy.forEach((opts) => {
                const result = options.filterBy.find(({ field }) => field === opts.field);
                !result && options.filterBy.push(opts);
            });
        }
        return this.props.loadCustomEntitesAutocomplete(options);
    };


    render() {
        // remove the properties that we do not have to pass to the AbstractEntityAutocomplete
        const { loadCustomEntitesAutocomplete, ...abstractEntityAutocompleteProps } = this.props;
        return <AbstractEntityAutocomplete placeholder="Search for a custom entity..." {...abstractEntityAutocompleteProps} loadOptions={this.loadData} />;
    }
}

export default connect(
    state => ({
        isLoading: state.common.autocomplete.customEntities.isLoading,
        options: state.common.autocomplete.customEntities.data
    }),
    { loadCustomEntitesAutocomplete }
)(CustomEntitesAutocomplete);
