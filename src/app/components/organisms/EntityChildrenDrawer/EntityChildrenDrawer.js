/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import type { ContextRouter } from 'react-router';
import { Link } from 'react-router-dom';
import memoizeOne from 'memoize-one';
import Drawer from 'app/components/atoms/Drawer/Drawer';
import { deepEquals } from 'app/utils/utils';
import Loader from 'app/components/atoms/Loader/Loader';
import EntityChildrenDrawerChild from 'app/components/organisms/EntityChildrenDrawer/EntityChildrenDrawerChild';
import {
    closeEntityChildrenDrawer,
    loadEntityChildrenDrawer,
} from 'store/actions/entityChildrenDrawer/entityChildrenDrawerActions';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import styled from 'styled-components';
import Input from 'app/components/atoms/Input/Input';
import Text from 'app/components/atoms/Text/Text';
import Icon from 'app/components/atoms/Icon/Icon';
import { getNum } from 'app/utils/utils';
import { get } from 'app/utils/lo/lo';
import Avatar from 'app/components/molecules/Avatar/Avatar';

const DrawerHeader = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledAvatar = styled(Avatar)`
    margin-right: 5px;
`;

const DrawerHeaderTop = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20px 10px 10px 10px;
`;

const HeaderDataContainer = styled.div`
    display: flex;
`;

const HeaderTextContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const DrawerHeaderEntityName = styled.h1`
    margin: 0;
    padding: 0 5px;
`;

const DrawerHeaderEntityId = styled.h2`
    margin: 0;
    padding: 0 5px;
`;

const DrawerHeaderInput = styled(Input)`
    width: calc(100% - 20px );
    margin: 0 10px 0 10px;
`;

const StyledTitleText = styled(Text)`
    max-width: 160px;
    display: block;
    white-space: nowrap;
`;

const Par = styled.p`
    padding: 1rem;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

const CourtesyText = styled.p`
    text-align: left;
    margin: 0;
    font-size: 0.9rem;
`;

type P = {
    ...ContextRouter,
    isOpen: boolean,
    isLoading: boolean,
    entity: Object,
    children?: Array<Object>,
    loadChildren: Function,
    closeChildrenDrawer: Function,
    currentId: number | null,
};

type S = {
    searchText: string,
};

/**
 * EntityChildrenDrawer to display children navigation for entities
 */
class EntityChildrenDrawer extends Component<P, S> {
    static defaultProps = {
        isOpen: false,
        children: [],
    };

    static getChildren = memoizeOne((children, searchText) => {
        if (!children || !children.length) {
            return false;
        }
        if (!searchText) {
            return children;
        }
        return children.filter(({ name }) => name.toLowerCase().includes(searchText));
    });

    state = {
        searchText: '',
    };

    shouldComponentUpdate(nextProps: Object, nextState: Object, nextContext: any): boolean {
        return !deepEquals(this.props, nextProps) || !deepEquals(this.state, nextState);
    }

    componentDidUpdate(prevProps: Object, prevState: Object): void {
        if (this.props.isOpen && this.props.isOpen !== prevProps.isOpen) {
            this.load(getNum(this, 'props.match.params.id') || 0);
        }
    }

    componentWillUnmount(): void {
        this.props.closeChildrenDrawer();
        this.props.loadChildren(null);
    }

    onClose = () => {
        this.load(null);
        this.props.closeChildrenDrawer();
    };

    getLink = (id) => {
        return this.props.location.pathname.replace(get(this, 'props.match.params.id') || '', id);
    };

    onSearchTextChange = (event: Object) => { // TODO: maybe add debounce?
        event.preventDefault();
        const { value } = event.target;
        this.setState({ searchText: (value || '').toLowerCase() });
    };

    load = (id: ?number) => {
        this.setState({ searchText: '' });
        this.props.loadChildren(id);
    };

    loadParent = (event: Event) => {
        event.preventDefault();
        if (this.props.entity && this.props.entity.parent && this.props.entity.parent.id) {
            this.load(this.props.entity.parent.id);
        }
    };

    renderContent(): ?Object {
        if (!this.props.isOpen) {
            return null;
        }
        if (this.props.isLoading) {
            return (<Loader/>);
        }
        if (!this.props.children || !this.props.children.length) {
            return (<Par>No children found.</Par>); // TODO: clarify massage from requirements
        }
        const children = this.constructor.getChildren(this.props.children, this.state.searchText);
        if (!children || !children.length) {
            return (<Par>No children found for searched text "{this.state.searchText}"</Par>); // TODO: clarify massage from requirements
        }
        return children.map((child, index) => (
            <EntityChildrenDrawerChild
                {...child}
                key={index}
                getLink={this.getLink}
                load={this.load}
                className={String(child.id) === String(this.props.match.params.id) ? 'selected' : ''}
            />
        ));
    }

    render() {
        return (
            <Drawer
                DrawerHeader={this.renderDrawerHeader}
                isOpen={this.props.isOpen}
                isToggled={this.onClose}
                drawerContentPadding={'0px'}
            >
                {this.renderContent()}
            </Drawer>
        );
    }

    renderDrawerHeader = ({ toggleDrawer }) => {
        const { name = '', id = '', image = '', parent = false } = this.props.entity || {};
        return (
            <DrawerHeader>
                <DrawerHeaderTop>
                    <div>{ !this.props.entity ? (
                        <Icon color={'red'} colorIndex={2} name={'information'} />
                    ) : (
                        parent && parent.id && <ButtonIcon icon="chevron-left" onClick={this.loadParent}/>
                    )}
                    </div>
                    <div>
                        {!name && !id ? (
                            !this.props.entity ? (
                                <CourtesyText>{'You don\'t have permission'}<br/>to access parent #{this.props.currentId}</CourtesyText>
                            ) : (
                                <Loader/>
                            )
                        ) : (
                            <HeaderDataContainer>
                                <StyledAvatar src={image} name={name} size="xl"/>
                                <HeaderTextContainer>
                                    <DrawerHeaderEntityName>
                                        <StyledLink to={this.getLink(id)}>
                                            <StyledTitleText title={name}>{name}</StyledTitleText>
                                        </StyledLink>
                                    </DrawerHeaderEntityName>
                                    <DrawerHeaderEntityId>#{id}</DrawerHeaderEntityId>
                                </HeaderTextContainer>
                            </HeaderDataContainer>
                        )}
                    </div>
                    <div>
                        <ButtonIcon icon="close" onClick={toggleDrawer}/>
                    </div>
                </DrawerHeaderTop>
                <DrawerHeaderInput
                    type="text"
                    value={this.state.searchText}
                    onChange={this.onSearchTextChange}
                    placeholder="Search..."
                    title={'Search for children name'}
                />
            </DrawerHeader>
        );
    };
}

export default connect(
    (state) => {
        const { entity = {}, entities = [] } = (state.entityChildrenDrawer.data || {});
        return {
            isOpen: state.entityChildrenDrawer.isOpen,
            isLoading: state.entityChildrenDrawer.isLoading,
            entity,
            children: entities,
            currentId: state.entityChildrenDrawer.currentId,
        };
    },
    {
        loadChildren: loadEntityChildrenDrawer,
        closeChildrenDrawer: closeEntityChildrenDrawer,
    },
)(withRouter(EntityChildrenDrawer));
