/* @flow */

import Immutable from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';

import getHelper from './fieldHelpers';

/*
 * 'properties' will contains the properties value to pass to the componet
 * 'settings' will contains the settings value to use only in the field settings sidebar
 */
const inputSettings = Immutable([
    { type: 'text', properties: { label: 'Name', name: 'properties.name', help: getHelper('name') }, constraints: { required: true } },
    { type: 'text', properties: { label: 'Label', name: 'properties.label', help: getHelper('label') } },
    { type: 'boolean', properties: { label: 'Local', name: 'properties.local', help: getHelper('local') } },
    { type: 'textarea', properties: { parseAs: 'HTML', label: 'Helper', name: 'properties.help', help: getHelper('help') } },
    { type: 'textarea', properties: { parseAs: 'javascript', label: 'onChange', name: 'properties.onChange', help: getHelper('onChange') } },
]);

const outcomeSettings = Immutable([
    { type: 'text', properties: { label: 'Name', name: 'properties.name', help: getHelper('name') }, constraints: { required: true }, },
    { type: 'text', properties: { label: 'Action', name: 'properties.action' }, constraints: { required: true }, },
    { type: 'text', properties: { label: 'Outcome', name: 'properties.outcome' }, constraints: { required: true } },
    { type: 'text', properties: { label: 'Label', name: 'properties.label', help: getHelper('label') }, constraints: { required: true } },
    { type: 'textarea', properties: { parseAs: 'HTML', label: 'Helper', name: 'properties.help', help: getHelper('help') }},
]);

const panelSettings = Immutable([
    { type: 'text', properties: { label: 'Header', name: 'properties.header', children: [] } },
    { type: 'boolean', properties: { label: 'Expanded', name: 'properties.expanded', help: getHelper('expanded') } },
    { type: 'textarea', properties: { parseAs: 'HTML', label: 'Helper', name: 'properties.help', help: getHelper('help') }},
]);

const groupSettings = Immutable([
    { type: 'text', properties: { label: 'Name', name: 'properties.name', help: getHelper('name'), children: [] } },
]);

const displayTextSettings = Immutable([
    { type: 'textarea', properties: { label: 'Text', name: 'properties.text' } },
    { type: 'boolean', properties: { label: 'Local', name: 'properties.local', help: getHelper('local') } },
    { type: 'textarea', properties: { parseAs: 'HTML', label: 'Helper', name: 'properties.help', help: getHelper('help') }},
]);

const headerSettings = Immutable([
    { type: 'text', properties: { label: 'Text', name: 'properties.text' } },
    {
        type: 'typeahead',
        properties: {
            label: 'Variant',
            name: 'properties.variant',
            valueField:'value',
            options: [
                { value: 'h1' , label: 'H1' },
                { value: 'h2' , label: 'H2' },
                { value: 'h3' , label: 'H3' },
                { value: 'h4' , label: 'H4' },
                { value: 'h5' , label: 'H5' },
                { value: 'h6' , label: 'H6' },
            ]
        }
    },
    { type: 'boolean', properties: { label: 'Local', name: 'properties.local', help: getHelper('local') } },
    { type: 'textarea', properties: { parseAs: 'HTML', label: 'Helper', name: 'properties.help', help: getHelper('help') }},
]);

const textareaSettings = Immutable([
    { type: 'text', properties: { label: 'Name', name: 'properties.name', help: getHelper('name') }, constraints: { required: true } },
    { type: 'text', properties: { label: 'Label', name: 'properties.label', help: getHelper('label') } },
    { type: 'boolean', properties: { label: 'Local', name: 'properties.local', help: getHelper('local') } },
    {
        type: 'typeahead',
        properties: {
            label: 'Type of parsing',
            name: 'properties.parseAs',
            valueField: 'value',
            value: 'text',
            options: [
                { value: 'text' , label: 'Text' },
                { value: 'JSON' , label: 'JSON' },
                { value: 'HTML' , label: 'HTML' },
                { value: 'javascript' , label: 'Javascript' },
            ]
        }
    },
    { type: 'textarea', properties: { parseAs: 'HTML', label: 'Helper', name: 'properties.help', help: getHelper('help') }},
]);

const typeaheadSettings = Immutable([
    { type: 'text', properties: { label: 'Name', name: 'properties.name', help: getHelper('name') }, constraints: { required: true } },
    { type: 'text', properties: { label: 'Label', name: 'properties.label', help: getHelper('label') } },
    { type: 'boolean', properties: { label: 'Fetch options', name: 'properties.isFetching' } },
    {
        type: 'textarea',
        properties: {
            label: 'Static options',
            name: 'settings.staticOptions',
            rows: 5,
            onChange: function (event) {
                // WARNING: this function will run in a service worker
                const value = event.target.value;
                const options = value && value.split(/\r\n|\r|\n/g).map((line, index) => {
                    const splitedLine = line.split(',');
                    return {
                        value: splitedLine[0],
                        label: splitedLine[1],
                    };
                });
                return [
                    { name: 'settings.staticOptions', value },
                    { name: 'properties.options', value: options }
                ];
            },
            isVisible: ({ properties }) => !properties || !properties.isFetching,
            help: getHelper('staticOptions')
        },
    },
    {
        type: 'textarea',
        properties: {
            label: 'Fetch function',
            name: 'properties.fetchData',
            parseAs: 'javascript',
            isVisible: ({ properties }) => properties && properties.isFetching,
            helperText: 'The function has to return a Promise.',
        },
    },
    { type: 'text', properties: { label: 'Value field', name: 'properties.valueField', isVisible: ({ properties }) => get(properties, 'isFetching'), help: getHelper('fieldValue') } },
    { type: 'boolean', properties: { label: 'Local', name: 'properties.local', help: getHelper('local') } },
    { type: 'textarea', properties: { parseAs: 'HTML', label: 'Helper', name: 'properties.help', help: getHelper('help') }},
]);

export const getFieldSettings = (type: string) => {
    if (!type) return null;
    switch (type) {
        case 'outcome': return outcomeSettings;
        case 'panel': return panelSettings;
        case 'group': return groupSettings;
        case 'displayText': return displayTextSettings;
        case 'header': return headerSettings;
        case 'typeahead': return typeaheadSettings;
        case 'textarea': return textareaSettings;
        default: return inputSettings;
    }
};
