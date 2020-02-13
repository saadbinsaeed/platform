/* @flow */

import React from 'react';
import moment from 'moment';

import Card from 'app/components/molecules/Card/Card';
import Checkbox from 'app/components/atoms/CheckBox/CheckBox';
import PeopleDropdown from 'app/containers/Common/DropDowns/PeopleDropdownDeprecated';
import OrganisationsDropdown from 'app/containers/Common/DropDowns/OrganisationsDropdownDeprecated';
import DirectoriesDropdown from 'app/containers/Common/DropDowns/DirectoriesDropdown/DirectoriesDropdown';
import ThingsDropdown from 'app/containers/Common/DropDowns/ThingsDropdownDeprecated';
import Field from 'app/components/molecules/Field/Field';
import Button from 'app/components/atoms/Button/Button';
import Dropdown from 'app/components/atoms/Dropdown/Dropdown';
import { createEvent } from 'app/utils/http/event';
import { get, groupBy, isDefined, map } from 'app/utils/lo/lo';


/**
 * Builds a form
 */
export class ClassificationFormBuilder {

    /**
     * Generate a form
     *
     * @param fields
     * @param formData
     * @param classificationName
     * @param onChange
     * @return {*}
     */
    static generateForm(
        fields: ? Object[],
        formData: Object,
        classificationUri: ?string,
        classificationPermissions: Array<string>,
        onChange: Function,
        canEdit: boolean = true) { // By default user is able to edit attributes
        const disabled = !(classificationPermissions.includes('edit') || classificationPermissions.includes('write'));
        if ( !fields || !fields.length ) {
            return (
                <Card
                    collapsible
                    title={classificationUri || 'Classification Data'}
                    description={<span> No classification data is available for {classificationUri || 'this entity'}. </span>}
                />
            );
        }

        return ClassificationFormBuilder.generateGroups(fields, formData, disabled, onChange, canEdit);
    }

    /**
     * Generate groups, wrapped in a cards, for a set of fields, based on the group_name.
     *
     * @param fields
     * @param formData
     * @param onChange
     */
    static generateGroups(fields: Object[], formData: Object, disabled: boolean, onChange: Function, canEdit: boolean) {


        // API sometimes returns null, sometimes undefined, sometimes empty string.
        // We need to sort this out before grouping:
        const consolidatedFields = fields.map(({ group_name, ...others }) => ({ ...others, group_name: group_name || 'Ungrouped' }));

        //1. Group the types by group_name:
        const groupedFields = groupBy(consolidatedFields, 'group_name');

        //2. For every group, we will generate the fields,
        return map(groupedFields, (group, groupName) => (
            <Card
                key={groupName}
                collapsible
                collapsed
                title={groupName}
                description={
                    <div> {ClassificationFormBuilder.generateFieldComponents(group, formData, disabled, onChange)} </div>
                }
                footer={(canEdit && <Button color="primary"> Save </Button>) || <div />}
            />
        ));
    }

    /**
     * Generates an array of fields based on the inputted JSON.
     *
     * @param fields
     * @param formData
     * @param onChange
     * @return {Array|Iterable<K, M>}
     */
    static generateFieldComponents(fields: Object[], formData: Object, disabled: boolean, onChange: Function): Array<Object> {
        return fields.map((field) => {
            const value = formData[field.f_uri] === undefined ? get(field, 'default_value') : formData[field.f_uri];
            return ClassificationFormBuilder.getControlFromType(field, value, disabled, onChange);
        });

    }

    /**
     * Gets a control from a specific type.
     *
     * Datatype of the value of the field. One of:
     * - text
     * - int
     * - float
     * - bool
     * - timestamp
     * - enum (static) values (key, value)
     * - things (Filtered by specified classification or by specified tag)
     * - people (Filtered by specified classification or by specified tag)
     * - organisations (Filtered by specified classification or by specified tag)
     * - directory (Filtered by domain)
     */
    static getControlFromType(field: Object, value: any, disabled: boolean, onChange: Function) {

        const type = (get(field, 'type') || '').toLowerCase();
        const name = String(get(field, 'f_uri') || '');
        const text_ext = get(field, 'text_ext');
        const text_ext_position = get(field, 'text_ext_position');
        const label = get(field, 'name') || name || 'Unknown Field';
        const enumValues = get(field, 'enum_values');
        const domain = get(field, 'dir_domain');

        const props = { value, onChange, label, text_ext, text_ext_position, disabled };

        switch (type) {
            case 'text':
                return <Field key={name} label={label} name={name} type="text" {...props} />;
            case 'int':
            case 'integer':
                return <Field key={name} label={label} name={name} type="number" max="2147483647" min="-2147483648" {...props} />;
            case 'float':
                return <Field key={name} label={label} name={name} type="number" step=".1" {...props} />;
            case 'bool':
                return <Checkbox key={name} label={label} name={name} checked={Boolean(value)} onChange={onChange} disabled={disabled} />;
            case 'timestamp':
            case 'datetime': {
                const { value, onChange, ...fieldProps } = props;
                const formatted = value && moment(value).format('YYYY-MM-DDTHH:mm');
                const handleChange = (event: Object) => {
                    const { name, value, type } = event.target;
                    const datetime = value && moment(value).format();
                    onChange(createEvent('change', { name, type, value: datetime }));
                };
                return <Field key={name} label={label} name={name} type="datetime-local" {...fieldProps} value={formatted} onChange={handleChange} />;
            }
            case 'enum': {
                const options = !Array.isArray(enumValues) ? [] : enumValues.filter(isDefined).map(({ key, value }) => ({ value: key, label: value }));
                return (
                    <Dropdown
                        key={name}
                        name={name}
                        label={label}
                        value={value}
                        onChange={onChange}
                        options={options}
                        disabled={disabled}
                    />
                );
            }
            case 'directory':
                return (
                    <div key={name}>
                        <DirectoriesDropdown
                            name={name}
                            directoryType={domain || 'country'}
                            {...props}
                        />
                    </div>
                );
            case 'people':
                return (
                    <div key={name}>
                        <PeopleDropdown
                            label={label}
                            name={name}
                            onChange={onChange}
                            value={value}
                            disabled={disabled}
                        />
                    </div>
                );
            case 'organisations':
                return (
                    <div key={name}>
                        <OrganisationsDropdown
                            label={label}
                            name={name}
                            onChange={onChange}
                            value={value}
                            disabled={disabled}
                        />
                    </div>
                );
            case 'things':
                return (
                    <div key={name}>
                        <ThingsDropdown
                            label={label}
                            name={name}
                            onChange={onChange}
                            value={value}
                            disabled={disabled}
                        />
                    </div>
                );
            default:
                return (
                    <div key={name} style={{ fontSize: 'small' }}>
                        {`The field "${name}" of type "${type}" is not supported.`}
                    </div>
                );
        }
    }
}
