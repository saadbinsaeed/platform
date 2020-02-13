/* @flow */

import React from 'react';
import styled from 'styled-components';

import Label from 'app/components/molecules/Label/Label';
import { showToastr } from 'store/actions/app/appActions';
import KeyValuePairTable from 'app/containers/Classifications/AttributeDetailModal/KeyValuePairTable/KeyValuePairTable';

const OptionsPropContainerStyle = styled.div`
    padding: 5px;
`;

const OptionsProp = ({ label, name, required, icon, size, gridData, gridHeaders, ...restProps }: Object) => (
    <div>
        { label && <Label htmlFor={name} required={required} size={size}>{label}</Label> }
        <OptionsPropContainerStyle>
            <KeyValuePairTable
                showToastr={showToastr}
                name={name}
                gridData={gridData}
                gridHeaders={gridHeaders}
                {...restProps}
            />
        </OptionsPropContainerStyle>
    </div>
);

export default OptionsProp;
