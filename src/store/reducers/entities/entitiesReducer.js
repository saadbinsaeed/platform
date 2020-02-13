/* @flow */
import { combineReducers } from 'redux';

import { LOAD_ENTITY_ACTIVITIES_STARTED, LOAD_ENTITY_ACTIVITIES } from 'store/actions/entities/entitiesActions';
import {
    GET_RELATIONSHIPS_STARTED,
    GET_RELATIONSHIPS,
    GET_RELATIONSHIP_STARTED,
    GET_RELATIONSHIP,
    LOAD_RELATIONSHIP_ENTITIES_ADD_STARTED,
    LOAD_RELATIONSHIP_ENTITIES_ADD,
    LOAD_RELATIONSHIP_CLASSIFICATIONS, LOAD_RELATIONSHIP_CLASSIFICATIONS_STARTED,
    LOAD_ENTITY_DATA_STARTED,
    LOAD_ENTITY_DATA
} from 'store/actions/entities/relationshipsActions';
import { GET_ATTACHMENTS_STARTED, GET_ATTACHMENTS } from 'store/actions/common/attachmentsActions';

import { dataTableReducer, loadDataReducer } from 'app/utils/redux/reducer-utils';

import common from './common/entitiesCommonReducer';
import things from './things/thingsReducer';
import organisations from './organisations/organisationsReducer';
import people from './people/peopleReducer';
import directories from './directories/directoriesReducer';
import commonClassifications from './commonClassifications/commonClassificationsReducer';
import customEntities from 'store/reducers/entities/customEntities/customEntitiesReducer';

export default combineReducers({
    commonClassifications,
    common,
    things,
    organisations,
    people,
    directories,
    customEntities,
    activities: dataTableReducer(LOAD_ENTITY_ACTIVITIES_STARTED, LOAD_ENTITY_ACTIVITIES),
    attachments: dataTableReducer(GET_ATTACHMENTS_STARTED, GET_ATTACHMENTS, () => true),
    relationships: dataTableReducer(GET_RELATIONSHIPS_STARTED, GET_RELATIONSHIPS),
    relationship: loadDataReducer(GET_RELATIONSHIP_STARTED, GET_RELATIONSHIP),
    relationshipsAdd: dataTableReducer(LOAD_RELATIONSHIP_ENTITIES_ADD_STARTED, LOAD_RELATIONSHIP_ENTITIES_ADD, () => true),
    entityData: loadDataReducer(LOAD_ENTITY_DATA_STARTED, LOAD_ENTITY_DATA),
    relationshipClassifications: loadDataReducer(LOAD_RELATIONSHIP_CLASSIFICATIONS_STARTED, LOAD_RELATIONSHIP_CLASSIFICATIONS)
});
