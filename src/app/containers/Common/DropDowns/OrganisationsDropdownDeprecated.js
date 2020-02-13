/* @flow */

import React, { PureComponent } from 'react';

import Autocomplete from 'app/components/molecules/Autocomplete/Autocomplete';
import OrganisationAutocomplete from 'app/components/molecules/Autocomplete/OrganisationAutocomplete';
import organisationAutocompleteQuery from 'graphql/entities/organisations/organisationAutocompleteQuery';
import AutocompleteWrapper from './AutocompleteWrapper';

/**
 * @deprecated use OrganisationAutocomplete instead.
 */
class OrganisationsDropdownDeprecated extends PureComponent<Object, Object> {

    static propTypes = {
        ...Autocomplete.propTypes,
    }

    render() {
        return (
            <AutocompleteWrapper
                valueProperty="id"
                {...this.props}
                Autocomplete={OrganisationAutocomplete}
                graphqlQuery={organisationAutocompleteQuery}
            />
        );
    }
};

export default OrganisationsDropdownDeprecated;
