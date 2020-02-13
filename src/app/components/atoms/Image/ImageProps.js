import PropTypes from 'prop-types';
import { SizeProps } from 'app/utils/propTypes/common';

const ImageProps = {
    size: SizeProps,
    src: PropTypes.string,
    rounded: PropTypes.bool,
    fluid: PropTypes.bool,
    className: PropTypes.string,
    alt: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
};

export default ImageProps;
