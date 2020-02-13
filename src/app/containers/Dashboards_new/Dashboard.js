/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-styled-flexboxgrid';
import { set } from 'app/utils/immutable/Immutable';

import PageTemplate from 'app/components/templates/PageTemplate';
import ErrorBoundary from 'app/components/atoms/ErrorBoundary/ErrorBoundary';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import styled from 'styled-components';
import ToolBar from 'app/components/molecules/ToolBar/ToolBar';
import { IconButton, MdiIcon, Tooltip } from '@mic3/platform-ui';

import DashboardTaskWidget from 'app/containers/Dashboards_new/Widgets/DashboardTaskWidget';
import { saveUserPreferences } from 'store/actions/admin/usersActions';
import { widgetGroups } from 'app/config/dashboardWidgetConfig';

const CustomToolBar = styled(ToolBar)`
   [class*="ToolBar__ColRight"] {
       &:before {
           display: none;
       }
   }
`;

const IconWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

/**
 * Renders the view to display the classification.
 */
class Dashboard extends PureComponent<Object, Object,> {
    static propTypes = {
        preferences: PropTypes.object,
        widgetGroups: PropTypes.array,
        saveUserPreferences: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = { dashboard: [], isReset: false };
    }

    onDashboardSettingsChange = ({breadcrumbs, selectedGroup}, index) => {
        const setting = { breadcrumbs, selectedGroup };
        this.setState(state => ({
            dashboard: set(state.dashboard, `[${index}]`, setting)
        }));
    }

    saveDashboardPreference = (isReset) => {
        const { preferences, widgetGroups, saveUserPreferences } = this.props;
        const defaultPreference = [
            { selectedGroup: widgetGroups[0], breadcrumbs: [] },
            { selectedGroup: widgetGroups[0], breadcrumbs: [] },
            { selectedGroup: widgetGroups[0], breadcrumbs: [] }
        ];
        const userPreferences = {
            ...preferences, 
            dashboard: isReset ? defaultPreference : this.state.dashboard
        };
        saveUserPreferences(userPreferences);
    }

    onClickReset = () => {
        this.setState(state => ({
            isReset: !state.isReset
        }));
        this.saveDashboardPreference(true);
    }

    render() {
        return (
            <PageTemplate title="Dashboard (BETA)">
                <CustomToolBar 
                    rightSide={
                        <IconWrapper>
                            <Tooltip title="Save">
                                <IconButton onClick={()=> this.saveDashboardPreference(false)}>
                                    <MdiIcon name="content-save" color="inherit" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Restore">
                                <IconButton onClick={this.onClickReset}>
                                    <MdiIcon name="restore" color="inherit" />
                                </IconButton>
                            </Tooltip>
                        </IconWrapper>
                    }
                />
                <ContentArea>
                    <Grid fluid style={{ paddingTop: '1.5rem' }}>
                        <Row>
                            <Col xs={12} md={6} lg={3}>
                                <ErrorBoundary>
                                    <DashboardTaskWidget
                                        toggleReset={this.state.isReset}
                                        widgetIndex={0}
                                        onDashboardSettingsChange={this.onDashboardSettingsChange}
                                    />
                                </ErrorBoundary>
                            </Col>
                            <Col xs={12} md={6} lg={3}>
                                <ErrorBoundary>
                                    <DashboardTaskWidget
                                        toggleReset={this.state.isReset}
                                        widgetIndex={1}
                                        onDashboardSettingsChange={this.onDashboardSettingsChange}
                                    />
                                </ErrorBoundary>
                            </Col>
                            <Col xs={12} md={6} lg={3}>
                                <ErrorBoundary>
                                    <DashboardTaskWidget
                                        toggleReset={this.state.isReset}
                                        widgetIndex={2}
                                        onDashboardSettingsChange={this.onDashboardSettingsChange}
                                    />
                                </ErrorBoundary>
                            </Col>
                        </Row>
                    </Grid>
                </ContentArea>
            </PageTemplate>
        );
    }
}

const mapStateToProps: Function = (state) => {
    return {
        preferences: state.user.preferences,
        widgetGroups,
    };
};

export default connect(mapStateToProps, { saveUserPreferences })(Dashboard);