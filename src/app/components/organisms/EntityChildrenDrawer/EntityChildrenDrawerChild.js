/* @flow */

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import memoizeOne from 'memoize-one';
import styled from 'styled-components';
import moment from 'moment';

import ListItem from 'app/components/molecules/List/ListItem';
import Avatar from 'app/components/molecules/Avatar/Avatar';
import Tag from 'app/components/atoms/Tag/Tag';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import Text from 'app/components/atoms/Text/Text';
import { getNum } from 'app/utils/utils';

export type P = {
    id: String,
    name: String,
    image?: String | null,
    classes?: Array<Object>,
    classesLimit?: Number,
    getLink: Function,
    modifiedDate: String,
    load: Function,
    className: String,
};

export type S = {
    showAllClasses: boolean,
    classesLimit: 3,
};

const SubTitle = styled.span`
    font-size: 0.8rem;
    color: ${({ theme }) => theme.color.gray};
    font-weight: normal;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

const StyledTag = styled(Tag)`
    padding: 1px 7px;
    font-size: 11px;
    line-height: 1.5;
`;

const StyledTitleText = styled(Text)`
    max-width: 165px;
    display: block;
`;

const StyledText = styled.div`
    white-space: normal;
`;

const StyledListItem = styled(ListItem)`
    border-bottom: 1px solid #607076;
    &.selected {
        background-color: #364951;
    }
    &:last-item {
        border-bottom: none;
    }
`;

/**
 * EntityChildrenDrawer to display children navigation for entities
 *
 * if in the future we would need prefetch children list for each child do it in componentDidMount
 */
class EntityChildrenDrawerChild extends Component<P, S> {
    static defaultProps = {
        image: null,
        classes: [],
        classesLimit: 3,
    };

    static getClasses = memoizeOne((
        classes: Array<Object> | null,
        limit: number = 3,
        showAll: boolean = false,
    ): ?Array<Object> => {
        if (!classes || classes.length === 0) {
            return null;
        }
        if (showAll) {
            return classes;
        }
        return classes.slice(0, limit);
    });

    state: Object = {
        showAllClasses: false,
    };

    static lastUpdate = memoizeOne((date) => {
        return moment(date).fromNow();
    });

    showAllClasses = (event: Event) => {
        event.preventDefault();
        this.setState({ showAllClasses: true });
    };

    hideExtraClasses = (event: Event) => {
        event.preventDefault();
        this.setState({ showAllClasses: false });
    };

    onNavigateRightClick = (event: Object) => {
        event.preventDefault();
        this.props.load(this.props.id);
    };

    render(): Object {
        const { modifiedDate, className } = this.props;
        const id = String(this.props.id);
        const lastUpdate = this.constructor.lastUpdate(modifiedDate);
        const subTitle = `#${id} • ${lastUpdate}`;
        const subTitleTitle = `ID: #${id} • Last Time Updated: ${lastUpdate}`;
        return (
            <StyledListItem
                className={className}
                component={(
                    <StyledLink to={this.props.getLink(this.props.id)}>
                        <Avatar src={this.props.image} name={this.props.name} size="xl"/>
                    </StyledLink>
                )}
                title={(
                    <StyledLink
                        to={this.props.getLink(this.props.id)}
                    >
                        <StyledTitleText title={this.props.name}>{this.props.name}</StyledTitleText>
                    </StyledLink>
                )}
                subTitle={(
                    <SubTitle>
                        <StyledTitleText title={subTitleTitle}>{subTitle}</StyledTitleText>
                    </SubTitle>
                )}
                text={<StyledText>{this.renderClasses()}</StyledText>}
                actions={(<ButtonIcon icon="chevron-right" onClick={this.onNavigateRightClick}/>)}
            />
        );
    }

    renderClasses(): ?Object {
        const classes = this.constructor.getClasses(
            this.props.classes,
            this.props.classesLimit,
            this.state.showAllClasses,
        );
        if (!classes) {
            return null;
        }
        const more = (getNum(this, 'props.classes.length') || 0) - (getNum(this, 'props.classesLimit') || 0);
        return (
            <Fragment>
                {classes.map(({ id, name, uri, color }, index) => (
                    <StyledTag title={uri} color={color} key={index}>{name}</StyledTag>
                ))}
                {more > 0 && (
                    !this.state.showAllClasses
                        ? (<StyledTag
                            title={'Click to see more classifications'}
                            onClick={this.showAllClasses}
                            color={'gray'}
                        >+{more}</StyledTag>)
                        : <StyledTag
                            title={'Click to see less classifications'}
                            onClick={this.hideExtraClasses}
                            color={'gray'}
                        >-{more}</StyledTag>
                )}
            </Fragment>
        );
    }
}

export default EntityChildrenDrawerChild;
