/* @flow */

import React, { PureComponent } from 'react';

import Autocomplete from 'app/components/molecules/Autocomplete/Autocomplete';
import PersonAutocomplete from 'app/components/molecules/Autocomplete/PersonAutocomplete';
import personAutocompleteQuery from 'graphql/entities/people/personAutocompleteQuery';
import AutocompleteWrapper from './AutocompleteWrapper';

/**
 * @deprecated use PersonAutocomplete instead.
 */
class PeopleDropdownDeprecated extends PureComponent<Object, Object> {

    static propTypes = {
        ...Autocomplete.propTypes,
    }

    render() {
        return (
            <AutocompleteWrapper
                valueProperty="id"
                {...this.props}
                Autocomplete={PersonAutocomplete}
                graphqlQuery={personAutocompleteQuery}
            />
        );
    }
};

export default PeopleDropdownDeprecated;
