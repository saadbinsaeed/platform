/* @flow */

import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import UserAutocomplete from 'app/components/molecules/Autocomplete/UserAutocomplete';
import TaskMemberAutocomplete from 'app/components/molecules/Autocomplete/TaskMemberAutocomplete';
import Modal from 'app/components/molecules/Modal/Modal';
import Button from 'app/components/atoms/Button/Button';
import GroupAutocomplete from 'app/components/molecules/Autocomplete/GroupAutocomplete';
import Loader from 'app/components/atoms/Loader/Loader';

/**
 * A modal for search and add team members
 */
class AddTeamMemberModal extends PureComponent<Object, Object> {

    static propTypes = {
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['task', 'process']).isRequired,
        open: PropTypes.bool,
        loading: PropTypes.bool,
        filterBy: PropTypes.arrayOf(PropTypes.object),
        onChange: PropTypes.func.isRequired,
        onToggle: PropTypes.func.isRequired,
    }

    state = { team: [], groups: [], filteredTeam: null };

    submit = () => {
        const { onChange } = this.props;
        const { team, groups } = this.state;
        this.setState({
            team: [],
            groups: []
        }, () => onChange && onChange({ team, groups }));
    };

    updateTeamValue = (event: Object) => this.setState({ team: event.value });
    updateGroupValue = (event: Object) => this.setState({ groups: event.value });

    render() {
        const { type, id, open, userFilterBy, groupFilterBy, onToggle, loading } = this.props;
        const { team, groups } = this.state;
        const MemberAutocomplete = type === 'task' ? TaskMemberAutocomplete : UserAutocomplete;
        const userAutocompleteProps: Object = {
            name: 'team',
            placeholder: 'Search for a user...',
            onChange: this.updateTeamValue,
            value: team,
            filterBy: userFilterBy,
            multiple: true,
        };
        if (type === 'task') {
            userAutocompleteProps.taskId = id;
        }
        return (
            <Modal title="Add team members"
                open={open}
                disableBack
                onToggle={onToggle}
                height={300}
                footer={
                    <Fragment>
                        <Button onClick={onToggle}>Cancel</Button>
                        <Button color="primary" onClick={this.submit} disabled={team.length <= 0 && groups.length <= 0}>
                            Add team members
                        </Button>
                    </Fragment>
                }
            >
                {loading && <Loader absolute backdrop/>}
                <MemberAutocomplete {...userAutocompleteProps} />
                <GroupAutocomplete
                    name={'groups'}
                    placeholder={'Search for a group...'}
                    onChange={this.updateGroupValue}
                    value={groups}
                    filterBy={groupFilterBy}
                    multiple
                />
            </Modal>
        );
    }
};

export default AddTeamMemberModal;
