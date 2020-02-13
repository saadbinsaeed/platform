/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import styled from 'styled-components';

import DataTable from 'app/components/molecules/DataTable/DataTableServer/DataTable';
import { get } from 'app/utils/lo/lo';
import { graphql } from 'graphql/client';
import { showToastr } from 'store/actions/app/appActions';

const Wrapper = styled.div`
    margin: 1rem 0;
    border: 1px solid gray;
`;


/**
 * @class
 */
class DataTableWrapper extends PureComponent<Object, Object> {

    /**
     * @const propTypes - describes the properties of the Component
     */
    static propTypes = {
        graphQlQuery: PropTypes.string.isRequired,
        graphQlWhere: PropTypes.string,
        graphQlDefaultOrderBy: PropTypes.string,
        columnDefinitions: PropTypes.array.isRequired,
        gridSettings: PropTypes.object.isRequired,
    };

    static defaultProps = {
        graphQlOptions: {},
        isLoading: false,
    };

    state = {
        records: [],
        count: 0,
        isLoading: false,
        isDownloading: false,
    };

    loadRows = (options: Object) => {
        let where, defaultOrderBy;
        try {
            where = JSON.parse(this.props.graphQlWhere || '[]');
        } catch (error) {
            this.props.showToastr({ severity: 'error', detail: `Error parsing graphQlWhere: ${error}`  });
            return;
        }
        try {
            defaultOrderBy = this.props.graphQlDefaultOrderBy && JSON.parse(this.props.graphQlDefaultOrderBy);
        } catch (error) {
            this.props.showToastr({ severity: 'error', detail: `Error parsing graphQlDefaultOrderBy: ${error}`  });
            return;
        }
        const variables = (options || {});
        variables.where = [ ...variables.where, ...where ];
        if (defaultOrderBy && (!variables.orderBy || !variables.orderBy.length)) {
            variables.orderBy = defaultOrderBy;
        }
        const countMax = 10000;
        this.setState({ isLoading: true });
        return graphql.query({
            query: gql(this.props.graphQlQuery),
            variables: {
                page: 1,
                pageSize: 10,
                ...variables,
                countMax,
                orderBy: (variables.orderBy || []).map(({ field, asc }) => ({ field, direction: asc ? 'asc' : 'desc' })),
            },
            fetchPolicy: 'no-cache',
        }).then( (response: Object) => {
            const { count, records } = get(response, 'data') || {};
            if (!Number.isInteger(count) || !Array.isArray(records)) {
                console.warn(`The query "${this.props.graphQlQuery}" is not returning the correct data.`, response); // eslint-disable-line no-console
                throw new Error('The service\'s response is not well formed.');
            }
            this.setState({ records, count, isLoading: false });
        }).catch((error) => {
            this.props.showToastr({ severity: 'error', detail: `the grqphQl service is returning an error: ${error}` });
            this.setState({ records: [], count: 0, isLoading: false });
        });
    };

    /**
     * @override
     */
    render(): Object {

        const { gridSettings, columnDefinitions } = this.props;
        return (
            <Wrapper>
                <DataTable
                    gridSettings={gridSettings}
                    columnDefinitions={columnDefinitions}
                    loadRows={this.loadRows}
                    isLoading={this.state.isLoading}
                    isDownloading={this.props.isDownloading}
                    disableCountdown={true}
                    value={this.state.records}
                    totalRecords={this.state.count}
                    showMenuButton
                    toggleMenu={this.props.toggleMenu}
                />
            </Wrapper>
        );
    }

}

export default connect(null, { showToastr } )(DataTableWrapper);
