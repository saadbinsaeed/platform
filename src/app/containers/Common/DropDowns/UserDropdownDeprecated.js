/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Autocomplete from 'app/components/molecules/Autocomplete/Autocomplete';
import UserAutocomplete from 'app/components/molecules/Autocomplete/UserAutocomplete';
import userAutocompleteQuery from 'graphql/users/userAutocompleteQuery';
import AutocompleteWrapper from './AutocompleteWrapper';

/**
 * @deprecated use UserAutocomplete instead.
 */
class UserDropdownDeprecated extends PureComponent<Object, Object> {

    static propTypes = {
        ...Autocomplete.propTypes,
        valueProperty: PropTypes.oneOf(['id', 'login']),
    }

    render() {
        return (
            <AutocompleteWrapper
                valueProperty="login"
                {...this.props}
                Autocomplete={UserAutocomplete}
                graphqlQuery={userAutocompleteQuery}
            />
        );
    }
};

export default UserDropdownDeprecated;
