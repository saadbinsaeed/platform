/* @flow */
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Grid, ListItem, Typography } from '@mic3/platform-ui';

import { getStr, isDefined, isEmptyArray } from 'app/utils/utils';
import { get, set } from 'app/utils/lo/lo';
import { includes } from 'app/utils/filter/filterUtils';
import { saveComponentState } from 'store/actions/component/componentActions';
import FormGenerator from 'app/containers/Designer/Form/components/FormGenerator';
import FiltersDrawer from './FiltersDrawer';
import FiltersToolbar from './FiltersToolbar';
import FiltersChips from './FiltersChips';
// import FiltersOrderToolbar from './FiltersOrderToolbar';
import { bind, debounce, memoize } from 'app/utils/decorators/decoratorUtils';

export const Content = styled.div`
    flex-grow: 1;
    max-height: calc(100vh - 200px);
`;

const Title = styled(ListItem)`
    padding-bottom: 0 !important;
    margin-bottom: -5px;
`;

const GridWrapper = styled(Grid)`
    flex-wrap: nowrap !important;
    height: 100% !important;
`;

const classesToolbar = { searchBar: 'filter-toolbar' };
const classesChips = { appBar: 'filter-chips' };

class Filters extends PureComponent<Object, Object> {

    static propTypes = {
        id: PropTypes.string.isRequired,
        filterViewState: PropTypes.object,
        filterDefinitions: PropTypes.arrayOf(PropTypes.shape({
            properties: PropTypes.shape({
                label: PropTypes.string,
                name: PropTypes.string.isRequired,
            }).isRequired,
            field: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
            type: PropTypes.string.isRequired,
            defaultCondition: PropTypes.string,
            searchBar: PropTypes.bool,
            filter: PropTypes.bool,
            sort: PropTypes.bool,
        })),
        children: PropTypes.func,
        searchBar: PropTypes.array,
        defaultFilters: PropTypes.object,
        defaultOrder: PropTypes.array,
        onlySearchBar: PropTypes.bool,
        leftToolbar: PropTypes.node,
        rightToolbar: PropTypes.node,
    };

    constructor(props) {
        super(props);
        const { filters, orderBy } = this.getFilterViewState(props.filterViewState, props.defaultFilters, props.defaultOrder);
        this.state = {
            isFiltersOpen: false,
            editedFilterBy: filters,
            editedOrderBy: orderBy[0],
        };
    }

    @bind
    @memoize()
    getFilterViewState(filterViewState, defaultFilters, defaultOrder) {
        const { filters, orderBy } = filterViewState || {};
        return {
            filters: filters || defaultFilters || {},
            orderBy: orderBy || defaultOrder || [],
        };
    };

    @bind
    toggleDrawer() {
        this.setState(state => ({ isFiltersOpen: !state.isFiltersOpen }));
    }

    @bind
    @debounce()
    setEditedFilterBy(data: Object) {
        this.setState({ editedFilterBy: data });
    };

    @bind
    setEditedFilterByWithUpdate(data: Object) {
        this.setState({ editedFilterBy: data }, this.applyFilter);
    };

    @bind
    applyFilter() {
        const { editedFilterBy, editedOrderBy } = this.state;
        const isValidOrderBy = typeof editedOrderBy === 'object' && editedOrderBy.field !== undefined && (editedOrderBy.direction !== undefined || editedOrderBy.asc !== undefined);
        this.props.saveComponentState(this.props.id, {
            filters: editedFilterBy,
            orderBy: isValidOrderBy ? [editedOrderBy] : [],
        });
    };

    @bind
    @debounce()
    updateSearchBarFilter(value: string) {
        const { filterViewState, defaultFilters, defaultOrder } = this.props;
        const state = this.getFilterViewState(filterViewState, defaultFilters, defaultOrder);
        this.props.saveComponentState(this.props.id, set(state, 'filters.searchBar', value));
    }

    @bind
    buildFilter(field, condition, value, type) {
        // if we are using the autocomplete of an entity we need to filter by id
        if (new Set(['thingTypeahead', 'organisationTypeahead', 'personTypeahead', 'userTypeahead', 'groupTypeahead']).has(type) && typeof value === 'object') {
            value = value && value.id;
        }

        if (!isDefined(value) || (Array.isArray(value) && isEmptyArray(value))) {
            return null;
        }

        if (type === 'number' && Number.isNaN(Number(value))) {
            return null;
        }

        if (value === 'is null' || value === 'is not null') {
            return { field, op: value };
        }

        return { field, op: condition, value };
    }

    @bind
    getConditionByType(type) {
        switch (type) {
            case 'number':
                return '=';
            case 'dateTimeRange':
                return 'between';
            default:
                return 'contains';
        }
    }

    @bind
    @memoize()
    formatFilterBy(filters: Object) {
        const { filterDefinitions, searchBar } = this.props;
        const filterBy = [];
        filterDefinitions
            .filter(def => def.filter !== false)
            .forEach((definition) => {
                const { field, properties, type, condition } = definition;
                const fields = Array.isArray(field) ? field : [field];
                const statements = fields
                    .filter(fieldName => get(filters, getStr(properties, 'name') || fieldName))
                    .map((fieldName) => {
                        const value = get(filters, getStr(properties, 'name') || fieldName) || {};
                        return this.buildFilter(fieldName, condition || this.getConditionByType(type), value, type);
                    }).filter(filter => filter);
                filterBy.push(...statements);
            });

        if (!filters.searchBar) {
            return filterBy;
        }
        const statements = searchBar.map((fieldName) => {
            const definition = includes(filterDefinitions, fieldName, { property: 'field' })[0];
            if (!definition) {
                console.error(`Search field ${fieldName} is not a part of filter difinitions`); // eslint-disable-line no-console
                return null;
            }
            const { condition, type } = definition;

            return this.buildFilter(fieldName, condition || this.getConditionByType(type), filters.searchBar, type);
        }).filter(filter => filter);
        if (statements.length === 1) {
            filterBy.push(statements[0]);
        } else if (statements.length > 1) {
            filterBy.push({ or: statements });
        }

        return filterBy;
    };

    @bind
    setEditedOrderBy(data) {
        this.setState({
            editedOrderBy: data,
        });
    }

    @bind
    @memoize()
    getSortOptions(filterDefinitions: Array<Object>) {
        return filterDefinitions.filter(def => def.sort !== false).map((definition) => {
            return {
                label: get(definition, 'properties.label'),
                value: get(definition, 'field'),
            };
        });
    }

    @bind
    @memoize()
    getFilterDefinitions(filterDefinitions: Array<Object>) {
        return filterDefinitions.filter(def => def.filters !== false);
    }

    @bind
    @memoize()
    buildOrderComponents(filterDefinitions: Array<Object>) {
        const sortOptions = this.getSortOptions(filterDefinitions);
        return sortOptions.length !== 0 ? [
            {
                type: 'typeahead',
                properties: {
                    label: 'Sort by',
                    name: 'field',
                    options: sortOptions,
                },
            },
            {
                type: 'typeahead',
                properties: {
                    label: 'Order by',
                    name: 'direction',
                    options: [{ label: 'Descending', value: 'desc' }, { label: 'Ascending', value: 'asc' }],
                },
            },
        ] : null;
    }


    render() {
        const { isFiltersOpen, editedOrderBy } = this.state;
        const { filterDefinitions, children, filterViewState, defaultFilters, defaultOrder, className, leftToolbar, rightToolbar } = this.props;
        const { filters, orderBy } = this.getFilterViewState(filterViewState, defaultFilters, defaultOrder);
        const orderComponents = this.buildOrderComponents(filterDefinitions);
        const filterComponents = this.getFilterDefinitions(filterDefinitions);
        const isAnyDefinitions = (orderComponents || []).length > 0 || (filterComponents || []).length > 0;
        return (
            <GridWrapper className={className} container direction="column">
                <FiltersToolbar isAnyDefinitions={isAnyDefinitions} searchValue={get(filters, 'searchBar')} onSearch={this.updateSearchBarFilter} toggleDrawer={this.toggleDrawer} classes={classesToolbar} leftToolbar={leftToolbar} rightToolbar={rightToolbar}/>
                <FiltersChips filters={filters} filterDefinitions={filterDefinitions} onChange={this.setEditedFilterByWithUpdate} classes={classesChips} />
                {/*<FiltersOrderToolbar orderBy={editedOrderBy} onChange={this.setEditedOrderByWithUpdate} sortOptions={this.getSortOptions()}  />*/}
                <Content>
                    {children(
                        this.formatFilterBy(filters),
                        orderBy,
                    )}
                </Content>
                {isAnyDefinitions && <FiltersDrawer onApply={this.applyFilter} open={isFiltersOpen} onClose={this.toggleDrawer}>
                    {orderComponents && (
                        <Fragment>
                            <Title><Typography component="span" variant="caption">Sort</Typography></Title>
                            <FormGenerator
                                onChange={this.setEditedOrderBy}
                                components={this.buildOrderComponents(filterDefinitions)}
                                data={editedOrderBy}
                            />
                        </Fragment>
                    )}
                    <Title><Typography component="span" variant="caption">Filter</Typography></Title>
                    <FormGenerator
                        onChange={this.setEditedFilterBy}
                        components={filterComponents}
                        data={filters}
                    />
                </FiltersDrawer>}
            </GridWrapper>
        );
    }
}

export default connect(
    (state, props) => ({
        filterViewState: get(state, `component.state.${props.id}`),
    }),
    { saveComponentState },
)(Filters);
