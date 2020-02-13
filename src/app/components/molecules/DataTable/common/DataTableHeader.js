/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InputText } from 'primereact/components/inputtext/InputText';

import Button from 'app/components/atoms/Button/Button';
import ReloadCountdown from 'app/components/molecules/ReloadCountdown/ReloadCountdown';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import { compose, pure, setPropTypes, defaultProps } from 'recompose';

/**
 * Generate the styled for the Header
 */
const DataTableHeaderCss = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0.5rem;
    color: #fff;
    .ui-inputtext {
        width: 100%;
    }
    > div {
        display: flex;
    }
    div.search {
        flex-grow: 1;
        justify-content: center;
        @media (min-width: 1024px) {
            .ui-inputtext {
                width: 50%;
            }
        }
    }
    div.first {
        text-align: left;
        margin-right: auto;
    }
    div.last {
        text-align: right;
        margin-left: auto;
    }
`;

const DataTableHeader = (props: Object) => (
    <DataTableHeaderCss>
        <div className="first">
            {props.toggleSettings && <ButtonIcon icon="settings" iconColor="white" size="sm" onClick={props.toggleSettings} />}
            {!props.disableExpandAll && props.expandChildren && (
                <ButtonIcon
                    title={props.isChildrenExpanded ? 'Collapse groups' : 'Expand groups'}
                    icon={props.isChildrenExpanded ? 'unfold-less-horizontal' : 'unfold-more-horizontal'}
                    iconColor="white"
                    size="sm"
                    onClick={props.expandChildren}
                />
            )}

            {props.exportData && (
                <ButtonIcon
                    loading={props.isDownloading}
                    icon="cloud-download"
                    title={props.downloadAll ? 'Exports all records' : 'Exports up to 1000 records'}
                    iconColor="white"
                    size="sm"
                    onClick={props.exportData}
                />
            )}
        </div>
        <div className="search">{props.onGlobalSearch && <InputText type="search" value={props.globalSearchValue} onChange={props.onGlobalSearch} placeholder="Global Search" size="50" />}</div>
        <div className="last">
            {props.refreshAction && (
                <ReloadCountdown disableCountdown={props.disableCountdown} seconds={props.countdownSeconds} format="minutes" action={props.refreshAction} />
            )}
            {props.showMenuButton && (
                <Button onClick={props.toggleMenu} icon="menu" iconColor="white" size="sm" />
            )}
        </div>
    </DataTableHeaderCss>
);

export default compose(
    pure,
    setPropTypes({
        toggleSettings: PropTypes.func,
        expandChildren: PropTypes.func,
        toggleMenu: PropTypes.func,
        exportData: PropTypes.func,
        onGlobalSearch: PropTypes.func,
        refreshAction: PropTypes.func,
        showMenuButton: PropTypes.bool,
        countdownSeconds: PropTypes.number,
        disableCountdown: PropTypes.bool,
        disableExpandAll: PropTypes.bool,
        downloadAll: PropTypes.bool,
        noRefresh: PropTypes.bool,
        isDownloading: PropTypes.bool,
    }),
    defaultProps({ isChildrenExpanded: false, disableExpandAll: false })
)(DataTableHeader);
