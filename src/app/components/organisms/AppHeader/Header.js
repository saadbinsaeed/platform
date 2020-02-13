/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { isIframe } from 'app/utils/env';
import { toggleChat, toggleNav, toggleNotifications } from 'store/actions/app/appActions';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import Title from 'app/components/atoms/Title/Title';
import PopupMenu from 'app/components/molecules/PopupMenu/PopupMenu';
import MenuItem from 'app/components/molecules/Menu/MenuItem';
import Icon from 'app/components/atoms/Icon/Icon';
import HeaderSummary from 'app/components/molecules/header-summary/header-summary';
import HeaderSummaryItem from 'app/components/molecules/header-summary/header-summary-item';
import Label from 'app/components/molecules/Label/Label';
import Text from 'app/components/atoms/Text/Text';
import Pill from 'app/components/atoms/Pill/Pill';
import { get } from 'app/utils/lo/lo';

const HeaderStyle = styled.header`
  display: block;
  grid-area: header;
  width: 100%;
  max-width: 100%;
  z-index: 100;
  height: ${( { height, theme } ) => theme && height ? height : theme.header.height };
  .inner {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      position: relative;
      max-width: 100%;
      color: ${( { textColor, theme } ) => theme && textColor ? theme.color[ textColor ] : theme.header.textColor };
      font-size: inherit;
      min-height: ${( { height, theme } ) => theme && height ? height : theme.header.height };
      padding: 0 .8rem;
      background: ${( { color, theme } ) => color || theme.header.background };
      z-index: 5;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  flex-direction: column;
  align-items: left;
  white-space: nowrap;
  position: relative;
  cursor: ${ props => (props.headerInfo || []).length ? 'pointer' : 'auto' };
  text-overflow: ellipsis;
  overflow: hidden;
`;

const HeaderTitle = styled(Title)`
    white-space: nowrap;
    overflow: hidden;
`;
// Make arrow bigger
const HeaderSubTitle = styled(Title)`
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    color: rgba(255,255,255,0.75);
    font-size: .7rem;
    font-weight: 300;
`;

const HeaderInfoArrow = styled(Icon)`
    position: absolute;
    bottom: -11px;
    display: none;
    &::before {
      color: ${( { theme } ) => theme.header.textColor };
      z-index: 10;
    }
`;


const HeaderColumn = styled.div`
    white-space: nowrap;
    ${({menu}) => menu? 'padding-right: 1rem' : ''}
`;

const HeaderButtonIcon = styled(ButtonIcon)`
    & .Icon:before {
        color: white;
    }
`;

const HeaderInfoPanel = styled.div`
  position: absolute;
  left: 0; right: 0; top: 60px;
  background: ${({ theme }) => theme.base.background};
  ${({ active }) => active ? 'display: block' : 'display: none'};
  box-shadow: ${({ theme }) => theme.shadow.z2};
`;

const AddMenu = (props: Object) => {
    const { isAdmin, permissions } = props.profile;
    const permissionsSet = new Set(permissions || []);
    return (
        <div>
            { <MenuItem name="My Apps" to="/abox/processes-new" /> }
            { (isAdmin || permissionsSet.has('admin.group.add')) && <MenuItem name="Add a group" to="/groups/add" isModal />}
            { (isAdmin || permissionsSet.has('entity.person.add')) && <MenuItem name="Add a person" to="/people/add" isModal />}
            { (isAdmin || permissionsSet.has('entity.thing.add')) && <MenuItem name="Add a thing" to="/things/add" isModal />}
            { (isAdmin || permissionsSet.has('entity.organisation.add')) && <MenuItem name="Add an organisation" to="/organisations/add" isModal />}
            { (isAdmin || permissionsSet.has('entity.custom.add')) && <MenuItem name="Add a custom entity" to="/custom-entities/add" isModal />}
            { (isAdmin || permissionsSet.has('admin.user.add')) && <MenuItem name="Add a user" to="/user-management/add" isModal />}
            { (isAdmin || permissionsSet.has('entity.classification.add')) && <MenuItem name="Add a classification" to="/classifications/add" isModal />}
            { (isAdmin || permissionsSet.has('broadcast.add')) && <MenuItem name="Add a broadcast" to="/broadcasts/add" isModal />}
        </div>
    );
};

/**
 * The main application header
 */
class AppHeader extends PureComponent<Object, Object> {
    static propTypes = {
        app: PropTypes.object,
        title: PropTypes.string,
        subTitle: PropTypes.string,
        headerInfo: PropTypes.object,
        toggleNav: PropTypes.func,
        // toggleChat: PropTypes.func,
        // toggleNotifications: PropTypes.func,
        profile: PropTypes.object.isRequired,
    };

    /**
     * Set our default state
     */
    constructor(props) {
        super(props);
        this.state = { showInfo: false };
    }

    /**
     *
     */
    componentDidUpdate(prevProps){
        const { subTitle } = this.props.app.headers;
        const prevsSubTitle = prevProps.app.headers.subTitle;
        if (prevsSubTitle !== subTitle && this.state.showInfo){
            this.setState({ showInfo: false });
        }
    }

    /**
     * Show/Hide the summary panel
     */
    toggleInfo = () => {
        this.setState({ showInfo: !this.state.showInfo });
    };

    /**
     * Render our page template
     */
    render() {
        // console.log('header', this.props.app || {});
        const { title, subTitle, headerInfo, pillText, actions, menuItems, color } = this.props.app.headers;
        const summaryItems = headerInfo ? headerInfo.map(item =>
            <HeaderSummaryItem key={item.key}>
                <Label>{item.key}</Label>
                <Text>{item.value}</Text>
            </HeaderSummaryItem>
        ) : null;

        return (
            <HeaderStyle color={get(color, 'background')}>
                <div className="inner">
                    <HeaderColumn menu>
                        { !isIframe && <HeaderButtonIcon icon="menu" iconColor="white" onClick={this.props.toggleNav} /> }
                    </HeaderColumn>
                    <TitleContainer onClick={this.toggleInfo} headerInfo={headerInfo}>
                        { title && title ? <HeaderTitle as="h1">{title}</HeaderTitle> : <Icon type="af" name="logo" size="lg" /> }
                        { (subTitle || pillText) && <HeaderSubTitle as="h2">{ pillText && <Pill textColor="secondary" backgroundColor="white" style={{ marginRight: '5px' }}>{pillText}</Pill> } {subTitle}</HeaderSubTitle> }
                        { (headerInfo || []).length > 0 && <HeaderInfoArrow name="arrow-down-bold" size="xs" /> }
                    </TitleContainer>
                    <HeaderColumn>
                        { actions }
                        <PopupMenu inline right content={<AddMenu profile={this.props.profile} />}>
                            <HeaderButtonIcon icon="plus" iconColor="white" />
                        </PopupMenu>
                        {
                            menuItems &&
                            <PopupMenu inline right content={menuItems}>
                                <HeaderButtonIcon icon="dots-vertical" iconColor="white" />
                            </PopupMenu>
                        }
                        {/*<HeaderButtonIcon icon="bell" iconColor="white" onClick={this.props.toggleNotifications} />*/}
                    </HeaderColumn>
                </div>
                {(headerInfo || []).length > 0 &&
                    <HeaderInfoPanel active={this.state.showInfo}>
                        <HeaderSummary>
                            {summaryItems}
                        </HeaderSummary>
                    </HeaderInfoPanel>
                }
            </HeaderStyle>
        );
    }
}

const mapStateToProps = state => ({
    app: state.app,
    profile: state.user.profile,
});

const mapDispatchToProps = (dispatch: Object) => ({
    toggleNav: bindActionCreators(toggleNav, dispatch),
    toggleChat: bindActionCreators(toggleChat, dispatch),
    toggleNotifications: bindActionCreators(toggleNotifications, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);
