/* @flow */

import React, { PureComponent } from 'react';
import memoize from 'memoize-one';

import Autocomplete from 'app/components/molecules/Autocomplete/Autocomplete';
import ClassificationAutocomplete from 'app/components/molecules/Autocomplete/ClassificationAutocomplete';
import classificationAutocompleteQuery from 'graphql/entities/classifications/classificationAutocompleteQuery';
import AutocompleteWrapper from './AutocompleteWrapper';

/**
 * @deprecated use ClassificationAutocomplete instead.
 */
class ClassificationsDropdownDeprecated extends PureComponent<Object, Object> {

    static propTypes = {
        ...Autocomplete.propTypes,
    }

    normalizeValue = memoize((value, valueProperty) => {
        if (valueProperty === 'id') {
            if (Array.isArray(value)) {
                return value.map(id => Number(id)).filter(id => Number.isInteger(id) && id > 0);
            }
            const id = value && Number(value);
            return id && Number.isInteger(value) && id > 0 ? id : null;
        }
        return value;
    });

    render() {
        return (
            <AutocompleteWrapper
                valueProperty="id"
                {...this.props}
                value={this.normalizeValue(this.props.value, this.props.valueProperty || 'id')}
                Autocomplete={ClassificationAutocomplete}
                graphqlQuery={classificationAutocompleteQuery}
            />
        );
    }
};

export default ClassificationsDropdownDeprecated;
