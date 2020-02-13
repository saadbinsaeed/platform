import PropTypes from 'prop-types';
import { IconTypeProps, SizeProps } from 'app/utils/propTypes/common';

const IconProps = {
    name: PropTypes.string,
    size: SizeProps,
    type: IconTypeProps,
    color: PropTypes.string,
    className: PropTypes.string,
    shadow: PropTypes.bool,
    colorIndex: PropTypes.number
};

export default IconProps;
