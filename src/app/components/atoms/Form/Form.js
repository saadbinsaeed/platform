/* @flow */

// $FlowFixMe
import React, { memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ChildrenProp } from 'app/utils/propTypes/common';
import Loader from 'app/components/atoms/Loader/Loader';

const FormStyle = styled.form`
    position: relative;
    display: block;
`;

const Form = ({ children, loading, ...rest }: Object) => (
    <Fragment>
        {loading && <Loader absolute backdrop />}
        <FormStyle {...rest}>
            {children}
        </FormStyle>
    </Fragment>
);

Form.propTypes = {
    children: ChildrenProp,
    loading: PropTypes.bool
};

export default memo(Form);
