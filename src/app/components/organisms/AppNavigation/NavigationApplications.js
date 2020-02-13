/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
// import { darken } from 'polished';
import { loadAppOrganisation } from 'store/actions/app/appActions';
import { ChildrenProp } from 'app/utils/propTypes/common';
import MyProfileAvatar from 'app/components/molecules/MyProfileAvatar/MyProfileAvatar';
import ScrollBarMin from 'app/utils/styles/ScrollMinStyle';
import NavApplicationIcon from './NavApplicationIcon';

// import { loadOrganisationImage } from 'store/actions/organisations';

const ApplicationNav = styled.div`
    ${ScrollBarMin};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background: ${({ theme }) => theme.navigation.apps.background};
    width: 3.5rem;
    overflow-x: hidden;
    overflow-y: auto;
`;

const ApplicationSection = styled.div`
    text-align: center;
    padding: .5rem 0 .5rem 0;
    &:first-of-type {
        padding-top: 0;
    }
    &:last-of-type {
        padding-bottom: .8rem;
    }
`;
/**
 * Application list for navigation
 */
class NavigationApplications extends PureComponent<Object> {
    static propTypes = {
        loadAppOrganisation: PropTypes.func.isRequired,
        organisationImage: PropTypes.string,
        children: ChildrenProp,
        isLeftOpen: PropTypes.bool,
        organisationName: PropTypes.string
    };

    /**
     * Load organisation image
     */
    componentDidMount() {
        this.props.loadAppOrganisation();
    }

    /**
     * Created the left navigation application list
     */
    render() {

        const { children, isLeftOpen, organisationImage, organisationName } = this.props;
        return (
            <ApplicationNav isLeftOpen={isLeftOpen}>
                <ApplicationSection>{children}</ApplicationSection>
                {/*<ApplicationSection>...</ApplicationSection>*/}
                <ApplicationSection>
                    <NavApplicationIcon key="environment" image={organisationImage || ''} name="process-call-conversation" type="af" title={organisationName || ''} />
                    <MyProfileAvatar />
                </ApplicationSection>
            </ApplicationNav>
        );
    }
}

const mapStateToProps: Object = state => ({
    organisationImage: state.app.organisation.image,
    organisationName: state.app.organisation.name,
});


export default connect(mapStateToProps, { loadAppOrganisation })(NavigationApplications);
