/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import memoize from 'fast-memoize';

import { Paginator as PrimePaginator } from 'primereact/components/paginator/Paginator';

const Paginator = styled(PrimePaginator)`
    .ui-dropdown-label {
        margin: 0;
        min-height: 25px !important;
    }
    .ui-inputtext {
        min-height: 20px;
    }
    > .ui-paginator-pages a {
        width: auto;
        padding: 0px 4px
    }
    .ui-paginator-right-content {
        float: none !important;
    }

    border: 0 none !important;
`;

/**
 * Extends the prime react paginator component for themeing and custom grid pagination
 */
class DataTablePaginator extends PureComponent<Object, Object> {

    static propTypes = {
        totalRecords: PropTypes.number,
        countMax: PropTypes.number,
        page: PropTypes.number,
        pageSize: PropTypes.number,
        onPageChange: PropTypes.func,
    };

    buildOptions = memoize(pageSize => [ pageSize, ...[10, 20, 30, 50, 100].filter(v => v !== pageSize) ]);

    /**
     * Render the Pagination
     */
    render() {
        const { page, pageSize, totalRecords, countMax, onPageChange } = this.props;
        let rightContent = '';
        if (countMax && totalRecords === countMax) {
            rightContent = `more than ${countMax} rows`;
        } else if (Number.isInteger(totalRecords)) {
            rightContent = `${totalRecords} rows`;
        }
        return (
            <Paginator
                rows={pageSize}
                totalRecords={totalRecords}
                rowsPerPageOptions={this.buildOptions(pageSize)}
                first={(page - 1) * pageSize}
                onPageChange={onPageChange}
                rightContent={rightContent}
            />
        );
    }
}

export default DataTablePaginator;
