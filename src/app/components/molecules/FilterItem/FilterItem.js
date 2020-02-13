// @flow
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Drawer from 'app/components/atoms/Drawer/Drawer';

const FilterItemStyle = styled.div`
  display: block;
  padding: .8rem .4rem;
  border-bottom: solid 1px #333;
  cursor: pointer;
`;

/**
 * Component to show a filterable item with selectable options
 */
class FilterItem extends PureComponent<Object, Object> {

    static propTypes = {
        name: PropTypes.string,
        value: PropTypes.any,
        children: PropTypes.any
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

    render() {
        const { name, value, children } = this.props;
        return (
            <FilterItemStyle onClick={this.openFilters}>
                <strong>{name}</strong>
                <div>{value}</div>
                <Drawer title={`${name} filters`} isOpen={this.state.isOpen} isToggled={this.toggleFilters}>
                    <div>
                        { children }
                    </div>
                </Drawer>
            </FilterItemStyle>
        );
    };
}

export default FilterItem;
