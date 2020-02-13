// @flow

import Select from './Select';

class FreeTextSelect extends Select {

    suggest = ({ query }: Object) => {
        const { options, value } = this.props;
        const filteredOptions = this.filterOptions(options, value, query);
        if (query) {
            filteredOptions.push({ value: query, label: query, custom: true });
        }
        this.setState({ filteredOptions });
    };

    itemTemplate = (option: Object) => {
        const { label, custom } = option;
        const text = this.props.itemTemplate ? this.props.itemTemplate(label) : label;
        return custom ? `Create option "${label}"` : text;
    };
}

export default FreeTextSelect;
