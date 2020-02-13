/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadGroupAutocomplete } from 'store/actions/admin/groupsActions';

import Autocomplete from './Autocomplete';
import AbstractEntityAutocomplete from './AbstractEntityAutocomplete';

/**
 * Select one or more groups using lazy loading.
 */
class GroupAutocomplete extends PureComponent<Object, Object> {

    static propTypes = {
        ...Autocomplete.propTypes,
        loadGroupAutocomplete: PropTypes.func.isRequired,
        options: PropTypes.arrayOf(PropTypes.object),
        isLoading: PropTypes.bool,
        filterBy: PropTypes.arrayOf(PropTypes.object),
    }

    render() {
        // remove the properties that we do not have to pass to the AbstractEntityAutocomplete
        const { loadGroupAutocomplete, ...abstractEntityAutocompleteProps } = this.props;
        return (
            <AbstractEntityAutocomplete
                placeholder="Search for a group..."
                {...abstractEntityAutocompleteProps}
                loadOptions={loadGroupAutocomplete}
            />
        );
    }
};

export default connect(
    state => ({
        isLoading: state.common.autocomplete.group.isLoading,
        options: state.common.autocomplete.group.data,
    }),
    { loadGroupAutocomplete }
)(GroupAutocomplete);
