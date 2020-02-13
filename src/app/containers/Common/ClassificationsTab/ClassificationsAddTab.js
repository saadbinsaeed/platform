/* @flow */

import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import SelectClassesGrid from 'app/containers/Common/SelectionGrids/SelectClassesGrid';
import Button from 'app/components/atoms/Button/Button';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import history from 'store/History';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import PageTemplate from 'app/components/templates/PageTemplate';
import Text from 'app/components/atoms/Text/Text';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import { addEntityClasses } from 'store/actions/entities/entitiesActions';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';
import { ADD_CLASSIFICATIONS_DATA_TABLE } from 'app/config/dataTableIds';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';

/**
 * Renders the view to add classes to thing.
 */
class ClassificationsAddTab extends PureComponent<Object, Object> {

    static propTypes = {
        type: PropTypes.oneOf(['thing', 'person', 'organisation', 'custom']).isRequired,
        addEntityClasses: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string.isRequired }),
    };

    static defaultProps = {
        isLoading: false,
    };

    state: Object = {
        selectedRows: [],
        selectedRowsCount: 0,
        selectedUri: '',
        lastKey: Date.now(),
    };

    /**
     * redirect back to classification tab
     */
    redirectBack = () => {
        const entityId = this.props.match.params.id;
        if (!entityId) {
            return null;
        }
        const { type } = this.props;
        const url = {            // in any case user will be redirected back to classification tab if cancel button is clicked https://gitlab.mi-c3.com/affectli-project/affectli-support-issues/issues/6577
            thing: `/things/${entityId}/classifications`,
            person: `/people/${entityId}/classifications`,
            organisation: `/organisations/${entityId}/classifications`,
            custom: `/custom-entities/${entityId}/classifications`,

        }[type];
        url && history.push(url);
    };

    /**
     * Add selected class to the thing
     */
    addClasses = (event) => {
        event.preventDefault();
        const { selectedUri } = this.state;
        if (!selectedUri) {
            return;
        }
        const id = this.props.match.params.id;
        const uris = Array.isArray(selectedUri) ? selectedUri : [selectedUri];
        this.props.addEntityClasses(id, uris).then(() => {
            this.setState(
                { lastKey: Date.now() },
                () => this.redirectBack(),
            );
        });
    };

    /**
     * @param selectedRows
     */
    onSelectionChange = (selectedRows: Object) => {
        const selectedUri = (Array.isArray(selectedRows) ? selectedRows : [selectedRows]).map(({ uri }) => uri);
        this.setState({ selectedUri, selectedRowsCount: selectedUri.length });
    };

    @bind
    @memoize()
    buildCustomWhere(id, type, isAdmin) {
        const customWhere = [
            { field: 'applicableOn', op: '=', value: type },
            { field: 'abstract', op: '<>', value: true }, // TODO: fix to = when database ensures there are no null
        ];
        if (!isAdmin) {
            customWhere.push({ field: 'active', op: '=', value: true });
        }
        return customWhere;
    }

    @bind
    @memoize()
    buildExcludeBy(id) {
        return [ { field: 'entities.id', op: '=', value: id } ];
    }


    /**
     * @override
     */
    render(): Object {
        const { isLoading, type, userProfile: { isAdmin } } = this.props;
        const { selectedUri, selectedRowsCount, lastKey } = this.state;
        const customWhere = this.buildCustomWhere(this.props.match.params.id, type, isAdmin);
        const excludeBy = this.buildExcludeBy(this.props.match.params.id);
        const customColumnDefinitions = [];
        if (isAdmin) {
            customColumnDefinitions.push({
                header: 'Active',
                field: 'active',
                sortable: false,
                bodyComponent: BooleanRenderer,
                renderValue: ({ value }) => value ? 'Active' : 'Inactive',
                type: 'boolean',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false },
                ],
                style: { width: '100px', textAlign: 'center' },
            });
        }
        return (
            <PageTemplate title="Add Classification">
                <ContentArea>
                    <SelectClassesGrid
                        key={lastKey}
                        dataTableId={`${ADD_CLASSIFICATIONS_DATA_TABLE}/${type}`}
                        onSelectionChange={this.onSelectionChange}
                        match={this.props.match.params.id}
                        selectedRows={this.state.selectedRows}
                        customWhere={customWhere}
                        excludeBy={excludeBy}
                        customColumnDefinitions={customColumnDefinitions}
                    />
                </ContentArea>
                <FooterBar>
                    <div>
                        <Button
                            disabled={!selectedUri || !selectedUri.length || isLoading}
                            loading={false}
                            type="submit"
                            color="primary"
                            onClick={this.addClasses}
                        >
                            Add Class
                        </Button>
                        <Text> {selectedUri && selectedUri.length ? `${selectedRowsCount} class selected.` : ''} </Text>
                    </div>
                    <Button type="button" onClick={this.redirectBack}>Cancel</Button>
                </FooterBar>
            </PageTemplate>
        );
    }
}

export default connect(
    (state) => {
        const isLoading1 = state.entities.commonClassifications.classifications.add;
        const isLoading2 = state.classifications.list.isLoading;
        return {
            isLoading: isLoading1 || isLoading2,
            userProfile: state.user.profile,
        };
    },
    {
        addEntityClasses,
    },
)(withRouter(ClassificationsAddTab));
