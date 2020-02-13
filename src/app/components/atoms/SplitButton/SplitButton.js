import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SplitButton as PrimeSplitButton } from 'primereact/components/splitbutton/SplitButton';

const SplitButtonCss = styled(PrimeSplitButton)`
  .ui-button {
    border-top-left-radius: 3px !important;
    border-bottom-left-radius: 3px !important; // Passing className doesn't pass the classes, so hard-override
  }
`;

const SplitButton = (props) => {
    const { label, icon, onClick, items, appendTo } = props;
    return (
        <SplitButtonCss
            label={label}
            icon={icon}
            onClick={onClick}
            model={items}
            appendTo={appendTo}
        />
    );
};

SplitButton.propTypes = {
    label: PropTypes.string,
    icon: PropTypes.string,
    onClick: PropTypes.func,
    items: PropTypes.array,
    appendTo: PropTypes.object,
};

export default SplitButton;
