/* @flow */

import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import memoize from 'memoize-one';
import { TextField } from '@mic3/platform-ui';

import Container from 'app/components/atoms/Container/Container';
import Form from 'app/components/atoms/Form/Form';
import Icon from 'app/components/atoms/Icon/Icon';
import Layout from 'app/components/molecules/Layout/Layout';
import TextIcon from 'app/components/molecules/TextIcon/TextIcon';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import ActionBar from 'app/components/molecules/ActionBar/ActionBar';
import { InputText } from 'primereact/components/inputtext/InputText';
import Drawer from 'app/components/atoms/Drawer/Drawer';
import Button from 'app/components/atoms/Button/Button';
import Flex from 'app/components/atoms/Flex/Flex';
import ClassificationItem from './ClassificationItem';
import { bind } from 'app/utils/decorators/decoratorUtils';

const BurgerWrap = styled.div`
    display: flex;
    line-height: 16px;
    .Icon {
        border-right: 1px solid #5f5f5f;
        padding: 0 10px 0 10px;
        &:last-child {
            border-right: none;
            margin-right: 0px;
        }
    }
`;

const FullWidthInputText = styled(InputText)`
    width: 100%;
    text-indent: 10px;
`;

/**
 * Dynamically renders classifications
 */
class EntityClassifications extends PureComponent<Object, Object> {
    static propTypes: Object = {
        classes: PropTypes.array,
        removeClass: PropTypes.func,
        attributes: PropTypes.object,
        updateAttribute: PropTypes.func.isRequired,
        saveEntityAttributes: PropTypes.func,
        canEdit: PropTypes.bool,
        canViewClasses: PropTypes.bool,
        canAdd: PropTypes.bool,
        isSaveAvailable: PropTypes.bool,
    };

    static defaultProps = {
        classes: [],
        attributes: {},
        canEdit: false,
        canViewClasses: false,
        canAdd: true,
        isSaveAvailable: true,
    };

    filterClasses(classes, searchText, filterClassName, filterGroupName, filterAttrName) {
        if (!classes) {
            return [];
        }
        if (!searchText && !filterClassName && !filterGroupName && !filterAttrName) {
            return classes;
        }
        if (searchText && !filterClassName && !filterGroupName && !filterAttrName) {
            return classes.filter(({ name, groups }) => {
                // the class name contains the searchText
                return name.toLowerCase().includes(searchText) || !!groups.find(({ name, fields }) => {
                    // at least one group's name contains the searchText
                    return name.toLowerCase().includes(searchText) || !!fields.find(({ name }) => {
                        // at least one attribute's name contains the searchText
                        return name.toLowerCase().includes(searchText);
                    });
                });
            });
        }
        return classes.filter(({ name, groups }) => {
            return name.toLowerCase().includes(filterClassName) && !!groups.find(({ name, fields }) => {
                return name.toLowerCase().includes(filterGroupName) && !!fields.find(({ name }) => {
                    return name.toLowerCase().includes(filterAttrName);
                });
            });
        });
    };

    sortClasses(classes, isAscending) {
        if (!classes) {
            return [];
        }
        if (isAscending === null) {
            return classes;
        }
        const modifiable = [...classes];
        modifiable.sort(({ name = '' }: Object, { name: name2 = '' }: Object) => {
            const first = name.toLowerCase();
            const second = name2.toLowerCase();
            return first > second ? 1 : second > first ? -1 : 0;
        });
        return isAscending ? modifiable : modifiable.reverse();
    };

    sortAndFilter = memoize((
        classes: Array<Object>,
        isAscending: boolean | null,
        searchText: string,
        filterClassName: string,
        filterGroupName: string,
        filterAttrName: string,
    ) => {
        if (!classes) {
            return [];
        }
        return this.filterClasses(
            this.sortClasses(classes, isAscending),
            searchText,
            filterClassName,
            filterGroupName,
            filterAttrName,
        );
    });

    state = {
        searchText: '',
        filterClassName: '',
        filterGroupName: '',
        filterAttrName: '',
        isFiltersOpen: false,
        isCollapsed: true,
        isSortAscending: null,
    };

    /**
     * toggleCollapse Function to toggle expand/collapse all
     */
    toggleCollapse = () => {
        this.setState(prevState => ({ isCollapsed: !prevState.isCollapsed }));
    };

    /**
     * toggleSorting Function to toggle sorting ascending/descending
     */
    toggleSorting = () => {
        this.setState(prevState => ({ isSortAscending: !prevState.isSortAscending }));
    };

    /**
     * onClassificationSubmit Function perform attribute save when form submitted
     * @param event browser event on form submit
     */
    onClassificationSubmit = (event: Object) => {
        event.preventDefault();
        this.props.saveEntityAttributes(event);
    };

    /**
     * handleSearch Function to update state with typed lowered value of searchText
     * @param event Browser Event on input
     */
    handleSearch = (event: Object) => {
        const { value } = event.target;
        this.setState({ searchText: (value || '').toLowerCase() });
    };

    @bind
    __buildClassificationItems(visibleClasses: Array<Object>){
        const { classes, attributes, canEdit, canViewClasses, removeClass, updateAttribute } = this.props;
        const { isCollapsed, searchText, filterClassName, filterGroupName, filterAttrName } = this.state;
        return (visibleClasses.map((classification, index) => (
            <ClassificationItem
                {...classification}
                key={index}
                classes={classes}
                canEdit={canEdit}
                canViewClasses={canViewClasses}
                removeClass={removeClass}
                searchText={searchText}
                filterClassName={filterClassName}
                filterGroupName={filterGroupName}
                filterAttrName={filterAttrName}
                updateAttribute={updateAttribute}
                attributes={attributes}
                isCollapsed={isCollapsed}
            />
        )));
    }

    /**
     * @override
     */
    render(): Object {
        const { canEdit, canAdd, classes, isSaveAvailable } = this.props;
        const { isCollapsed, isSortAscending, searchText, filterClassName, filterGroupName, filterAttrName } = this.state;
        const isSearchDisabled = filterClassName || filterGroupName || filterAttrName;
        const visibleClasses = this.sortAndFilter(
            classes,
            isSortAscending,
            searchText,
            filterClassName,
            filterGroupName,
            filterAttrName,
        );
        return (
            <Fragment>
                <ActionBar
                    left={
                        <TextField
                            onChange={this.handleSearch}
                            InputProps={{
                                disableUnderline: true,
                            }}
                            variant="standard"
                            margin="none"
                            value={searchText}
                            placeholder={isSearchDisabled
                                ? 'Clear filters to enable this field'
                                : 'Search for classification / group / attribute name ...'}
                            disabled={isSearchDisabled}

                        />
                    }
                    right={
                        <BurgerWrap>
                            <Icon onClick={() => this.setState({ isFiltersOpen: true })} name="filter" />
                            <Icon
                                onClick={this.toggleSorting}
                                name={isSortAscending ? 'sort-ascending' : 'sort-descending'}
                                title={`Click here to sort classes by name in ${!isSortAscending
                                    ? 'ascending'
                                    : 'descending'} order`}
                            />
                            {canEdit && canAdd && <Link to={`${this.props.match.url}/add`}><Icon name="plus" /></Link>}
                            {/*<Icon name="sitemap" />*/}
                            <Icon
                                onClick={this.toggleCollapse}
                                name={isCollapsed ? 'unfold-more-horizontal' : 'unfold-less-horizontal'}
                                title={`Click here to ${isCollapsed
                                    ? 'show'
                                    : 'hide'} attributes of all classifications`}
                            />
                        </BurgerWrap>
                    }
                    rightShrink
                />
                <Layout
                    content={
                        <Fragment>
                            <Container>
                                {visibleClasses && visibleClasses.length ? (
                                    isSaveAvailable ?
                                        <Form title="" onSubmit={this.onClassificationSubmit} id="classificationForm">
                                            {this.__buildClassificationItems(visibleClasses)}
                                        </Form> :
                                        this.__buildClassificationItems(visibleClasses)
                                ) : (
                                    this.state.searchText
                                        ? `No classification/group/attribute matches search criteria "${this.state.searchText}"`
                                        : 'No classification data is available for this entity.'
                                )}
                            </Container>
                            <Drawer
                                title="Filters"
                                isOpen={this.state.isFiltersOpen}
                                isToggled={() => this.setState({ isFiltersOpen: !this.state.isFiltersOpen })}
                                footer={
                                    <Flex spaceBetween grow>
                                        <Button
                                            onClick={() => this.setState({
                                                filterClassName: '',
                                                filterGroupName: '',
                                                filterAttrName: '',
                                            })}
                                        >Clear all</Button>
                                    </Flex>
                                }
                            >
                                <Fragment>
                                    <h4>Classification Name</h4>
                                    <FullWidthInputText
                                        type={'text'}
                                        onChange={e => this.setState({
                                            filterClassName: e.target.value.toLowerCase(),
                                            searchText: '',
                                        })}
                                        value={this.state.filterClassName}
                                        placeholder="Type classification name"
                                    />
                                    <h4>Group Name</h4>
                                    <FullWidthInputText
                                        type={'text'}
                                        onChange={e => this.setState({
                                            filterGroupName: e.target.value.toLowerCase(),
                                            searchText: '',
                                        })}
                                        value={this.state.filterGroupName}
                                        placeholder="Type group name"
                                    />
                                    <h4>Attribute Name</h4>
                                    <FullWidthInputText
                                        type={'text'}
                                        onChange={e => this.setState({
                                            filterAttrName: e.target.value.toLowerCase(),
                                            searchText: '',
                                        })}
                                        value={this.state.filterAttrName}
                                        placeholder="Type attribute name"
                                    />
                                </Fragment>
                            </Drawer>
                        </Fragment>
                    }
                />
                {isSaveAvailable && (
                    <FooterBar>
                        {classes && classes.length ?
                            <TextIcon
                                icon="content-save"
                                label="Save"
                                color="primary"
                                form="classificationForm"
                                type="submit"
                            /> : null}
                    </FooterBar>
                )}
            </Fragment>
        );
    }
}

export default withRouter(EntityClassifications);
