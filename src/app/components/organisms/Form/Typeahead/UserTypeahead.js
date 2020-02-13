/* @flow */

import { connect } from 'react-redux';

import { loadUserAutocomplete } from 'store/actions/admin/usersActions';
import AbstractUserTypeahead from './AbstractUserTypeahead';

/**
 * Select one or more users using lazy loading.
 */
class UserTypeahead extends AbstractUserTypeahead {

    static propTypes = {
        ...AbstractUserTypeahead.propTypes,
    }

};

export default connect(
    state => ({
        isLoading: state.common.autocomplete.user.isLoading,
        options: state.common.autocomplete.user.data,
    }),
    { loadOptions: loadUserAutocomplete }
)( UserTypeahead );
