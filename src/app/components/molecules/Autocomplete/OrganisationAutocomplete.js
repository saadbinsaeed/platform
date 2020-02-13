/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadOrganisationAutocomplete } from 'store/actions/entities/organisationsActions';

import Autocomplete from './Autocomplete';
import AbstractEntityAutocomplete from './AbstractEntityAutocomplete';

/**
 * Select one or more organisations using lazy loading.
 */
class OrganisationAutocomplete extends PureComponent<Object, Object> {

    static propTypes = {
        ...Autocomplete.propTypes,
        loadOrganisationAutocomplete: PropTypes.func.isRequired,
        options: PropTypes.arrayOf(PropTypes.object),
        isLoading: PropTypes.bool,
        filterBy: PropTypes.arrayOf(PropTypes.object),
    }

    render() {
        // remove the properties that we do not have to pass to the AbstractEntityAutocomplete
        const { loadOrganisationAutocomplete, ...abstractEntityAutocompleteProps } = this.props;
        return (
            <AbstractEntityAutocomplete
                placeholder="Search for an organisation..."
                {...abstractEntityAutocompleteProps}
                loadOptions={loadOrganisationAutocomplete}
            />
        );
    }
};

export default connect(
    state => ({
        isLoading: state.common.autocomplete.organisation.isLoading,
        options: state.common.autocomplete.organisation.data,
    }),
    { loadOrganisationAutocomplete }
)(OrganisationAutocomplete);
