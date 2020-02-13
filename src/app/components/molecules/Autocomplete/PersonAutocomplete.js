/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadPersonAutocomplete } from 'store/actions/entities/peopleActions';

import Autocomplete from './Autocomplete';
import AbstractEntityAutocomplete from './AbstractEntityAutocomplete';

/**
 * Select one or more people using lazy loading.
 */
class PersonAutocomplete extends PureComponent<Object, Object> {

    static propTypes = {
        ...Autocomplete.propTypes,
        loadPersonAutocomplete: PropTypes.func.isRequired,
        options: PropTypes.arrayOf(PropTypes.object),
        isLoading: PropTypes.bool,
        filterBy: PropTypes.arrayOf(PropTypes.object),
    }

    render() {
        // remove the properties that we do not have to pass to the AbstractEntityAutocomplete
        const { loadPersonAutocomplete, ...abstractEntityAutocompleteProps } = this.props;
        return (
            <AbstractEntityAutocomplete
                placeholder="Search for a person..."
                {...abstractEntityAutocompleteProps}
                loadOptions={loadPersonAutocomplete}
            />
        );
    }
};

export default connect(
    state => ({
        isLoading: state.common.autocomplete.person.isLoading,
        options: state.common.autocomplete.person.data,
    }),
    { loadPersonAutocomplete }
)(PersonAutocomplete);
