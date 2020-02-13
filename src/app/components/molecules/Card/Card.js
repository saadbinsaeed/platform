/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Image from 'app/components/atoms/Image/Image';
import Title from 'app/components/atoms/Title/Title';
import Icon from 'app/components/atoms/Icon/Icon';
import HeaderActions from 'app/components/atoms/HeaderActions/HeaderActions';
import { ChildrenProp } from 'app/utils/propTypes/common';
import ButtonIcon from '../ButtonIcon/ButtonIcon';
import CardHeader from './CardHeader';
import CardFooter from './CardFooter';
import CardContent from './CardContent';
import CardMeta from './CardMeta';
import CardDescription from './CardDescription';
import { isObject, isDefined } from 'app/utils/utils';

const CardStyle = styled.div`
   position: relative;
   display: block;
   border-radius: .2rem;
   margin: 0 0 1rem 0;
   background: ${({ theme, transparent }) => transparent ? 'transparent' : theme.widget.background };
   box-shadow: ${({ theme }) => theme.shadow.z1 };
`; // workaround for #4051

const CollapsibleContainer = styled.div`
    display: block;
    ${ ({ isCollapsed }) => isCollapsed ? 'display: none;' : '' };
`;

/**
 * Create our card component
 */
class Card extends Component<Object, Object> {
    /**
     * PropTypes
     */
    static propTypes = {
        className: PropTypes.string,
        image: PropTypes.string,
        icon: PropTypes.string,
        title: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string,
        ]),
        headerActions: PropTypes.element,
        headerPadding: PropTypes.bool,
        headerColor: PropTypes.string,
        descriptionPadding: PropTypes.bool,
        titleActions: PropTypes.element,
        meta: PropTypes.arrayOf(PropTypes.element),
        collapsible: PropTypes.bool,
        collapsed: PropTypes.bool,
        handleCollapsed: PropTypes.func,
        description: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node,
        ]),
        footer: PropTypes.element,
        transparent: PropTypes.bool,
        children: ChildrenProp,
    };

    static defaultProps = {
        headerPadding: true,
        descriptionPadding: true,
        transparent: false,
    };

    /**
     * Create our default state
     */
    constructor(props: Object) {
        super(props);
        this.state = {
            isCollapsed: this.props.collapsed || false,
        };
    }

    /**
     * @override
     */
    componentDidUpdate(prevProps: Object, prevState: Object) {
        const { collapsed } = this.props;
        if (isDefined(collapsed) && collapsed !== prevProps.collapsed) {
            this.setState({
                isCollapsed: collapsed,
            });
        }
    }

    /**
     * Toggle our dropdown content
     */
    toggleCollapse = (e: Object) => {
        e.preventDefault();
        const isCollapsed = !this.state.isCollapsed;
        this.setState({
            isCollapsed,
        }, () => {
            const { handleCollapsed } = this.props;
            if (handleCollapsed) {
                handleCollapsed(isCollapsed);
            }
        });
    };

    renderTitle = (title: any) => {
        return isObject(title) ? title : title && <Title>{title || []}</Title>;
    };

    /**
     * Render our card component
     */
    render() {
        const {
            headerPadding, image, icon, title, className, headerActions, meta,
            description, footer, collapsible, titleActions, children, descriptionPadding, headerColor, transparent,
        } = this.props;
        return (
            <CardStyle className={className} transparent={transparent}>
                {children}
                {title || titleActions || headerActions || collapsible ? (<CardHeader
                    headerColor={headerColor}
                    headerPadding={headerPadding}
                    isCollapsed={this.state.isCollapsed}
                >
                    {/*Why title || [] not title || '' ?? what is the advantage of using an empty array?*/}
                    {this.renderTitle(title)}
                    {/*Remove this line when radio buttons work in header actions*/}
                    {/* @David. Why do we create titleActions instead of headerActions
                                which already exist and is the same? Maybe I'm missing the purpose? */}
                    {titleActions && <span style={{ width: '100%', paddingRight: '9px' }}> {titleActions} </span>}
                    <HeaderActions headerPadding={headerPadding}>
                        {headerActions || []}
                        {collapsible && <ButtonIcon
                            icon={this.state.isCollapsed ? 'arrow-down' : 'arrow-up'}
                            size="sm"
                            onClick={this.toggleCollapse}
                        />}
                    </HeaderActions>
                </CardHeader>) : null}
                {image && <div><Image src={image} fluid/></div>}
                {icon && <div><Icon name={image}/></div>}
                <CollapsibleContainer isCollapsed={this.state.isCollapsed}>
                    <CardContent>
                        {meta && <CardMeta>{meta}</CardMeta>}
                        {description &&
                        <CardDescription descriptionPadding={descriptionPadding}>{description}</CardDescription>}
                    </CardContent>
                    {footer && <CardFooter>{footer}</CardFooter>}
                </CollapsibleContainer>
            </CardStyle>
        );
    }
}

export default Card;
