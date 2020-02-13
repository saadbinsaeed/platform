/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bind } from 'app/utils/decorators/decoratorUtils';
import { TypeaheadChipInitials } from './TypeaheadChip';
import { loadDirectoriesAutocomplete } from 'store/actions/common/DirectoriesActions';

import AbstractEntityTypeahead from './AbstractEntityTypeahead';

/**
 * Select one or more groups using lazy loading.
 */
class CustomEntitiesTypeahead extends PureComponent<Object, Object> {

    static propTypes = {
        loadDirectoriesAutocomplete: PropTypes.func.isRequired,
        options: PropTypes.arrayOf(PropTypes.object),
        isLoading: PropTypes.bool,
        filterBy: PropTypes.arrayOf(PropTypes.object),
    }

    @bind
    optionTemplate ({ name }: Object) {
        return ({
            ChipProps: {
                avatar: <TypeaheadChipInitials initials={name} />,
            },
            label: `${name || 'Name not available'}`,
        });};

    render() {
        // remove the properties that we do not have to pass to the AbstractEntityAutocomplete
        const { loadDirectoriesAutocomplete, placeholder, directoryType, ...abstractEntityAutocompleteProps } = this.props;
        return (
            <AbstractEntityTypeahead
                placeholder={placeholder}
                {...abstractEntityAutocompleteProps}
                directoryType={directoryType}
                loadOptions={loadDirectoriesAutocomplete}
                optionTemplate={this.optionTemplate}
            />
        );
    }
};

export default connect(
    state => ({
        isLoading: state.common.autocomplete.directories.isLoading,
        options: state.common.autocomplete.directories.data,
    }),
    { loadDirectoriesAutocomplete }
)(CustomEntitiesTypeahead);
