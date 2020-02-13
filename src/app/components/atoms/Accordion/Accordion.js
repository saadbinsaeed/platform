/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from 'primereact/components/accordion/Accordion';


const AccordionComponent = ({ children, ...props }: Object) => {
    return (
        <Accordion {...props}>
            {children}
        </Accordion>
    );
};

AccordionComponent.propTypes = {
    multiple: PropTypes.bool,
};

export default AccordionComponent;
