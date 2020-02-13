/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Typography, Grid } from '@mic3/platform-ui';

import FormGenerator from 'app/containers/Designer/Form/components/FormGenerator';

const StyledGrid = styled(Grid)`
    height: 100%;
`;

const FieldSettingsSidebar = ({ updateSettings, settingsDefinition, settingsValues }: Object) => {
    if (!settingsDefinition) {
        return (
            <StyledGrid container alignItems="center" justify="center">
                <Typography variant="title">Click on an element.</Typography>
            </StyledGrid>
        );
    }
    return (
        <StyledGrid>
            <FormGenerator onChange={updateSettings} components={settingsDefinition} data={settingsValues} />
        </StyledGrid>
    );
};

FieldSettingsSidebar.propTypes = {
    settingsDefinition: PropTypes.arrayOf(PropTypes.object),
    settingsValues: PropTypes.object,
    updateSettings: PropTypes.func.isRequired,
};

export default FieldSettingsSidebar;
