/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Autocomplete from 'app/components/molecules/Autocomplete/Autocomplete';
import GroupAutocomplete from 'app/components/molecules/Autocomplete/GroupAutocomplete';
import groupAutocompleteQuery from 'graphql/groups/groupAutocompleteQuery';
import AutocompleteWrapper from './AutocompleteWrapper';

/**
 * @deprecated use GroupAutocomplete instead.
 */
class GroupsDropdownDeprecated extends PureComponent<Object, Object> {

    static propTypes = {
        ...Autocomplete.propTypes,
        valueProperty: PropTypes.oneOf(['id', 'name']),
    }

    render() {
        return (
            <AutocompleteWrapper
                valueProperty="id"
                {...this.props}
                Autocomplete={GroupAutocomplete}
                graphqlQuery={groupAutocompleteQuery}
            />
        );
    }
};

export default GroupsDropdownDeprecated;
