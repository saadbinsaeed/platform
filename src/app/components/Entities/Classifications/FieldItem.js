/*  @flow */

import React, { PureComponent } from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';

import PersonAutocomplete from 'app/components/molecules/Autocomplete/PersonAutocomplete';
import OrganisationAutocomplete from 'app/components/molecules/Autocomplete/OrganisationAutocomplete';
import ThingAutocomplete from 'app/components/molecules/Autocomplete/ThingAutocomplete';
import Field from 'app/components/molecules/Field/Field';
import Checkbox from 'app/components/atoms/CheckBox/CheckBox';
import Dropdown from 'app/components/atoms/Dropdown/Dropdown';
import DirectoriesDropdown from 'app/containers/Common/DropDowns/DirectoriesDropdown/DirectoriesDropdown';
import DateTimePickerModal from 'app/components/molecules/DataTimePicker/DateTimePickerModal';
import { isDefined } from 'app/utils/lo/lo';
import EntityAutocompleteWrapper from './EntityAutocompleteWrapper';
import CustomEntitesAutocomplete from 'app/components/molecules/Autocomplete/CustomEntitesAutocomplete';
import { formatByKind } from 'app/utils/date/date';
import ClassificationAutocompleteWrapper
    from 'app/components/Entities/Classifications/ClassificationAutocompleteWrapper';
import ClassificationAutocomplete from 'app/components/molecules/Autocomplete/ClassificationAutocomplete';

const StyledMessage = styled.p`
    overflow-wrap: break-word;
`;

const AlertLabel = styled.span`
    color: ${({ theme }) => theme && theme.color.warning};
`;

/**
 * Component that generates field based on type
 */
class FieldItem extends PureComponent<Object, Object> {

    static isValidFilter(filter: any) {
        return (
            typeof filter === 'object'
            && typeof filter.field === 'string' && filter.field
            && typeof filter.op === 'string' && filter.op
            && typeof filter.value !== 'undefined'
        );
    };

    static getFilters = memoize((filtersString: string) => {
        if (!filtersString) {
            return null;
        }
        try {
            const filter = JSON.parse(filtersString);
            const filters = Array.isArray(filter) ? filter : [filter];
            if (!filters.every(FieldItem.isValidFilter)) {
                throw new Error('Invalid field');
            }
            return filters.map(({ field, op, value }) => ({ field, op, value }));
        } catch (e) {
            // fail silently
            return null;
        }
    });

    render() {
        const {
            type: old_type = '',
            f_uri: name,
            text_ext = '',
            text_ext_position = '',
            name: label = 'Unknown Field',
            enum_values: enumValues = [],
            dir_domain: domain = 'country',
            disabled,
            updateAttribute: onChange,
            attributes,
            default_value,
            format,
            filter_expression,
            kind = 'datetime',
            canBeAppendTo,
            readOnly = false,
            required = false,
        } = this.props;

        // check for undefined cos value can be 0 or false (false positive values)
        const value = (attributes && attributes[name] !== undefined ? attributes[name] : (default_value || null));
        const type = old_type.toLowerCase();
        const props = {
            key: name,
            name,
            value,
            onChange,
            label,
            text_ext,
            text_ext_position,
            disabled: disabled || readOnly,
            placeholder: label,
            readOnly,
            required,
        };
        switch (type) {
            case 'text':
                const textFix = value === null ? '' : value;
                return <Field {...props} value={textFix} type="text" title={`Text field for ${label}`}/>;
            case 'int':
            case 'integer':
                const numberFix = value === null ? '' : value;
                return <Field
                    {...props}
                    value={numberFix}
                    type="number"
                    max="2147483647"
                    min="-2147483648"
                    title={`Number field for ${label}`}
                />;
            case 'float':
                const floatFix = value === null ? '' : value;
                return <Field
                    {...props}
                    value={floatFix}
                    type="number"
                    step=".1"
                    title={`Number field with point for ${label}`}
                />;
            case 'bool':
                const checked = Boolean(value);
                return <Checkbox
                    {...props}
                    required={false}
                    checked={checked}
                    title={`Checkbox field for ${label} - ${!checked ? 'un' : ''}checked`}
                />;
            case 'timestamp':
            case 'datetime': {
                const { onChange, value, ...fieldProps } = props;
                return (
                    <div id={'date-picker-input'}>
                        <DateTimePickerModal
                            {...fieldProps}
                            value={formatByKind(kind, value)}
                            onChange={onChange}
                            format={format}
                            kind={kind}
                            appendElementId={'date-picker-input'}
                            canBeAppendTo={canBeAppendTo}
                        />
                    </div>
                );
            }
            case 'enum': {
                const options = !Array.isArray(enumValues) ? [] : enumValues.filter(isDefined)
                    .map(({ key, value }) => ({
                        value: key,
                        label: value,
                    }));
                return <Dropdown {...props} options={options}
                    placeholder="Select..."
                    title={`Select field for ${label}`}
                />;
            }
            case 'directory':
                return <DirectoriesDropdown
                    {...props}
                    directoryType={domain}
                    placeholder={`Find a ${domain}`}
                    title={`"${domain}" autocomplete field for ${label}`}
                />;
            case 'people':
                return (
                    <EntityAutocompleteWrapper
                        {...props}
                        filterBy={FieldItem.getFilters(filter_expression)}
                        Autocomplete={PersonAutocomplete}
                    />
                );
            case 'organisations':
                return (
                    <EntityAutocompleteWrapper
                        {...props}
                        filterBy={FieldItem.getFilters(filter_expression)}
                        Autocomplete={OrganisationAutocomplete}
                    />
                );
            case 'things':
                return (
                    <EntityAutocompleteWrapper
                        {...props}
                        filterBy={FieldItem.getFilters(filter_expression)}
                        Autocomplete={ThingAutocomplete}
                    />
                );
            case 'custom':
                const cls = this.props.class;
                const filterBy = [{ field: 'classes.applicableOn', op: '=', value: 'custom' }];
                if (cls) {
                    filterBy.push({ field: 'classes.uri', op: '=', value: cls.uri });
                }
                const filterExpression = FieldItem.getFilters(filter_expression);
                filterExpression && filterExpression.length && filterBy.push(...filterExpression);
                return (
                    <CustomEntitesAutocomplete {...props} filterBy={filterBy}/>
                );
            case 'classification':
                return (
                    <ClassificationAutocompleteWrapper
                        {...props}
                        filterBy={FieldItem.getFilters(filter_expression)}
                        Autocomplete={ClassificationAutocomplete}
                    />
                );
            default:
                return (
                    <StyledMessage key={name} style={{ fontSize: 'small' }}>
                        The field <AlertLabel>{name}</AlertLabel> of type <AlertLabel>{type}</AlertLabel> is not supported.
                    </StyledMessage>
                );
        }
    }
}

export default FieldItem;
