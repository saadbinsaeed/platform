/* @flow */
import PropTypes from 'prop-types';
import { PlacementProps } from 'app/utils/propTypes/common';

const PopoverContainerProps = {
    width: PropTypes.string,
    isOpen: PropTypes.bool,
    placement: PlacementProps,
};

export default PopoverContainerProps;
