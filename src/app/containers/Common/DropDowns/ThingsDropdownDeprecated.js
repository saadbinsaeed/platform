/* @flow */

import React, { PureComponent } from 'react';

import Autocomplete from 'app/components/molecules/Autocomplete/Autocomplete';
import ThingAutocomplete from 'app/components/molecules/Autocomplete/ThingAutocomplete';
import thingAutocompleteQuery from 'graphql/entities/things/thingAutocompleteQuery';
import AutocompleteWrapper from './AutocompleteWrapper';

/**
 * @deprecated use ThingAutocomplete instead.
 */
class ThingsDropdownDeprecated extends PureComponent<Object, Object> {

    static propTypes = {
        ...Autocomplete.propTypes,
    }

    render() {
        return (
            <AutocompleteWrapper
                valueProperty="id"
                {...this.props}
                Autocomplete={ThingAutocomplete}
                graphqlQuery={thingAutocompleteQuery}
            />
        );
    }
};

export default ThingsDropdownDeprecated;
