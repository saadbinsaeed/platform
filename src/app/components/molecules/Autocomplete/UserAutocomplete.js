/* @flow */

import { connect } from 'react-redux';

import { loadUserAutocomplete } from 'store/actions/admin/usersActions';
import AbstractUserAutocomplete from './AbstractUserAutocomplete';

/**
 * Select one or more users using lazy loading.
 */
class UserAutocomplete extends AbstractUserAutocomplete {

    static propTypes = {
        ...AbstractUserAutocomplete.propTypes,
    }

};

export default connect(
    state => ({
        isLoading: state.common.autocomplete.user.isLoading,
        options: state.common.autocomplete.user.data,
    }),
    { loadOptions: loadUserAutocomplete }
)( UserAutocomplete );
