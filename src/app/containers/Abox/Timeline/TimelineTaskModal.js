/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import { PRIORITY_OPTIONS } from 'app/config/aboxConfig';

import moment from 'moment';
import { set } from 'app/utils/lo/lo';
import { setSeconds } from 'app/utils/date/date';
import { shallowEquals } from 'app/utils/utils';
import { saveText } from 'app/utils/datatable/datatableUtils';
import { bmpnVariablesToObject } from 'app/utils/bpmn/bpmnEngineUtils';
import { formatIcal } from 'app/utils/formatter/ical.formatter';
import { isDev } from 'app/utils/env';

import Modal from 'app/components/molecules/Modal/Modal';
import Button from 'app/components/atoms/Button/Button';
import Loader from 'app/components/atoms/Loader/Loader';
import DateTimePickerModal from 'app/components/molecules/DataTimePicker/DateTimePickerModal';
import Dropdown from 'app/components/atoms/Dropdown/Dropdown';
import UserAutocomplete from 'app/components/molecules/Autocomplete/UserAutocomplete';
import Form from 'app/components/atoms/Form/Form';
import Field from 'app/components/molecules/Field/Field';
import InputWrapper from 'app/components/atoms/InputWrapper/InputWrapper';
import AboxProgressSlider from 'app/components/atoms/ProgressSlider/AboxProgressSlider';
import { Label } from 'app/components/ABox/Timeline/style';

/**
 * A modal for search and add team members
 */
class TimelineTaskModal extends PureComponent<Object, Object> {
    static propTypes = {
        closeModal: PropTypes.func.isRequired,
        updateTask: PropTypes.func.isRequired,
        setTaskAssignee: PropTypes.func.isRequired,
        updateTimelineTask: PropTypes.func.isRequired,
        isOpen: PropTypes.bool,
        isLoading: PropTypes.bool,
        task: PropTypes.object
    }

    state = {
        name: '',
        description: '',
        assignee: null,
        dueDate: null,
        priority: null,
        bpmnVariables: { startDate: null },
        progress: 0
    }

    initialState = {}
    initialTask = {}

    constructor(props: Object) {
        super(props);
        this.initialState = { ...this.state };
    }

    componentDidUpdate(prevProps: Object) {
        const { task } = this.props;

        if (prevProps.task !== task) {
            if (task !== null) {
                const { name, description, assignee, dueDate, bpmnVariables, priority, variable: { completion } } = task;
                const bpmnVars = bmpnVariablesToObject(bpmnVariables);
                
                this.setState({
                    name: name,
                    description: description,
                    assignee: assignee,
                    dueDate: dueDate,
                    priority: priority,
                    progress: completion,
                    bpmnVariables: { startDate: bpmnVars.startDate },
                });
                this.initialTask = task;
            } else {
                this.setState(this.initialState);
                this.initialTask = {};
            }
        }
    }

    onSubmit = (event: Object) => {
        event.preventDefault();

        const { task, updateTimelineTask, updateTask, setTaskAssignee } = this.props;
        const data = { ...this.state, id: task.id };
        const dataAssignee = data.assignee ? { id: data.assignee.id, login: data.assignee.login } : null;
        const initialAssignee = this.initialTask.assignee ? { id: this.initialTask.assignee.id, login: this.initialTask.assignee.login } : null;

        // remove assignee and move it to a different dispatch
        delete data.assignee;

        updateTask(data).then((response) => {
            if (response instanceof Error) return;

            if (dataAssignee !== initialAssignee) {
                let assigneeSame = false;

                if (dataAssignee !== null && initialAssignee !== null) {
                    assigneeSame = shallowEquals(dataAssignee, initialAssignee);
                }

                if (!assigneeSame) {
                    setTaskAssignee(data.id, dataAssignee).then((response) => {
                        if (response instanceof Error) return;
                        updateTimelineTask(data);
                    });

                    return;
                }
            }

            updateTimelineTask(data);
        });
    }

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
    }

    onExport = () => {
        const { task: { id, startDate, dueDate, name, description } } = this.props;
        const dateIcalFormat = 'YYYYMMDDTHHmmss';
        const rootUrl = isDev ? 'https://affectli.dev.mi-c3.com' : 'https://affectli.mi-c3.com';
        const icalData = {
            id: id,
            stamp: moment(new Date()).format(dateIcalFormat),
            start: moment(startDate).format(dateIcalFormat),
            end: moment(dueDate).format(dateIcalFormat),
            summary: name,
            description: description,
            url: `${rootUrl}/#/abox/task/${id}`

        };
        const formattedIcalData = formatIcal(icalData);

        // download as file
        saveText(name, formattedIcalData, '.ics');
    }

    render() {
        const { isOpen, isLoading, closeModal, task } = this.props;
        const { name, priority, description, assignee, dueDate, bpmnVariables: { startDate }, progress } = this.state;
        const disabled = task && !!task.endDate;
        const hasSubtasks = task && !!(task._childrenCount && task._childrenCount.length);

        return (
            <Modal title="Update Task"
                open={isOpen}
                onToggle={closeModal}
                footer={
                    <Fragment>
                        <Button onClick={closeModal}>Cancel</Button>
                        <div>
                            <Button color="primary" onClick={this.onExport}>
                                Export
                            </Button>
                            {task && !task.endDate && <Button color="primary" onClick={this.onSubmit}>
                                Submit
                            </Button>}
                        </div>
                    </Fragment>
                }
            >
                {isLoading && <Loader absolute backdrop/>}

                <Form loading={isLoading} onSubmit={this.onSubmit}>
                    <Field
                        label="Name"
                        name="name"
                        value={name}
                        placeholder="Enter the name"
                        onChange={this.onChange}
                        pattern=".{3,50}"
                        required
                        title="3 to 50 characters"
                        disabled={disabled}
                    />
                    <Field
                        label="Description"
                        name="description"
                        value={description}
                        placeholder="Enter the description"
                        onChange={this.onChange}
                        disabled={disabled}
                        required
                    />
                    <DateTimePickerModal
                        label="Start Date"
                        name="bpmnVariables.startDate"
                        onChange={this.onChange}
                        value={startDate}
                        placeholder="Enter the start date"
                        readOnly={disabled}
                    />
                    <DateTimePickerModal
                        label="Due Date"
                        name="dueDate"
                        onChange={this.onChange}
                        value={dueDate}
                        placeholder="Enter the due date"
                        readOnly={disabled}
                    />
                    <UserAutocomplete
                        name="assignee"
                        label="Assignee"
                        value={assignee}
                        placeholder="Select Assignee"
                        onChange={this.onChange}
                        disabled={disabled}
                    />
                    <Dropdown
                        label="Priority"
                        name="priority"
                        placeholder="Select Priority"
                        onChange={this.onChange}
                        value={priority}
                        options={PRIORITY_OPTIONS}
                        disabled={disabled}
                    />
                    <InputWrapper>
                        <Label>Progress {progress}%</Label>
                        {hasSubtasks && <div><small>{'(progress based on the subtasks\' progress)'}</small></div>}
                        <AboxProgressSlider
                            name="progress"
                            value={progress}
                            onChange={this.onChange}
                            priority={priority}
                            disabled={disabled || hasSubtasks}
                        />
                    </InputWrapper>
                </Form>
            </Modal>
        );
    }
}

export default TimelineTaskModal;