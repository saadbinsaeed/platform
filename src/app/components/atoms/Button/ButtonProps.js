import PropTypes from 'prop-types';
import { ChildrenProp, IconTypeProps, SizeProps } from 'app/utils/propTypes/common';

const ButtonProps = {
    text: PropTypes.string,
    color: PropTypes.string,
    icon: PropTypes.string,
    iconType: IconTypeProps,
    iconSize: SizeProps,
    loading: PropTypes.bool,
    iconColor: PropTypes.string,
    fluid: PropTypes.bool,
    children: ChildrenProp,
    rounded: PropTypes.bool,
    onClick: PropTypes.func,
    noShadow: PropTypes.bool
};

export default ButtonProps;
