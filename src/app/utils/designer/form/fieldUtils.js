/* @flow */

import React from 'react';
import { AvatarEditor as PUIAvatarEditor, Button as ButtonPui, TextField, Switch as SwitchPui, Typography, Autocomplete, AutocompleteLazy, DateTimePickerRange } from '@mic3/platform-ui';
import DateTimePicker from 'app/containers/Designer/Form/components/DateTime';
import GroupComponent from 'app/components/atoms/Designer/Group';
import ExpansionPanel from 'app/components/Designer/ExpansionPanel';
import Immutable from 'app/utils/immutable/Immutable';
import TextareaSmart from 'app/containers/Designer/Form/components/Textarea';
import { fieldify } from 'app/containers/Designer/Form/components/FormField';
import UserTypeahead from 'app/components/organisms/Form/Typeahead/UserTypeahead';
import GroupTypeahead from 'app/components/organisms/Form/Typeahead/GroupTypeahead';
import ClassificationTypeahead from 'app/components/organisms/Form/Typeahead/ClassificationTypeahead';
import ProcessTypeTypeahead from 'app/components/organisms/Form/Typeahead/ProcessTypeTypeahead';
import OrganisationTypeahead from 'app/components/organisms/Form/Typeahead/OrganisationTypeahead';
import CustomEntitiesTypeahead from 'app/components/organisms/Form/Typeahead/CustomEntitiesTypeahead';

const Text = fieldify(TextField);
const Textarea = fieldify(TextareaSmart);
const Panel = fieldify(ExpansionPanel);
const Group = fieldify(GroupComponent);
const Button = fieldify(ButtonPui);
const Switch = fieldify(SwitchPui);
const DateTime = fieldify(DateTimePicker);
const DateTimeRange = fieldify(DateTimePickerRange);
const DisplayText = fieldify(Typography);
const Typeahead = fieldify(Autocomplete);
const TypeaheadLazy = fieldify(AutocompleteLazy);
const UserTh = fieldify(UserTypeahead);
const GroupTh = fieldify(GroupTypeahead);
const ClassificationTh = fieldify(ClassificationTypeahead);
const ProcessTypeTh = fieldify(ProcessTypeTypeahead);
const OrganisationTh = fieldify(OrganisationTypeahead);
const CustomEntitiesTh = fieldify(CustomEntitiesTypeahead);
const AvatarEditor = fieldify(PUIAvatarEditor);

/**
 * For customizing properties we have to change `app/utils/designer/form/fieldSettingsUtils.js` file
 */
const elementsDefinitions = Immutable([
    { type: 'text' },
    { type: 'textarea', defaults: { rows: 5, parseAs: 'text' } },
    { type: 'number' },
    { type: 'boolean' },
    { type: 'dateTime', defaults: { fullWidth: true, variant: 'filled' }},
    { type: 'dateTimeRange', defaults: { fullWidth: true, variant: 'filled' }},
    { type: 'outcome' },
    { type: 'group', defaults: { children: [] }},
    { type: 'panel', defaults: { children: [] }},
    { type: 'displayText' },
    { type: 'header', defaults: { variant: 'h3' } },
    { type: 'typeahead', defaults: { isFetching: false } },
]);

export const getElementsDefinitions = () => elementsDefinitions;

export const getFieldByType = (type: string, properties: Object, children: ?Array<Object>) => {
    switch (type) {
        case 'panel':
            return (
                <Panel {...properties}>{children}</Panel>
            );
        case 'group':
            return <Group {...properties}>{children}</Group>;
        case 'outcome': {
            const { label, ...rest } = properties;
            return <Button {...rest}>{label}</Button>;
        }
        case 'text':
            return <Text {...properties} />;
        case 'textarea':
            return <Textarea {...properties} />;
        case 'number':
            return <Text {...properties} type="number" />;
        case 'boolean':
            return <Switch {...properties} />;
        case 'dateTime':
            return <DateTime fullWidth variant="filled" ampm={false} {...properties} />;
        case 'dateTimeRange':
            return <DateTimeRange fullWidth variant="filled" {...properties} />;
        case 'displayText': {
            const { text, ...rest } = properties;
            return <DisplayText align="left" variant="caption" {...rest}>{text}</DisplayText>;
        }
        case 'header': {
            const { text, ...rest } = properties;
            return <DisplayText align="left" {...rest}>{text}</DisplayText>;
        }
        case 'typeahead': {
            const { isFetching, fetchData, valueField, parseAs, ...rest } = properties;
            return isFetching ?
                <TypeaheadLazy {...rest} fetchData={fetchData} valueField={valueField} />
                : <Typeahead {...rest} valueField="value"/>;
        }
        case 'processTypeTypeahead': {
            return <ProcessTypeTh {...properties}/>;
        }
        case 'userTypeahead': {
            return <UserTh {...properties}/>;
        }
        case 'groupTypeahead': {
            return <GroupTh {...properties}/>;
        }
        case 'classificationTypeahead': {
            return <ClassificationTh  {...properties}/>;
        }
        case 'organisationTypeahead': {
            return <OrganisationTh {...properties}/>;
        }
        case 'customEntitiesTypeahead': {
            return <CustomEntitiesTh {...properties}/>;
        }
        case 'avatarEditor': {
            return <AvatarEditor {...properties}/>;
        }
        default:
            throw new Error(`Unknown type "${type}"`);
    }
};

/**
 * If by the default we have empty DOM element, we need fo fill it for showing in sidebar.
 * @param type specified this behaviour by type of component.
 **/
export const addExtraSpace = (type: string) =>
    (type === 'group' || type === 'displayText' || type === 'header') && (
        <div style={{ height: '48px' }}>{/* we need something to drag */}</div>
    );

/**
 * Sets the values of the properties using the defaults values where the properties are not defined.
 *
 * @param properties the properties' values.
 * @param defaults the defaults' values.
 * @return the values of the properties using the defaults values where the properties are not defined.
 */
export const fillProperties = (properties: ?Object, defaults: ?Object): Object => {
    const propertiesValues = { ...properties };
    defaults && Object.entries(defaults).forEach(([key, value]) => {
        if (propertiesValues[key] === undefined) {
            propertiesValues[key] = value;
        }
    });
    return propertiesValues;
};
