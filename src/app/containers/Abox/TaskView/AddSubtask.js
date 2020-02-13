/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import UserAutocomplete from 'app/components/molecules/Autocomplete/UserAutocomplete';
import Button from 'app/components/atoms/Button/Button';
import Form from 'app/components/atoms/Form/Form';
import Field from 'app/components/molecules/Field/Field';
import ModalFooter from 'app/components/molecules/Modal/ModalFooter';
import history from 'store/History';
import Dropdown from 'app/components/atoms/Dropdown/Dropdown';
import DateTimePickerModal from 'app/components/molecules/DataTimePicker/DateTimePickerModal';
import { PRIORITY_OPTIONS } from 'app/config/aboxConfig';
import { set } from 'app/utils/lo/lo';
import { setSeconds } from 'app/utils/date/date';

/**
 * Renders the form to a add a Thing
 */
class AddSubtask extends PureComponent<Object, Object> {

    static propTypes = {
        addSubtask: PropTypes.func.isRequired,
        refreshList: PropTypes.func.isRequired,
        taskId: PropTypes.string.isRequired,
        isLoading: PropTypes.bool,
        userProfile: PropTypes.object,
        onSubtaskAdded: PropTypes.func,
    };

    /**
     * @param props the Component's properties
     */
    constructor( props: Object ) {
        super( props );
        const { name, login, id } = props.userProfile;
        const user = { id, name, login };
        this.state = {
            name: '',
            description: '',
            category: null,
            owner: user,
            assignee: user,
            dueDate: null,
            bpmnVariables: { startDate: null },
        };
    }

    /**
     * Handle the form submit event.
     * @param e the form submit SyntheticEvent (https://facebook.github.io/react/docs/events.html)
     */
    onFormSubmit = ( e: Event ) => {
        e.preventDefault();
        const subtask = { ...this.state };
        const { addSubtask, refreshList, closeAddSubtask, taskId } = this.props;
        addSubtask(String(taskId), subtask).then((response) => {
            if (response instanceof Error) return;
            refreshList();
            closeAddSubtask();
            this.props.onSubtaskAdded && this.props.onSubtaskAdded(subtask);
        });
    };

    /**
     * Handle the on change event of the elements inside of the form.
     * @param event the on change SyntheticEvent (https://facebook.github.io/react/docs/events.html)
     */
    onChange = (event: Object) => {
        const { name, value } = event.target || event;
        let next = { ...this.state };
        if (name === 'bpmnVariables.startDate') {
            const start = setSeconds(value, 0, 0);
            const due = setSeconds(this.state.dueDate, 0, 0);
            if (start && due && due <= start) {
                next.dueDate = new Date(start.getTime() + 3600000);
            }
        } else if (name === 'dueDate') {
            const start = setSeconds(this.state.bpmnVariables.startDate, 0, 0);
            const due = setSeconds(value, 0, 0);
            if (start && due && start >= due) {
                next = set(next, 'bpmnVariables.startDate', new Date(due.getTime() - 3600000));
            }
        }
        this.setState(set(next, name, value));
    };

    onDropdownChange = (event: Object) => {
        const { name, value } = event.target;
        this.setState({ [name]: { id: value }});
    };

    /**
     * @override
     */
    render(): Object {
        // Vars used in our form
        const { isLoading } = this.props;
        const { name, priority, description, assignee, owner, dueDate, bpmnVariables: { startDate } } = this.state;

        return (
            <Form loading={isLoading} onSubmit={this.onFormSubmit}>
                <Field
                    label="Name"
                    name="name"
                    value={name}
                    placeholder="Enter the name"
                    onChange={this.onChange}
                    pattern=".{3,50}"
                    required
                    title="3 to 50 characters"
                />
                <Field
                    label="Description"
                    name="description"
                    value={description}
                    placeholder="Enter the description"
                    onChange={this.onChange}
                    required
                />
                <DateTimePickerModal
                    label="Start Date"
                    name="bpmnVariables.startDate"
                    minDate={new Date()}
                    onChange={this.onChange}
                    value={startDate}
                    placeholder="Enter the start date"
                />
                <DateTimePickerModal
                    label="Due Date"
                    name="dueDate"
                    minDate={new Date()}
                    onChange={this.onChange}
                    value={dueDate}
                    placeholder="Enter the due date"
                />
                <UserAutocomplete
                    name="assignee"
                    label="Assignee"
                    value={assignee}
                    placeholder="Select Assignee"
                    onChange={this.onChange}
                />

                <UserAutocomplete
                    name="owner"
                    label="Owner"
                    value={owner}
                    placeholder="Select Owner"
                    onChange={this.onChange}
                />

                <Dropdown
                    label="Priority"
                    name="priority"
                    placeholder="Select Priority"
                    onChange={this.onChange}
                    value={priority}
                    options={PRIORITY_OPTIONS}
                />

                <ModalFooter>
                    <Button type="button" onClick={history.pushBack}>Cancel</Button>
                    <Button type="submit" color="primary">Submit</Button>
                </ModalFooter>
            </Form>
        );
    }
}

export default connect(state => ({
    userProfile: state.user.profile,
}), null)(AddSubtask);
