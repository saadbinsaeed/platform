import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadOrganisationAutocomplete } from 'store/actions/entities/organisationsActions';

import AbstractEntityTypeahead from './AbstractEntityTypeahead';

/**
 * Select one or more groups using lazy loading.
 */
class OrganisationTypeahead extends PureComponent<Object, Object> {

    static propTypes = {
        loadOrganisationAutocomplete: PropTypes.func.isRequired,
        options: PropTypes.arrayOf(PropTypes.object),
        isLoading: PropTypes.bool,
        filterBy: PropTypes.arrayOf(PropTypes.object),
    }

    render() {
        // remove the properties that we do not have to pass to the AbstractEntityAutocomplete
        const { loadOrganisationAutocomplete, ...abstractEntityAutocompleteProps } = this.props;
        return (
            <AbstractEntityTypeahead
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
)(OrganisationTypeahead);
