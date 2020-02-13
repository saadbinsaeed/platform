// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { onlyUpdateForKeys } from 'recompose';

import Icon from 'app/components/atoms/Icon/Icon';
import InputWrapper from 'app/components/atoms/InputWrapper/InputWrapper';
import ItemInfo from 'app/components/molecules/ItemInfo/ItemInfo';
import EditableRow from 'app/components/molecules/EditableRow/EditableRow';
import DateTimePickerModal from 'app/components/molecules/DataTimePicker/DateTimePickerModal';
import { datefy } from 'app/utils/utils';
import { formatDate } from 'app/utils/date/date';
import { bmpnVariablesToObject } from 'app/utils/bpmn/bpmnEngineUtils';

const Label = styled.strong`
`;

const Expand = styled.div`
width: 100%;
`;

const TaskScheduleCard = onlyUpdateForKeys(['details'])((props: Object) => {
    const { updateField, details } = props;
    const { startDate, lastUpdate, claimDate, dueDate, endDate } = details || {};
    const bpmnVariables = bmpnVariablesToObject(details.bpmnVariables);
    const disabled = !!endDate;

    const start = datefy(bpmnVariables.startDate);
    const due = datefy(dueDate);

    return (
        <Fragment>
            <InputWrapper>
                <Label>Created</Label>
                <ItemInfo
                    icon={<Icon name="calendar-blank" />}
                    title={(startDate && formatDate(startDate)) || 'No Date'}
                />
            </InputWrapper>
            <InputWrapper>
                <Label>Last Modified</Label>
                <ItemInfo
                    icon={<Icon name="history" />}
                    title={(lastUpdate && formatDate(lastUpdate)) || 'No Modified Date'}
                />
            </InputWrapper>
            <InputWrapper>
                <Label>Claimed</Label>
                <ItemInfo
                    icon={<Icon name="history" />}
                    title={(claimDate && formatDate(claimDate)) || 'No Claim Date'}
                />
            </InputWrapper>
            <InputWrapper>
                <Label>Start Date</Label>
                <EditableRow
                    name="bpmnVariables.startDate"
                    value={start}
                    EditComponent={({ onChange, name, value }) =>
                        <Expand>
                            <DateTimePickerModal
                                name={name}
                                onChange={onChange}
                                maxDate={due || null}
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
                        title={(bpmnVariables.startDate && formatDate(bpmnVariables.startDate)) || 'No Start Date'}
                    />
                </EditableRow>
            </InputWrapper>
            <InputWrapper>
                <Label>Due Date</Label>
                <EditableRow
                    name="dueDate"
                    value={due}
                    EditComponent={({ onChange, name, value }) =>
                        <Expand>
                            <DateTimePickerModal
                                name={name}
                                onChange={onChange}
                                value={value}
                                minDate={start || null}
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
                    />
                </EditableRow>
            </InputWrapper>
            { endDate && <InputWrapper>
                <Label>End Date</Label>
                <ItemInfo
                    icon={<Icon name="calendar-blank" />}
                    title={formatDate(endDate)}
                />
            </InputWrapper> }
        </Fragment>
    );
});

export default TaskScheduleCard;
