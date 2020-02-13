/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Autocomplete } from '@mic3/platform-ui';

import { loadTypeaheadProcessDefinitions } from 'store/actions/abox/myAppsActions';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';
import { get } from 'app/utils/lo/lo';

/**
 * Select one or more groups using lazy loading.
 */
class ProcessTypeTypeahead extends PureComponent<Object, Object> {

    static propTypes = {
        loadTypeaheadProcessDefinitions: PropTypes.func.isRequired,
        processDefinitions: PropTypes.arrayOf(PropTypes.object),
        isLoading: PropTypes.bool,
        filterBy: PropTypes.arrayOf(PropTypes.object),
    }

    constructor(props) {
        super(props);
        props.loadTypeaheadProcessDefinitions();
    }

    @bind
    @memoize()
    normalizeOptions(processDefinitions) {
        return (processDefinitions || []).map(
            ({ name }) => ({
                label: name
            })
        );
    }

    render() {
        // remove the properties that we do not have to pass to the AbstractEntityAutocomplete
        const { loadTypeaheadProcessDefinitions, processDefinitions, isLoading, ...abstractProcessTypeTypeaheadProps } = this.props;

        return (
            <Autocomplete
                placeholder="Search for a process type..."
                {...abstractProcessTypeTypeaheadProps}
                options={this.normalizeOptions(processDefinitions)}
                valueField="label"
            />
        );
    }
};

export default connect(
    state => ({
        isLoading: state.abox.app.typeaheadProcessDefinitions.isLoading,
        processDefinitions: get(state.abox.app.typeaheadProcessDefinitions.data, 'records', []),
    }),
    { loadTypeaheadProcessDefinitions }
)(ProcessTypeTypeahead);
