/* @flow */

import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { loadSituationalAwareness } from 'store/actions/maps/situationalAwarenessActions';
import { loadSituationalAwarenessDetail } from 'store/actions/maps/situationalAwarenessDetailActions';
import PageTemplate from 'app/components/templates/PageTemplate';
import GeoMap from 'app/components/molecules/Map/GeoMap/GeoMap';
import ActionBar from 'app/components/molecules/ActionBar/ActionBar';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import Drawer from 'app/components/atoms/Drawer/Drawer';
import SituationalAwarenessFilters from './SituationalAwarenessFilters';
import InputText from 'app/components/atoms/Input/InputText';
import Flex from 'app/components/atoms/Flex/Flex';
import Button from 'app/components/atoms/Button/Button';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';

const SearchInput = styled(InputText)`
  display: inline-block;
  width: 100%;
`;

/**
 * Renders the view to display the classification.
 */
class SituationalAwareness extends Component<Object, Object> {
    /**
     * Set our default state
     * @param props
     */
    constructor(props: Object) {
        super(props);
        this.state = {
            queryParams: {},
            isFiltersOpen: false,
        };
    }
    queryParams: Object = { page: 0, filter: '', order: 'asc', groupBy: 'date', view: '' };
    setState: Function;
    /**
     * Toggle the filters panel
     */
    toggleFilters = () => {
        this.setState({ isFiltersOpen: !this.state.isFiltersOpen });
    };
    setFilter = (e: Object) => {
        this.setState({ queryParams: { ...this.state.queryParams, filter: e.value}});
    };
    setView = (e: Object) => {
        this.setState({ queryParams: { ...this.state.queryParams, view: e.view, group: e.group}});
    };
    clearAllQueryParams = () => {
        this.setState({
            queryParams: {}
        });
    };
    /**
     * @override
     */
    render(): Object {
        // console.log('state', this.state);
        // We'll try and organise data object here until we sort everything with graphql
        const data = [];
        this.props.records && this.props.records.map((item) => {
            /**
             * Make data objects in array slightly more sane.
             */
            const latitude = item.geometry.coordinates[0];
            const longitude = item.geometry.coordinates[1];
            const title = item.geometry_name;
            const properties = item.properties;
            return data.push({
                title,
                latitude: latitude || 0,
                longitude: longitude || 0,
                priority: properties.mttr_bucket_ || 0,
                properties
            });
        });

        // console.log('State', this.state);

        return (
            <PageTemplate title="Maps">
                {/* This is out common action for searching, filtering and ordering */}
                <ActionBar
                    left={<SearchInput name={'filter'} placeholder={'Filter'} onChange={this.setFilter} value={this.state.queryParams.filter || ''} />}
                    right={<ButtonIcon icon={'filter-variant'} onClick={this.toggleFilters} />}
                />
                {/* This is where we keep our filters. We show/hide the drawer */}
                <Drawer
                    title="Filter Data"
                    isOpen={this.state.isFiltersOpen}
                    isToggled={this.toggleFilters}
                    footer={<Flex spaceBetween grow><Button onClick={this.clearAllQueryParams}>Clear all</Button> <Button color="primary">Apply Filter</Button></Flex>}
                >
                    <SituationalAwarenessFilters onChange={e => this.setView(e)} />
                </Drawer>
                {/* Render the map */}
                <ContentArea>
                    <GeoMap
                        locations={data || []}
                        detail={this.props.detail || []}
                        filters={this.state.filters}
                        width="100%"
                        height="100%"
                        showMyLocation
                        currentUser={this.props.currentUser || {}}
                        loadData={params => this.props.loadSituationalAwareness(params)}
                        loadDetail={id => this.props.loadSituationalAwarenessDetail(id)}
                    />
                </ContentArea>
            </PageTemplate>
        );
    }
}

const mapStateToProps: Function = ( state ) => {
    return {
        isLoading: state.maps.situationalAwareness.isLoading,
        error: state.maps.situationalAwareness.error,
        records: state.maps.situationalAwareness.payload,
        detail: state.maps.situationalAwarenessDetail.payload,
        currentUser: state.user.profile,
    };
};

export default connect(mapStateToProps, { loadSituationalAwareness, loadSituationalAwarenessDetail })(SituationalAwareness);
