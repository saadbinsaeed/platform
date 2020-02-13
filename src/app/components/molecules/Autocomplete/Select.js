/* @flow */

import React, { PureComponent } from 'react';
import memoize from 'memoize-one';

import { includes } from 'app/utils/filter/filterUtils';
import Autocomplete from './Autocomplete';
import { debounce } from 'app/utils/utils';

/**
 * Select
 */
class Select extends PureComponent<Object, Object> {

    static propTypes = { ...Autocomplete.propTypes }
    static defaultProps = { valueField: 'value' }

    state: Object;

    constructor(props: Object) {
        super(props);
        const { options, value } = props;
        this.state = { filteredOptions: this.filterOptions(options, value) };
    }

    filterOptions = memoize((options, value, query) => {
        let filteredOptions = query ? includes(options, query, { property: 'label' }) : options;
        if(Number.isFinite(Number(value))) {
            filteredOptions = filteredOptions.filter(op => op.value !== value);
        } else {
            const values = new Set(value);
            filteredOptions = filteredOptions.filter(({ value }) => !values.has(value));
        }
        return filteredOptions;
    });

    suggest = debounce(({ query }: Object) => {
        const { options, value } = this.props;
        this.setState({ filteredOptions: this.filterOptions(options, value, query) });
    }, 300);

    onChange = (event: Object) => {
        const { onChange, name, multiple, valueField } = this.props;
        const value = multiple ?
            event.value.map(val => val[valueField])
            : event.value[valueField];

        onChange && onChange({ ...event, target: { name, value }});
    };

    normalizeValue = memoize((value: ?Array<string>, options) => {
        if(this.props.multiple) {
            const values = new Set(value);
            return options.filter(({ value }) => values.has(value));
        } else {
            return options.find(op => op.value === value);
        }
    });

    // for ovverriding
    itemTemplate = (option: Object) => this.props.itemTemplate ? this.props.itemTemplate(option) : option.label;

    render() {
        const { value, options, multiple, ...autocompleteProps } = this.props;
        const { filteredOptions } = this.state;
        return (
            <Autocomplete
                field="label"
                placeholder="Search..."
                {...autocompleteProps}
                value={this.normalizeValue(value, options)}
                onChange={this.onChange}
                completeMethod={this.suggest}
                suggestions={filteredOptions}
                multiple={multiple}
                itemTemplate={this.itemTemplate}
            />
        );
    }
};

export default Select;
