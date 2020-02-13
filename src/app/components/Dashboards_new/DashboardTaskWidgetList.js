import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Col, Row } from 'react-styled-flexboxgrid';
import history from 'store/History';

import { get } from 'app/utils/lo/lo';
import { isEmpty } from 'app/utils/utils';

import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import Dropdown from 'app/components/atoms/Dropdown/Dropdown';
import InputWrapper from 'app/components/atoms/InputWrapper/InputWrapper';
import Link from 'app/components/atoms/Link/Link';

const Circle = styled.span`
    display: block;
    margin: 0 auto;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ backgroundColor }) => backgroundColor };
`;

const StyledDropdow = styled(Dropdown)`
    &.ui-state-default, .ui-state-default, .ui-inputtext {
        border: none;
        background: transparent;
        color: rgba(255, 255, 255, 0.6);
        transition: color 0.5s;
        &:hover {
            background: transparent !important;
        }
    }
    &:hover {
        &, .ui-state-default, .ui-inputtext {
            border: none !important;
            color: #fff !important;
        }
    }
    .ui-dropdown-label {
        line-height: 40px;
        min-height: 48px;
    }
    .ui-inputtext {
        font-weight: 500 !important;
        font-size: 16px;
    }
`;

const StyledDiv = styled.div`
    padding: 0 0.5rem;
    max-height: 240px;
    overflow-y: auto;
`;

const StyledRow = styled(Row)`
    padding: 10px 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.24);
    border-bottom: 1px solid transparent;
    font-size: 14px;
`;

const StyledLink = styled(Link)`
    color: #4BB9D9 !important;
`;

const StyledDropDownCol = styled(Col)`
    ${InputWrapper} {
        padding: 0;
    }
`;

const StyledButtonIcon = styled(ButtonIcon)`
    opacity: 0.6;
    padding: 0;
    width: 100%;
    height: 100%;
    display: block;
    transition: opacity 0.5s;
    &:hover {
        opacity: 1;
    }
`;

const NavigationRow = styled(Row)`
    padding: 0 1.1rem;
`;

class DashboardTaskWidgetList extends PureComponent<Object, Object> {

    static propTypes = {
        selectedGroup: PropTypes.object,
        breadcrumbs: PropTypes.array,
        availableGroups: PropTypes.array,
        selectedGroupOptions: PropTypes.array,
        saveComponentState: PropTypes.func,
        onWidgetGroupChange: PropTypes.func,
        onWidgetOptionSelect: PropTypes.func,
        getPrevSelectedGroup: PropTypes.func,
    }    

    onOptionLinkClick = (option, event) => {
        event.preventDefault();
        const { breadcrumbs, selectedGroup } = this.props;
        const subFilters = isEmpty(breadcrumbs) ? [] : breadcrumbs.map((breadcrumb) => {
            return { [breadcrumb.field]: breadcrumb.selectedOption.value };
        });
        const mainFilter = { [selectedGroup.field]: option.value };
        const filters = isEmpty(subFilters) ? mainFilter : Object.assign(...subFilters, mainFilter);
        this.props.saveComponentState('TaskListFilters',  { filters });
        history.push('/abox/tasks');
    };


    onWidgetGroupChange = (event) => {
        const { value } = event.target;
        const group = this.props.availableGroups.find(g => g.name === value);
        if (group) {
            this.props.onWidgetGroupChange(group);
        }
    }

    widgetGroupOptions = (groups) => {
        return groups.map(group => ({ label: group.name, value: group.name }));
    }

    widgetOptionList = () => {
        const { selectedGroupOptions, onWidgetOptionSelect } = this.props;

        return (selectedGroupOptions.map((option, idx) => {
            return (
                <StyledRow middle="xs" key={idx}>
                    <Col xs={1}>
                        <Circle
                            backgroundColor={get(option, 'itemStyle.color')}
                        />
                    </Col>
                    <Col xs={8} lg={7}>
                        {option.name}
                    </Col>
                    <Col xs={2} lg={3}>
                        <StyledLink to={'/abox/tasks'} onClick={(e) => { this.onOptionLinkClick(option, e); }}>{option.count}</StyledLink>
                    </Col>
                    <Col xs={1}>
                        {option.count > 1 && <StyledButtonIcon icon="chevron-right"  onClick={() => onWidgetOptionSelect(option)} />}
                    </Col>
                </StyledRow>
            );
        }));
    }

    render() {
        const { selectedGroup, availableGroups, breadcrumbs, getPrevSelectedGroup } = this.props; 

        return (
            <Fragment>
                <NavigationRow middle="xs">
                    <Col xs={1}>
                        { breadcrumbs.length > 0 && <StyledButtonIcon icon="chevron-left"  onClick={() => getPrevSelectedGroup()} /> }
                    </Col>
                    <StyledDropDownCol xs={10}>
                        <StyledDropdow
                            key={'name'}
                            value={selectedGroup.name}
                            onChange={e => this.onWidgetGroupChange(e)}
                            options={this.widgetGroupOptions(availableGroups)}
                        />
                    </StyledDropDownCol>
                </NavigationRow>
                <StyledDiv>
                    {this.widgetOptionList()}
                </StyledDiv>
            </Fragment>
        );
    }
}

export default DashboardTaskWidgetList;
