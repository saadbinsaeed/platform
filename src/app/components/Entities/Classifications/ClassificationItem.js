/* @flow */
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import memoizeOne from 'memoize-one';
import { Col, Row } from 'react-styled-flexboxgrid';
import { Link } from 'react-router-dom';

import Icon from 'app/components/atoms/Icon/Icon';
import PopupMenu from 'app/components/molecules/PopupMenu/PopupMenu';
import Card from 'app/components/molecules/Card/Card';
import MenuItem from 'app/components/molecules/Menu/MenuItem';
import GroupItem from './GroupItem';

const CardTitleContainer = styled.h1`
    display: flex;
    flex-direction: column;
    margin: 0 0 0 1rem;
    width: 100%;
    overflow: hidden;
`;

const CardTitle = styled.span`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

const CardSummary = styled(CardTitle)`
    font-size: 0.6em;
    color: ${({ theme }) => theme.color.gray};
    font-weight: normal;
    line-height: 1.1;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: white;
    display: flex;
`;

/**
 * Single Classification Item component
 */
class ClassificationItem extends PureComponent<Object, Object> {
    static propTypes = {
        id: PropTypes.number.isRequired,
        uri: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        active: PropTypes.bool,
        color: PropTypes.string,
        groups: PropTypes.array,
        inherited: PropTypes.bool,

        classes: PropTypes.array,

        canEdit: PropTypes.bool,
        canViewClasses: PropTypes.bool,
        removeClass: PropTypes.func,

        searchText: PropTypes.string,
        filterGroupName: PropTypes.string,
        filterAttrName: PropTypes.string,

        attributes: PropTypes.object,
        updateAttribute: PropTypes.func.isRequired,

        isCollapsed: PropTypes.bool,
    };

    static defaultProps = {
        active: true,
        color: '#00BCD4',
        groups: [],
        inherited: false,
        classes: [],
        canEdit: false,
        canViewClasses: false,
        searchText: '',
        filterGroupName: '',
        filterAttrName: '',
        attributes: {},
        isCollapsed: false,
    };

    filterGroups = memoizeOne((groups, searchText, filterGroupName, filterAttrName) => {
        if (!groups) {
            return [];
        }
        if (!searchText && !filterGroupName && !filterAttrName) {
            return groups;
        }
        if (searchText && !filterGroupName && !filterAttrName) {
            return groups.filter(({ name, fields = [] }) => {
                return name.toLowerCase().includes(searchText) || !!fields.find(({ name }) => {
                    return name.toLowerCase().includes(searchText);
                });
            });
        }
        return groups.filter(({ name, fields = [] }) => {
            return name.toLowerCase().includes(filterGroupName) && !!fields.find(({ name }) => {
                return name.toLowerCase().includes(filterAttrName);
            });
        });
    });

    constructor(...args: Array<any>) {
        super(...args);
        this.state = {
            color: this.props.color || '#00BCD4', // fix for null database return, defaultProps doesn't work here
            isCollapsed: this.props.isCollapsed,
        };
    }

    componentDidUpdate(prevProps: Object) {
        if (prevProps.color !== this.props.color) {
            this.setState({ color: this.props.color || '#00BCD4' });
        }
        if (prevProps.isCollapsed !== this.props.isCollapsed) {
            // "force" update collapsed state when we press "collapse/expand all"
            this.setState({ isCollapsed: this.props.isCollapsed });
        }
    }

    /**
     * toggleCollapse Function to set state of single classification collapsed/expanded
     */
    toggleCollapse = () => {
        this.setState(prevState => ({ isCollapsed: !prevState.isCollapsed }));
    };

    /**
     * Call this.props.removeClass passing the uri of the class that needs to be removed.
     */
    removeClass = () => {
        this.props.removeClass && this.props.removeClass(this.props.uri);
    };

    /**
     *
     * @returns {*}
     */
    render() {
        const { id, name, uri, groups, children, inherited, active } = this.props;
        const { canEdit, canViewClasses, attributes, updateAttribute, removeClass } = this.props;
        const { searchText, filterGroupName, filterAttrName } = this.props;
        const { color, isCollapsed } = this.state;
        const showEntireClass = searchText && name.toLowerCase().includes(searchText);
        const visibleGroups = showEntireClass ? groups : this.filterGroups(groups, searchText, filterGroupName, filterAttrName);
        return (
            <Card
                key={id}
                transparent
                headerColor="transparent"
                title={
                    <Fragment>
                        <Icon name="label" hexColor={color}/>
                        <CardTitleContainer>
                            <CardTitle title={name}>{name}</CardTitle>
                            <CardSummary title={uri}>{uri}{!active ? ' (Inactive)' : ''}</CardSummary>
                            {inherited && <CardSummary>Parent of {children.map(({ name }) => name).join(',')}</CardSummary>}
                        </CardTitleContainer>
                    </Fragment>
                }
                description={
                    <Row>
                        {groups.length ? (
                            visibleGroups.length ? (
                                visibleGroups.map((group, index) => (
                                    <Col key={index} xs={12} sm={6} md={4}>
                                        <GroupItem
                                            key={index}
                                            {...group}
                                            canEdit={canEdit}
                                            searchText={showEntireClass ? '' : searchText}
                                            filterAttrName={filterAttrName}
                                            attributes={attributes}
                                            updateAttribute={updateAttribute}
                                            isCollapsed={isCollapsed}
                                        />
                                    </Col>
                                ))
                            ) : (
                                <Col xs={12}>
                                    <Card
                                        headerColor="#384147"
                                        description={<span> No classification data matches search/filter criteria. </span>}
                                    />
                                </Col>
                            )
                        ) : (
                            <Col xs={12}>
                                <Card
                                    headerColor="#384147"
                                    description={<span> No classification data is available. </span>}
                                />
                            </Col>
                        )}

                    </Row>
                }
                headerActions={
                    <Fragment>
                        {visibleGroups.length || canViewClasses || (!inherited && canEdit) ? (
                            <PopupMenu
                                placement="top right"
                                nowrap
                                content={
                                    <Fragment>
                                        {visibleGroups.length ? (<MenuItem
                                            name={isCollapsed ? 'Expand groups' : 'Minimize groups'}
                                            icon={isCollapsed ? 'chevron-down' : 'chevron-up'}
                                            onClick={this.toggleCollapse}
                                        />) : null}
                                        {canViewClasses && <StyledLink to={`/classifications/${id}`}>
                                            <MenuItem name="Go to classification manager" icon="exit-to-app"/>
                                        </StyledLink>}
                                        {!inherited && canEdit && removeClass && <MenuItem
                                            name="Remove Classification"
                                            icon="delete"
                                            onClick={this.removeClass}
                                        />}
                                    </Fragment>
                                }
                            >
                                <Icon name="dots-vertical"/>
                            </PopupMenu>
                        ) : null}
                    </Fragment>
                }
            />
        );
    }
}

export default ClassificationItem;
