/* @flow */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { pure } from 'recompose';

import WidgetHeader from 'app/components/atoms/WidgetHeader/WidgetHeader';
import Loader from 'app/components/atoms/Loader/Loader';
import Title from 'app/components/atoms/Title/Title';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import { ChildrenProp } from 'app/utils/propTypes/common';
import ScrollBarMin from 'app/utils/styles/ScrollMinStyle';

const WidgetBase = styled.div`
    position: relative;
    border-radius: .2rem;
    margin: 0 0 1rem 0;
    min-height: 260px;
    background: ${({ theme }) => theme.widget.background };
    box-shadow: ${({ theme }) => theme.shadow.z1 };
`;

const Content = styled.div`
    font-size: 0.8rem;
    padding: 0 1rem;
    overflow: auto;
    max-height: 300px;
    ${ScrollBarMin};
`;

const Children = styled.div`
    ${ScrollBarMin};
`;

const SubTitle = styled(Title)`
    margin-left: .5rem !important;
    font-size: .7rem !important;
    color: ${({ theme }) => theme.base.textColor || 'inherit'} !important;
    opacity: 0.5;
`;


const Widget = ({ title, subTitle, content, children, loading, url }: Object) => (
    <WidgetBase>
        {loading ? (<Loader absolute />) : (
            <Fragment>
                <WidgetHeader>
                    <Title as="h3">{title || 'No Name'}</Title>
                    <SubTitle as="h4">{subTitle}</SubTitle>
                    {url && <Link to={url}><ButtonIcon icon="arrow-right-bold" size="sm" /></Link>}
                </WidgetHeader>
                {content && <Content>{content}</Content>}
                {children && <Children>{children}</Children>}
            </Fragment>
        )}
    </WidgetBase>
);

Widget.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string,
    content: ChildrenProp,
    loading: PropTypes.bool,
    url: PropTypes.string,
};

export default pure(Widget);
