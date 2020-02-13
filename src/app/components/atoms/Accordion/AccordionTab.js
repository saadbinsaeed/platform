/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import { AccordionTab } from 'primereact/components/accordion/Accordion';

const AccordionTabComponent = ({ children, ...props }: Object) => {
    return (
        <AccordionTab {...props}>
            {children}
        </AccordionTab>
    );
};

AccordionTabComponent.propTypes = {
    header: PropTypes.string,
};

export default AccordionTabComponent;
