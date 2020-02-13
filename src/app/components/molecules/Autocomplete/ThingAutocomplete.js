/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadThingAutocomplete } from 'store/actions/entities/thingsActions';

import Autocomplete from './Autocomplete';
import AbstractEntityAutocomplete from './AbstractEntityAutocomplete';

/**
 * Select one or more things using lazy loading.
 */
class ThingAutocomplete extends PureComponent<Object, Object> {

    static propTypes = {
        ...Autocomplete.propTypes,
        loadThingAutocomplete: PropTypes.func.isRequired,
        options: PropTypes.arrayOf(PropTypes.object),
        isLoading: PropTypes.bool,
        filterBy: PropTypes.arrayOf(PropTypes.object),
    }

    render() {
        // remove the properties that we do not have to pass to the AbstractEntityAutocomplete
        const { loadThingAutocomplete, ...abstractEntityAutocompleteProps } = this.props;
        return (
            <AbstractEntityAutocomplete
                placeholder="Search for a thing..."
                {...abstractEntityAutocompleteProps}
                loadOptions={loadThingAutocomplete}
            />
        );
    }
};

export default connect(
    state => ({
        isLoading: state.common.autocomplete.thing.isLoading,
        options: state.common.autocomplete.thing.data,
    }),
    { loadThingAutocomplete }
)(ThingAutocomplete);
