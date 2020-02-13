/* @flow */

import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import memoize from 'memoize-one';

import TaskCandidateAutocomplete from 'app/components/molecules/Autocomplete/TaskCandidateAutocomplete';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import PriorityRenderer from 'app/components/molecules/Grid/Renderers/Priority/PriorityRenderer';
import AboxProgressSlider from 'app/components/atoms/ProgressSlider/AboxProgressSlider';
import Icon from 'app/components/atoms/Icon/Icon';
import EditableRow from 'app/components/molecules/EditableRow/EditableRow';
import DateTimePickerModal from 'app/components/molecules/DataTimePicker/DateTimePickerModal';
import Select from 'app/components/molecules/Autocomplete/Select';
import ItemInfo from 'app/components/molecules/ItemInfo/ItemInfo';
import Avatar from 'app/components/molecules/Avatar/Avatar';
import PeopleLink from 'app/components/atoms/Link/PeopleLink';
import Carousel from 'app/components/atoms/Carousel/Carousel';
import FormGenerator from 'app/containers/Designer/Form/components/FormGenerator';
import { bmpnVariablesToObject } from 'app/utils/bpmn/bpmnEngineUtils';
import statefulInput from 'app/utils/hoc/statefulInput';
import { get } from 'app/utils/lo/lo';
import { formatDate } from 'app/utils/date/date';
import { PRIORITY_OPTIONS } from 'app/config/aboxConfig';
import { normalizeFields } from 'app/utils/designer/form/formUtils';

const CarouselStyled = styled(Carousel)`
    background: rgba(0,0,0,.2);
    padding: 0 .5rem;
`;

const Label = styled.strong`
    display: block;
    font-size: .7rem;
    margin-bottom: 0.5rem;
`;
const Expand = styled.div`
    width: 100%;
`;
const SliderItemStyled = styled.div`
    min-height: 4rem;
    padding: 1rem 2.5rem;
`;

const StatefulDropdown = statefulInput(Select);

/**
 *
 */
class TaskFormTab extends PureComponent<Object, Object> {

    static propTypes = {
        details: PropTypes.object,
        updateField: PropTypes.func,
    };

    static sliderResponsiveConfig = {
        '0': { items: 1 },
        '1024': { items: 5 }
    }

    normalizeFormDefinitionFields = memoize(fields => normalizeFields(fields));

    normalizeVariables = memoize((taskVariables, processVariables) => ({
        global: bmpnVariablesToObject(processVariables),
        local: bmpnVariablesToObject(taskVariables),
    }));

    /**
     * @override
     */
    render(): Object {
        const { details, updateField } = this.props;
        const { id, variable, priority, endDate, dueDate, assignee, children, process } = details || {};
        const variables = this.normalizeVariables(get(details, 'bpmnVariables'), get(process, 'bpmnVariables'));

        const start = variables.local.startDate ? new Date(variables.local.startDate) : null;
        const due = dueDate ? new Date(dueDate) : null;

        const priorityOption = PRIORITY_OPTIONS[priority - 1];
        const disabled = !!endDate;
        const hasSubtasks = !!(children && children.length);
        const progress = Math.floor(Number(get(variable, 'completion', 0)));

        const CarouselPortal = document && document.getElementById('carousel-item');

        const version = get(details, 'form.definition.version');
        let components;
        if (version) {
            components = this.normalizeFormDefinitionFields(get(details, 'form.definition.fields'));
        }
        return (
            <ContentArea>
                <Fragment>
                    <CarouselStyled
                        responsive={TaskFormTab.sliderResponsiveConfig}
                        items={[
                            <SliderItemStyled>
                                <Label>Assignee</Label>
                                <EditableRow
                                    name="assignee"
                                    value={assignee}
                                    EditComponent={editProps =>
                                        <Expand>
                                            <TaskCandidateAutocomplete
                                                {...editProps}
                                                taskId={id}
                                                appendTo={CarouselPortal}
                                                placeholder="Select Assignee"
                                            />
                                        </Expand>
                                    }
                                    save={updateField}
                                    disabled={disabled}
                                    showClose
                                >
                                    { !assignee ?
                                        <div>No Assignee</div> :
                                        <ItemInfo
                                            icon={<Avatar src={get(assignee, 'image')} name={get(assignee, 'name')} size="lg" />}
                                            title={<PeopleLink id={get(assignee, 'id')}>{get(assignee, 'name')}</PeopleLink>}
                                            subtitle={<em>@{get(assignee, 'login')}</em>}
                                        />
                                    }
                                </EditableRow>
                            </SliderItemStyled>,
                            <SliderItemStyled>
                                <Label>Start date</Label>
                                <EditableRow
                                    name="bpmnVariables.startDate"
                                    value={start}
                                    EditComponent={({ name, value, onChange }) =>
                                        <Expand>
                                            <DateTimePickerModal
                                                name={name}
                                                maxDate={due || null}
                                                onChange={onChange}
                                                value={value}
                                            />
                                        </Expand>
                                    }
                                    save={updateField}
                                    showClose
                                    disabled={disabled}
                                >
                                    <ItemInfo
                                        icon={<Icon name="calendar-blank" />}
                                        title={(variables.local.startDate && formatDate(variables.local.startDate)) || 'No Start Date'}
                                        subtitle={(variables.local.startDate && moment(variables.local.startDate).from(moment()))}
                                    />
                                </EditableRow>
                            </SliderItemStyled>,
                            <SliderItemStyled>
                                <Label>Due date</Label>
                                <EditableRow
                                    name="dueDate"
                                    value={due}
                                    EditComponent={({ name, value, onChange }) =>
                                        <Expand>
                                            <DateTimePickerModal
                                                name={name}
                                                minDate={start || null}
                                                onChange={onChange}
                                                value={value}
                                            />
                                        </Expand>
                                    }
                                    save={updateField}
                                    showClose
                                    disabled={disabled}
                                >
                                    <ItemInfo
                                        icon={<Icon name="calendar-blank" />}
                                        title={(dueDate && formatDate(dueDate)) || 'No Due Date'}
                                        subtitle={(dueDate && moment(dueDate).from(moment()))}
                                    />
                                </EditableRow>
                            </SliderItemStyled>,
                            <SliderItemStyled>
                                <Label>Priority</Label>
                                <EditableRow
                                    name="priority"
                                    value={priority === 50 ? 3 : priority}
                                    EditComponent={editProps =>
                                        <Expand>
                                            <StatefulDropdown
                                                {...editProps}
                                                placeholder="Select Priority"
                                                options={PRIORITY_OPTIONS}
                                                appendTo={CarouselPortal}
                                            />
                                        </Expand>
                                    }
                                    save={updateField}
                                    disabled={disabled}
                                    showClose
                                >
                                    <ItemInfo
                                        icon={<PriorityRenderer value={priority} data={{ endDate }} />}
                                        title={get(priorityOption, 'label')}
                                    />
                                </EditableRow>
                            </SliderItemStyled>,
                            <SliderItemStyled>
                                <Label>Progress {progress}%</Label>
                                {hasSubtasks && <Label>{'(based on the subtasks\' progress)'}</Label>}
                                <AboxProgressSlider
                                    name="progress"
                                    value={progress}
                                    priority={priority}
                                    onChange={updateField}
                                    disabled={disabled || hasSubtasks}
                                />
                            </SliderItemStyled>
                        ]}
                    />
                    { version && <FormGenerator components={components} variables={variables} /> }
                </Fragment>
            </ContentArea>
        );
    }
}

export default TaskFormTab;
