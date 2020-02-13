/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import { loadUserSelect } from 'store/actions/admin/usersActions';
import { includes } from 'app/utils/filter/filterUtils';

import Autocomplete from './Autocomplete';

/**
 * Select one or more users using client side search.
 */
class UserSelect extends PureComponent<Object, Object> {

    static propTypes = {
        ...Autocomplete.propTypes,
        loadUsersSelect: PropTypes.func.isRequired,
        options: PropTypes.arrayOf(PropTypes.object),
    }

    state = { filteredOptions: [] };

    componentDidMount() {
        this.props.loadUsersSelect();
    }

    buildOptions = memoize(options =>
        (options || []).map(({ id, login, name }) => ({ id, name: `${name} (${login})` }))
    );

    suggest = (event) => {
        this.setState({
            filteredOptions: includes(this.buildOptions(this.props.options), event.query, { property: 'name' }).map(item => ({ ...item }))
        });
    };

    onChange = (event: Object) => {
        const { onChange, name } = this.props;
        onChange && onChange({ ...event, target: { name, value: event.value } });
    };

    render() {
        // remove the properties that we do not have to pass to the prime Autocomplete
        const { options, loadUsersSelect, ...autocompleteProps } = this.props; // eslint-disable-line no-unused-vars
        const { filteredOptions } = this.state;
        return (
            <Autocomplete
                placeholder="Search for a user..."
                {...autocompleteProps}
                field="name"
                onChange={this.onChange}
                completeMethod={this.suggest}
                suggestions={filteredOptions}
            />
        );
    }
};

export default connect(
    state => ({
        options: state.common.select.user.data,
    }),
    { loadUserSelect }
)( UserSelect );
