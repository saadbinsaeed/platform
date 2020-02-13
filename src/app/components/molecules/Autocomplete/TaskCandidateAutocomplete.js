/* @flow */

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { loadTaskCandidateAutocomplete } from 'store/actions/abox/taskActions';
import AbstractUserAutocomplete from './AbstractUserAutocomplete';

/**
 * Select one or more users using lazy loading.
 */
class TaskCandidateAutocomplete extends AbstractUserAutocomplete {

    static propTypes = {
        ...AbstractUserAutocomplete.propTypes,
        taskId: PropTypes.string.isRequired,
    }

    loadOptions(options: Object) {
        const taskId = this.props.taskId;
        return this.props.loadOptions({ ...options, taskId });
    }

};

export default connect(
    state => ({
        isLoading: state.common.autocomplete.taskCandidates.isLoading,
        options: state.common.autocomplete.taskCandidates.data,
    }),
    { loadOptions: loadTaskCandidateAutocomplete }
)( TaskCandidateAutocomplete );
