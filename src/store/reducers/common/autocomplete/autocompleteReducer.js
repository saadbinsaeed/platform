/* @flow */

import { combineReducers } from 'redux';

import { loadDataReducer } from 'app/utils/redux/reducer-utils';
import { LOAD_CLASSIFICATION_AUTOCOMPLETE_STARTED, LOAD_CLASSIFICATION_AUTOCOMPLETE } from 'store/actions/classifications/classificationsActions';
import { LOAD_GROUP_AUTOCOMPLETE_STARTED, LOAD_GROUP_AUTOCOMPLETE } from 'store/actions/admin/groupsActions';
import { LOAD_USER_AUTOCOMPLETE_STARTED, LOAD_USER_AUTOCOMPLETE } from 'store/actions/admin/usersActions';
import { LOAD_PERSON_AUTOCOMPLETE_STARTED, LOAD_PERSON_AUTOCOMPLETE } from 'store/actions/entities/peopleActions';
import { LOAD_ORGANISATION_AUTOCOMPLETE_STARTED, LOAD_ORGANISATION_AUTOCOMPLETE } from 'store/actions/entities/organisationsActions';
import { LOAD_THING_AUTOCOMPLETE_STARTED, LOAD_THING_AUTOCOMPLETE } from 'store/actions/entities/thingsActions';
import { LOAD_CUSTOM_ENTITIES_AUTOCOMPLETE_STARTED, LOAD_CUSTOM_ENTITIES_AUTOCOMPLETE } from 'store/actions/entities/customEntitiesActions';
import { LOAD_RELATION_DEFINITION_AUTOCOMPLETE_STARTED, LOAD_RELATION_DEFINITION_AUTOCOMPLETE } from 'store/actions/entities/relationshipsActions';
import { LOAD_PROCESSES_AUTOCOMPLETE_STARTED, LOAD_PROCESSES_AUTOCOMPLETE } from 'store/actions/entities/processesActions';
import { LOAD_TASK_CANDIDATE_AUTOCOMPLETE_STARTED, LOAD_TASK_CANDIDATE_AUTOCOMPLETE } from 'store/actions/abox/taskActions';
import { LOAD_TASK_MEMBER_AUTOCOMPLETE_STARTED, LOAD_TASK_MEMBER_AUTOCOMPLETE } from 'store/actions/abox/taskActions';
import { LOAD_TASKS_AUTOCOMPLETE, LOAD_TASKS_AUTOCOMPLETE_STARTED } from 'store/actions/entities/tasksActions';
import { LOAD_DIRECTORIES_AUTOCOMPLETE_STARTED, LOAD_DIRECTORIES_AUTOCOMPLETE } from 'store/actions/common/DirectoriesActions';

export default combineReducers({
    classification: loadDataReducer(LOAD_CLASSIFICATION_AUTOCOMPLETE_STARTED, LOAD_CLASSIFICATION_AUTOCOMPLETE, () => true),
    group: loadDataReducer(LOAD_GROUP_AUTOCOMPLETE_STARTED, LOAD_GROUP_AUTOCOMPLETE, () => true),
    user: loadDataReducer(LOAD_USER_AUTOCOMPLETE_STARTED, LOAD_USER_AUTOCOMPLETE, () => true),
    person: loadDataReducer(LOAD_PERSON_AUTOCOMPLETE_STARTED, LOAD_PERSON_AUTOCOMPLETE),
    organisation: loadDataReducer(LOAD_ORGANISATION_AUTOCOMPLETE_STARTED, LOAD_ORGANISATION_AUTOCOMPLETE, () => true),
    thing: loadDataReducer(LOAD_THING_AUTOCOMPLETE_STARTED, LOAD_THING_AUTOCOMPLETE, () => true),
    customEntities: loadDataReducer(LOAD_CUSTOM_ENTITIES_AUTOCOMPLETE_STARTED, LOAD_CUSTOM_ENTITIES_AUTOCOMPLETE, () => true),
    relationDefinition: loadDataReducer(LOAD_RELATION_DEFINITION_AUTOCOMPLETE_STARTED, LOAD_RELATION_DEFINITION_AUTOCOMPLETE, () => true),
    processes: loadDataReducer(LOAD_PROCESSES_AUTOCOMPLETE_STARTED, LOAD_PROCESSES_AUTOCOMPLETE, () => true),
    taskCandidates: loadDataReducer(LOAD_TASK_CANDIDATE_AUTOCOMPLETE_STARTED, LOAD_TASK_CANDIDATE_AUTOCOMPLETE, () => true),
    taskMembers: loadDataReducer(LOAD_TASK_MEMBER_AUTOCOMPLETE_STARTED, LOAD_TASK_MEMBER_AUTOCOMPLETE, () => true),
    tasks: loadDataReducer(LOAD_TASKS_AUTOCOMPLETE_STARTED, LOAD_TASKS_AUTOCOMPLETE, () => true),
    directories: loadDataReducer(LOAD_DIRECTORIES_AUTOCOMPLETE_STARTED, LOAD_DIRECTORIES_AUTOCOMPLETE, () => true),
});
