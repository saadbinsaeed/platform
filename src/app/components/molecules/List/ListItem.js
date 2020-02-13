/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure, setPropTypes } from 'recompose';
import styled from 'styled-components';
import Title from 'app/components/atoms/Title/Title';
import ItemColumn from './ItemColumn';
import ListItemBase from './ListItemBase';
import ItemRow from './ItemRow';

// UI IMPORTS

// STYLE IMPORTS
const SubTitle = styled(Title)`
    font-size: 0.8rem !important;
`;

const ListText = styled.div`
    font-size: 0.8em;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${({ theme }) => theme.base.textColor || ''};
`;

const ListItem = (props: Object) => {
    const { component, title, subTitle, text, actions, small, shadow, raised, className, rowWrap, ...rest } = props;
    return (
        <ListItemBase {...rest} small={small} raised={shadow || raised} className={className}>
            <ItemRow wrap={rowWrap}>
                {component && <ItemColumn>{component}</ItemColumn>}
                <ItemColumn grow>
                    <Title as="h3">{title}</Title>
                    <SubTitle as="h4">{subTitle}</SubTitle>
                    <ListText>{text}</ListText>
                </ItemColumn>
                {actions && <ItemColumn>{actions}</ItemColumn>}
            </ItemRow>
        </ListItemBase>
    );
};

export default compose(
    pure,
    setPropTypes({
        shadow: PropTypes.bool,
        raised: PropTypes.bool,
        small: PropTypes.bool,
        component: PropTypes.node,
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        login: PropTypes.string,
        subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        actions: PropTypes.node
    })
)(ListItem);
