/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import Autocomplete from './Autocomplete';

/**
 * Select one or more options using lazy loading.
 */
class AbstractLazyAutocomplete extends PureComponent<Object, Object> {

    static propTypes = {
        ...Autocomplete.propTypes,
        loadOptions: PropTypes.func.isRequired,
        options: PropTypes.arrayOf(PropTypes.object),
        isLoading: PropTypes.bool,
        filterBy: PropTypes.arrayOf(PropTypes.object),
        orderBy: PropTypes.arrayOf(PropTypes.object),
    }

    constructor(props: Object) {
        super(props);
        (this: Object).itemTemplate = this.itemTemplate.bind(this);
        (this: Object).suggest = this.suggest.bind(this);
    }

    state = { value: null, filteredOptions: [] };

    componentDidUpdate(prevProps: Object) {
        if (!this.props.isLoading && prevProps.options !== this.props.options) {
            this.setState({ filteredOptions: this.normalizeOptions(this.props.options) });
        }
    }

    /**
     * Returns a set of modifiable options (the PrimeReact Autocomplete will throw an exception if the options are not modifiable).
     */
    normalizeOptions = memoize(options => (options || []).map(option => ({ ...option })));

    itemTemplate(item: Object) {
        throw new Error(`You need to implement the "itemTemplate" method when you extend the AbstractLazyAutocomplete (${this.constructor.name}).`);
    }

    suggest(item: Object) {
        throw new Error(`You need to implement the "suggest" method when you extend the AbstractLazyAutocomplete (${this.constructor.name}).`);
    }

    render() {
        // remove the properties that we do not have to pass to the prime Autocomplete
        const {
            isLoading,           // eslint-disable-line no-unused-vars
            options,             // eslint-disable-line no-unused-vars
            loadOptions,         // eslint-disable-line no-unused-vars
            filterBy,            // eslint-disable-line no-unused-vars
            ...autocompleteProps
        } = this.props;
        const { filteredOptions } = this.state;
        return (
            <Autocomplete
                placeholder="Search..."
                {...autocompleteProps}
                completeMethod={this.suggest}
                itemTemplate={this.itemTemplate}
                selectedItemTemplate={this.itemTemplate}
                field="_label_"
                suggestions={filteredOptions}
            />
        );
    }
};

export default AbstractLazyAutocomplete;
