// @flow
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import Title from 'app/components/atoms/Title/Title';
import Drawer from 'app/components/atoms/Drawer/Drawer';
import Flex from 'app/components/atoms/Flex/Flex';
import Icon from 'app/components/atoms/Icon/Icon';
import { get } from 'app/utils/lo/lo';
import { isEmpty } from 'app/utils/utils';
import { formatDate, DATETIME_DISPLAY_FORMAT } from 'app/utils/date/date';

const FilterItemStyle = styled.div`
  display: block;
  padding: .8rem .4rem;
  border-bottom: solid 1px #333;
  cursor: pointer;
`;

const generateGroupValuesText = (options: Array<Object>, value: any, type: string) => {
    const hasValue = Array.isArray(value) ? !isEmpty(value) : !!value;
    if (hasValue) {
        switch (type) {
            case 'text':
            case 'number':
                return String(value);
            case 'person':
                return get(value, 'name') || get(value, 'id');
            case 'user':
                return get(value, 'name') || get(value, 'id');
            case 'select':
            case 'conditionValue':
                const labels = (options || []).filter(el => el.value === value);
                return get(labels[0], 'label', value);
            case 'date': {
                if (Array.isArray(value)) {
                    const from = formatDate(value[0], DATETIME_DISPLAY_FORMAT);
                    if (!value[1]) {
                        return from;
                    }
                    const to = formatDate(value[1], DATETIME_DISPLAY_FORMAT);
                    return `${from} - ${to}`;
                } else {
                    return formatDate(value, DATETIME_DISPLAY_FORMAT);
                }
            }
            default: return 'Not a valid type';
        }
    } else {
        return 'Any';
    }

};

/**
 * Component to show a filterable item with selectable options
 */
class FilterItemGroup extends PureComponent<Object, Object> {

    static propTypes = {
        name: PropTypes.string,
        options: PropTypes.array,
        value: PropTypes.any,
        children: PropTypes.any,
    };

    constructor(props: Object) {
        super(props);
        this.state = { isOpen: false };
    }

    toggleFilters = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    openFilters = () => {
        !this.state.isOpen && this.setState({ isOpen: true });
    };

    onClick = (e: Object) => {
        e.stopPropagation();
        const { definition: { field }, onChange }= this.props;
        onChange({
            originalEvent: e,
            name: `${field}.value`,
            value: null,
        });
    }

    render() {
        const { value, children, definition } = this.props;
        const { label, type, options } = definition;
        return (
            <FilterItemStyle onClick={this.openFilters}>
                <b>{label}</b>
                <Flex spaceBetween>
                    <div>{generateGroupValuesText(options, value, type)}</div>
                    <Icon name="close-circle" size="md" onClick={this.onClick} />
                </Flex>
                <Drawer title={`${label} filters`} isOpen={this.state.isOpen} isToggled={this.toggleFilters}>
                    <div>
                        { children }
                    </div>
                </Drawer>
            </FilterItemStyle>
        );
    };
}

export default FilterItemGroup;
