// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import { onlyUpdateForKeys } from 'recompose';

import ItemInfo from 'app/components/molecules/ItemInfo/ItemInfo';
import InputText from 'app/components/atoms/Input/InputText';
import AboxCircularProgressBar from 'app/components/atoms/CircularProgressBar/AboxCircularProgressBar';
import TextArea from 'app/components/atoms/TextArea/TextArea';
import InputWrapper from 'app/components/atoms/InputWrapper/InputWrapper';
import Avatar from 'app/components/molecules/Avatar/Avatar';
import EditableRow from 'app/components/molecules/EditableRow/EditableRow';
import TaskCandidateAutocomplete from 'app/components/molecules/Autocomplete/TaskCandidateAutocomplete';
import PeopleLink from 'app/components/atoms/Link/PeopleLink';
import Text from 'app/components/atoms/Text/Text';
import statefulInput from 'app/utils/hoc/statefulInput';

const CircularProgressBarContainer = styled.div`
padding: 10px;
text-align: center;
& svg {
    margin: auto;
}
`;

const Expand = styled.div`
width: 100%;
& textarea {
    width: 100% !important;
    min-height: 109px;
    word-break: break-all;
}
`;

const Label = styled.strong`
`;

const TextAreaHoc = statefulInput(TextArea);

const formatDescription = memoize(description =>
    (description && description.split('\n').map((line, index) => <Fragment key={index}>{line}<br/></Fragment> )) || 'No Description'
);

const TaskAboutCard = onlyUpdateForKeys(['details'])((props: Object) => {

    const { details, updateField } = props;
    const { id, name, description, assignee = {}, variable, endDate, priority } = details || {};

    const disabled = !!endDate;
    return (
        <Fragment>

            <CircularProgressBarContainer>
                <AboxCircularProgressBar disabled={disabled} priority={priority} percentage={(variable && variable.completion) || 0 } size={100} />
            </CircularProgressBarContainer>

            <InputWrapper>
                <Label>Task Name</Label>
                <EditableRow
                    name="name"
                    value={name || ''}
                    EditComponent={editProps => <InputText {...editProps} type="text" initialValue={name || ''} />}
                    save={updateField}
                    disabled={disabled}
                >
                    <Text>{name || 'No Name'}</Text>
                </EditableRow>
            </InputWrapper>

            <InputWrapper>
                <Label>Task ID</Label>
                <div>#{id}</div>
            </InputWrapper>

            <InputWrapper>
                <Label>Description</Label>
                <EditableRow
                    name="description"
                    value={description || ''}
                    EditComponent={editProps => <Expand><TextAreaHoc {...editProps} rows={5} /></Expand>}
                    save={updateField}
                    disabled={disabled}
                    showClose
                >
                    <Text>{formatDescription(description)}</Text>
                </EditableRow>
            </InputWrapper>

            <InputWrapper>
                <Label>Assignee</Label>
                <EditableRow
                    name="assignee"
                    value={assignee}
                    EditComponent={
                        editProps =>
                            <Expand>
                                <TaskCandidateAutocomplete {...editProps} taskId={id} placeholder="Select Assignee" />
                            </Expand>
                    }
                    save={updateField}
                    disabled={disabled}
                    showClose
                >
                    {!assignee ?
                        <div>No Assignee</div> :
                        <ItemInfo
                            icon={<Avatar src={assignee.image} name={assignee.name} size="lg" />}
                            title={<PeopleLink id={assignee.id}>{assignee.name}</PeopleLink>}
                            subtitle={<em>@{assignee.login}</em>}
                        />
                    }
                </EditableRow>
            </InputWrapper>
        </Fragment>
    );
});

export default TaskAboutCard;
