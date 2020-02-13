/* @flow */

import React, { Fragment } from 'react';
import styled from 'styled-components';
import { onlyUpdateForKeys } from 'recompose';

import UserAutocomplete from 'app/components/molecules/Autocomplete/UserAutocomplete';
import AboxProgressSlider from 'app/components/atoms/ProgressSlider/AboxProgressSlider';
import ProcessLink from 'app/components/atoms/Link/ProcessLink';
import TaskLink from 'app/components/atoms/Link/TaskLink';
import ItemInfo from 'app/components/molecules/ItemInfo/ItemInfo';
import Avatar from 'app/components/molecules/Avatar/Avatar';
import InputWrapper from 'app/components/atoms/InputWrapper/InputWrapper';
import EditableRow from 'app/components/molecules/EditableRow/EditableRow';
import ProgressRenderer from 'app/components/molecules/Grid/Renderers/Progress/ProgressRenderer';
import PriorityRenderer from 'app/components/molecules/Grid/Renderers/Priority/PriorityRenderer';
import Select from 'app/components/molecules/Autocomplete/Select';
import PeopleLink from 'app/components/atoms/Link/PeopleLink';
import statefulInput from 'app/utils/hoc/statefulInput';
import { PRIORITY_OPTIONS } from 'app/config/aboxConfig';
import { get } from 'app/utils/lo/lo';
import { getNum } from 'app/utils/utils';

const Label = styled.strong`
`;

const Expand = styled.div`
width: 100%;
`;

const StatefullDropdown = statefulInput(Select);

const TaskDetailCard = onlyUpdateForKeys(['details'])((props: Object) => {
    const { updateField, details } = props;
    const { parent, owner, variable, endDate, process, children } = details || {};
    const disabled = !!endDate;
    const hasSubtasks = !!(children && children.length);
    const priority = getNum(details, 'priority') || 3;
    const parentEntity = parent || process;
    let completion, parentPriority;
    if (parent) {
        completion = Math.floor(Number(get(parent, 'variable.completion', 0)));
        parentPriority = get(parent, 'priority', 3);
    } else {
        completion = Math.floor(Number(get(process, 'variables.progress', 0)));
        parentPriority = get(process, 'variables.priority', 3);
    }

    const parentEntityId = String(get(parentEntity, 'id'));
    const progress = Math.floor(Number(get(variable, 'completion', 0)));
    const LinkComponent = parent ? TaskLink : ProcessLink;
    return (
        <Fragment>
            <InputWrapper>
                <Label>Parent {parent ? 'Task' : 'Process'}</Label>
                <ItemInfo
                    icon={
                        <ProgressRenderer
                            value={completion}
                            data={{ endDate: get(parentEntity, 'endDate'), variables: { priority: parentPriority } }}
                        />
                    }
                    title={<LinkComponent id={parentEntityId}>{get(parentEntity, 'name') || 'No Name'}</LinkComponent>}
                    subtitle={<em>#{parentEntityId}</em>}
                />
            </InputWrapper>

            <InputWrapper>
                <Label>Owner</Label>
                <EditableRow
                    name="owner"
                    value={owner}
                    EditComponent={editProps => <Expand><UserAutocomplete {...editProps} placeholder="Select Owner" /></Expand>}
                    save={updateField}
                    disabled={disabled}
                    showClose
                >
                    {!owner ?
                        'No Owner' :
                        <ItemInfo
                            icon={<Avatar src={owner.image} name={owner.name} size="lg" />}
                            title={<PeopleLink id={owner.id}>{owner.name}</PeopleLink>}
                            subtitle={owner.login}
                        />
                    }
                </EditableRow>
            </InputWrapper>

            <InputWrapper>
                <Label>Priority</Label>
                <EditableRow
                    name="priority"
                    value={priority === 50 ? 3 : priority}
                    EditComponent={
                        editProps =>
                            <Expand>
                                <StatefullDropdown {...editProps} placeholder="Select Priority" options={PRIORITY_OPTIONS} />
                            </Expand>
                    }
                    save={updateField}
                    disabled={disabled}
                    showClose
                >
                    <ItemInfo
                        icon={<PriorityRenderer value={priority} data={{ endDate }} />}
                        title={get(PRIORITY_OPTIONS.find(({ value }) => value === priority), 'label')}
                    />
                </EditableRow>
            </InputWrapper>

            <InputWrapper>
                <Label>Progress {progress}%</Label>
                {hasSubtasks && <div><small>{'(progress based on the subtasks\' progress)'}</small></div>}
                <AboxProgressSlider
                    name="progress"
                    value={progress}
                    onChange={updateField}
                    priority={priority}
                    disabled={disabled || hasSubtasks}
                />
            </InputWrapper>
        </Fragment>
    );
});

export default TaskDetailCard;
