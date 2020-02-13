/* @flow */

import { get } from 'app/utils/lo/lo';
import { loadData, loadTableData, mutateData } from 'app/utils/redux/action-utils';

import thingAutocompleteQuery from 'graphql/entities/things/thingAutocompleteQuery';
import thingChildrenQuery from 'graphql/entities/things/thingChildrenQuery';
import thingsQuery from 'graphql/entities/things/thingsQuery';
import thingQueryBuilder from 'graphql/entities/things/thingQueryBuilder';
import saveThingMutation from 'graphql/entities/things/saveThingMutation';

export const THING_SAVE_STARTED: string = '@@affectli/entities/things/THING_SAVE_STARTED';
export const THING_SAVE: string = '@@affectli/entities/things/THING_SAVE';

export const LOAD_THINGS_GRID_STARTED: string = '@@affectli/entities/things/LOAD_THINGS_GRID_STARTED';
export const LOAD_THINGS_GRID: string = '@@affectli/entities/things/LOAD_THINGS_GRID';

export const LOAD_THING_STARTED: string = '@@affectli/entities/things/LOAD_THING_STARTED';
export const LOAD_THING: string = '@@affectli/entities/things/LOAD_THING';

export const LOAD_CHILDREN_STARTED: string = '@@affectli/entities/things/LOAD_CHILDREN_STARTED';
export const LOAD_CHILDREN: string = '@@affectli/entities/things/LOAD_CHILDREN';
export const LOAD_CHILDREN_FAILED: string = '@@affectli/entities/things/LOAD_CHILDREN_FAILED';

export const OPEN_THING_STARTED: string = '@@affectli/entities/things/OPEN_THING_STARTED';
export const OPEN_THING: string = '@@affectli/entities/things/OPEN_THING';

export const LOAD_RECURSIVE_CLASSES_STARTED: string = '@@affectli/entities/things/LOAD_RECURSIVE_CLASSES_STARTED';
export const LOAD_RECURSIVE_CLASSES: string = '@@affectli/entities/things/LOAD_RECURSIVE_CLASSES';

export const LOAD_THING_AUTOCOMPLETE_STARTED = '@@affectli/users/LOAD_THING_AUTOCOMPLETE_STARTED';
export const LOAD_THING_AUTOCOMPLETE = '@@affectli/users/LOAD_THING_AUTOCOMPLETE';

/**
 * Loads the suggestions for the thing autocomplete component.
 */
export const loadThingAutocomplete = loadData(LOAD_THING_AUTOCOMPLETE_STARTED, LOAD_THING_AUTOCOMPLETE, thingAutocompleteQuery);

export const saveThing = (record: Object) =>
    mutateData(
        THING_SAVE_STARTED,
        THING_SAVE,
        saveThingMutation,
        !get(record, 'id', false) ? 'Thing added.' : 'Thing updated.'
    )({ record });

/**
 * Load the Things List
 *
 * @param options the options ({ page, pageSize, countMax, where, orderBy, download })
 */
export const loadThingsList = loadTableData(LOAD_THINGS_GRID_STARTED, LOAD_THINGS_GRID, thingsQuery);

/**
 * Load the detail of the specified Thing
 *
 * @param id the ID of the Thing to load
 */
export const loadThing = (id: string) =>
    loadData(LOAD_THING_STARTED, LOAD_THING, thingQueryBuilder(Number(id)))({ id });

/**
 * Load the children of the specified Thing.
 *
 * @param id parent id
 */
export const loadChildren = (id: string) =>
    loadData(LOAD_CHILDREN_STARTED, LOAD_CHILDREN, thingChildrenQuery)({ id, filterBy: [{ field: 'parent.id', op: '=', value: id }] });
