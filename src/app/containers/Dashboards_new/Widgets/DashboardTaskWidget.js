/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoizeOne from 'memoize-one';

import Loader from 'app/components/atoms/Loader/Loader';
import ReactEcharts from 'echarts-for-react';
import Widget from 'app/components/atoms/Widget/Widget';

import theme from 'app/themes/theme.default';
import { generateColor } from 'app/utils/avatar/avatar';
import { graphql } from 'graphql/client';  
import { isEmpty } from 'app/utils/utils';
import { get } from 'app/utils/lo/lo';

import widgetTasksStatusQuery from 'graphql/dashboard/widgetTasksStatusQuery';
import widgetTasksDueDateQuery from 'graphql/dashboard/widgetTasksDueDateQuery';
import widgetTasksStartDateQuery from 'graphql/dashboard/widgetTasksStartDateQuery';
import widgetTasksByCommonFilterQuery from 'graphql/dashboard/widgetTasksByCommonFilterQuery';
import widgetTasksInvolvementQuery from 'graphql/dashboard/widgetTasksInvolvementQuery';
import widgetTasksByGroupQuery from 'graphql/dashboard/widgetTasksByGroupQuery';

import { saveComponentState } from 'store/actions/component/componentActions';
import DashboardBreadcrumbs from 'app/components/Dashboards_new/DashboardBreadcrumbs';
import DashboardTaskWidgetList from 'app/components/Dashboards_new/DashboardTaskWidgetList';
import { widgetGroups, widgetOptions } from 'app/config/dashboardWidgetConfig';

class DashboardTaskWidget extends PureComponent<Object, Object> {

    static propTypes = {
        preferences: PropTypes.object,
        widgetGroups: PropTypes.array
    };

    constructor(props) {
        super(props);
        const { onDashboardSettingsChange, widgetIndex } = this.props;
        const { breadcrumbs, selectedGroup } = this.setDefaultWidgetSettings(props.preferences, props.widgetGroups);
        this.state = {
            breadcrumbs: breadcrumbs,
            selectedGroup: selectedGroup,
            isLoading: true,
            data: null,
        };
        this.loadWidgetData(this.state); 
        onDashboardSettingsChange(this.state, widgetIndex);   
    }

    setDefaultWidgetSettings(preferences, groups) {
        let breadcrumbs = [];
        let selectedGroup = groups[0];
        if (isEmpty(preferences.dashboard)) return { breadcrumbs, selectedGroup };

        const prefBreadcrumbs = preferences.dashboard[this.props.widgetIndex].breadcrumbs;
        const prefSelectedGroup = preferences.dashboard[this.props.widgetIndex].selectedGroup;

        breadcrumbs = prefBreadcrumbs.map((breadcrumb) => {
            let updatedBreadcrumbs;
            for (const group of groups) {
                let newselectedGroup;
                let newSelectedOption;
                if (group.field === breadcrumb.field) {
                    newselectedGroup = group;
                    for(const option of group.options) {
                        if (option.name === breadcrumb.selectedOption.name) {
                            newSelectedOption = option;
                            break; 
                        };
                    };
                    if (breadcrumb.field !== 'assigneeId' && breadcrumb.field !== 'processDefinitionName') {
                        updatedBreadcrumbs = {...newselectedGroup, selectedOption: newSelectedOption};
                    } else {
                        updatedBreadcrumbs = {...newselectedGroup, selectedOption: breadcrumb.selectedOption};
                    }
                    break;
                };
            }
            return updatedBreadcrumbs;
        });
        
        selectedGroup = groups.find((g) => {
            return g.field === prefSelectedGroup.field;
        });

        return { breadcrumbs, selectedGroup };
    }

    loadWidgetData = memoizeOne(({breadcrumbs, selectedGroup}) => {
        const subFilters = !breadcrumbs ? [] : [].concat(...breadcrumbs.map(group => group.selectedOption.filter));
        let requestQueryParam;

        if (!isEmpty(selectedGroup.group)) {
            requestQueryParam = {
                filterBy: subFilters,
                groupBy: selectedGroup.group
            };
            this.fetchTasksCountGroupBy(requestQueryParam, widgetTasksByGroupQuery).then((tasks) => {
                this.setState({ data: tasks, isLoading: false });
            });
        } else {
            const field = !isEmpty(selectedGroup.field) ? selectedGroup.field : '';
            switch (field) {
                // dispatch request (count tasks by status)
                case 'status':
                    requestQueryParam = this.parseQueryParameter(selectedGroup, subFilters);
                    this.fetchTasksFilterBy(requestQueryParam, widgetTasksStatusQuery).then((tasks) => {
                        this.setState({ data: tasks, isLoading: false });
                    });
                    break;
                // dispatch request (count tasks by due date)
                case 'dueDate':
                    requestQueryParam = this.parseQueryParameter(selectedGroup, subFilters);
                    this.fetchTasksFilterBy(requestQueryParam, widgetTasksDueDateQuery).then((tasks) => {
                        this.setState({ data: tasks, isLoading: false });
                    });
                    break;
                // dispatch request (count tasks by bpmn variables start date)
                case 'bpmnVariablesStartDate':
                    requestQueryParam = this.parseQueryParameter(selectedGroup, subFilters);
                    this.fetchTasksFilterBy(requestQueryParam, widgetTasksStartDateQuery).then((tasks) => {
                        this.setState({ data: tasks, isLoading: false });
                    });
                    break;
                // dispatch request (count tasks by status last update, start date & end date)
                case 'taskStatusLastUpdate':
                case 'startDate':
                case 'endDate':
                    requestQueryParam = this.parseQueryParameter(selectedGroup, subFilters);
                    this.fetchTasksFilterBy(requestQueryParam, widgetTasksByCommonFilterQuery).then((tasks) => {
                        this.setState({ data: tasks, isLoading: false });
                    });
                    break;
                // dispatch request (count tasks by involvement)
                case 'involvement':
                    requestQueryParam = this.parseQueryParameter(selectedGroup, subFilters);
                    this.fetchTasksFilterBy(requestQueryParam, widgetTasksInvolvementQuery).then((tasks) => {
                        this.setState({ data: tasks, isLoading: false });
                    });
                    break;
            
                default:
                    break;
            }
        }
    })

    // parse query filter parameter
    parseQueryParameter = (selectedGroup, subFilters) => {
        const requestQuery = {};
        if (!isEmpty(selectedGroup.options)) {
            for (const option of selectedGroup.options) {
                const property = option.label;
                requestQuery[property] = (!isEmpty(subFilters) && !isEmpty(option.filter)) ? [...subFilters, ...option.filter] : option.filter;
            }
        }
        return requestQuery;
    }

    parseTasksData = memoizeOne((data) => {
        if (!isEmpty(data.message)) {
            throw new Error(`${data.message}, contact support.`);
        }
        const { selectedGroup } = this.state;
        const selectedGroupOptions = [];
        const seriesData = [];
        let totalCount = 0;
        if (data) {
            // data handling if request returns an array
            if (Array.isArray(data)) {
                // data handling if widget selected group is equal to priority
                if (selectedGroup.field === 'priority') {
                    const priorityData = this.parsePriorityData(data);
                    for (const priority of priorityData) {
                        const option = selectedGroup.options && selectedGroup.options.find(option => option.value === priority.priority);
                        totalCount = totalCount + priority.count;
                        selectedGroupOptions.push({
                            ...option, 
                            count: priority.count,
                            filter: [ { field: 'priority', op: '=', value: priority.priority } ] 
                        });
                        seriesData.push({
                            name: option.name,
                            value: priority.count,
                            itemStyle: option && option.itemStyle ? option.itemStyle : {
                                color: generateColor(Object.values(theme.statusColors), option.name)
                            }
                        });
                    }
                } else {
                    // handles data result by assignee and processDefinitionName
                    for (const result of data) {
                        let name = '';
                        let option;
                        const value = Number(result.count);
                        totalCount = totalCount + value;
                        if (result.hasOwnProperty('name')) {
                            name = !isEmpty(result.name) ? result.name : 'Unassigned';
                            option = {
                                value: { id: result.id, name: result.name, login: result.login },
                                count: value,
                                filter: [{ field: 'assignee.id', op: '=', value: result.id }]
                            };
                        } else {
                            name = !isEmpty(result.processDefinitionName) ? result.processDefinitionName : 'Process Type N/A';
                            option = {
                                value: result.processDefinitionName,
                                count: value,
                                filter: [{ field: 'process.processDefinition.name', op: '=', value: result.processDefinitionName }]
                            };
                        }
                        const seriesOption = {
                            name,
                            value,
                            itemStyle: {
                                color: generateColor(Object.values(theme.statusColors), name)
                            }
                        };
                        selectedGroupOptions.push({...seriesOption, ...option});
                        seriesData.push(seriesOption);
                    }
                }
            } else {
                // data handling if request returns an object
                for (const key in data) {
                    const option = selectedGroup.options && selectedGroup.options.find(option => option.label === key);
                    const value = Number(data[key]);
                    totalCount = totalCount + value;
                    if (!isEmpty(option)) {
                        selectedGroupOptions.push({...option, count: value});
                        seriesData.push({
                            name: option.name,
                            value,
                            itemStyle: option && option.itemStyle ? option.itemStyle : {
                                color: generateColor(Object.values(theme.statusColors), key)
                            }
                        });
                    }
                }
            }
        }
        return { seriesData, totalCount, selectedGroupOptions };
    })

    parsePriorityData = (data) => {
        const priorityRange = [1, 2, 3, 4, 5];
        const priorityData = [];
        let notInRangeCount = 0;
        for (const item of data) {
            if (!priorityRange.includes(item.priority)) {
                notInRangeCount = notInRangeCount + Number(item.count);
            } else {
                const updatedItem = {...item, count: Number(item.count)};
                priorityData.push(updatedItem);
            }
        }
        const index = priorityData.findIndex(i => i.priority === 3);
        priorityData[index].count = priorityData[index].count + notInRangeCount;
        return priorityData;
    }

    buildWidget = memoizeOne((widgetOptions, seriesData, totalCount) => {
        const widgetSettings = {...widgetOptions};
        widgetSettings.title.text = totalCount;
        widgetSettings.series[0].data = seriesData;
        return widgetSettings;
    })

    // update breadcrumbs and selectedGroup state base on widget option select 
    onWidgetOptionSelect = (option) => {
        if (!option) {
            throw new Error(`${option} selection doesn't exists`);
        }
        const { widgetGroups } = this.props;
        const { breadcrumbs, selectedGroup } = this.state;
        const newBreadcrumbs = [
            ...breadcrumbs, {
                ...selectedGroup,
                selectedOption: option
            }
        ];
        const breadcrumbsGroupsNames = newBreadcrumbs.map(g => g.name);
        this.setState({
            breadcrumbs: newBreadcrumbs,
            selectedGroup: widgetGroups.filter(g => !breadcrumbsGroupsNames.includes(g.name))[0], // TODO: handle when filter removes all groups
        });
    }

    getPrevSelectedGroup = () => {
        const { breadcrumbs } = this.state;
        const breadcrumbsCopy = [...breadcrumbs];
        const selectedGroup = breadcrumbsCopy.length ? breadcrumbsCopy[breadcrumbsCopy.length - 1] : this.props.widgetGroups[0];
        breadcrumbsCopy.pop();
        this.setState({
            breadcrumbs: [...breadcrumbsCopy],
            selectedGroup
        });
    }

    // get available groups base on selected option filter
    getGroupsSequence = memoizeOne((groups, breadcrumbs) => {
        if (!isEmpty(breadcrumbs)) {
            const breadcrumbsCopy = [...breadcrumbs];
            let groupsCopy = [...groups];
            const firstBc = breadcrumbsCopy.shift();
            const nextBc = breadcrumbsCopy;
            groupsCopy = groupsCopy.filter(group => group.name !== firstBc.name);
            return this.getGroupsSequence(groupsCopy, nextBc);
        }
        return groups;
    })

    onWidgetGroupChange = memoizeOne((group) => {
        this.setState({ selectedGroup: group });
    })

    fetchTasksCountGroupBy = (queryParam, gqlQ) => {
        return graphql.query({
            query: gqlQ,
            variables: queryParam,
            fetchPolicy: 'no-cache',
        }).then((response) => {
            const tasks = get(response, 'data.result');
            return tasks || { message: 'Data not available' };
        });
    }

    fetchTasksFilterBy = (queryParam, gqlQ) => {
        return graphql.query({
            query: gqlQ,
            variables: queryParam,
            fetchPolicy: 'no-cache',
        }).then((response) => {
            const tasks = get(response, 'data');
            return tasks || { message: 'Data not available' };
        });
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { toggleReset, widgetIndex, widgetGroups } = this.props;
        const { breadcrumbs, selectedGroup, isLoading } = this.state;

        if (!isLoading) {
            if (prevProps.toggleReset !== toggleReset) {
                this.setState({
                    breadcrumbs: [],
                    selectedGroup: widgetGroups[0]
                });
            }

            if (prevState.breadcrumbs !== breadcrumbs || prevState.selectedGroup !== selectedGroup) {
                this.setState({ isLoading: true });
                this.loadWidgetData(this.state);
                this.props.onDashboardSettingsChange(this.state, widgetIndex);
            }
        }
    }

    render() {
        const { widgetGroups, widgetOptions, saveComponentState } = this.props;
        const { breadcrumbs, selectedGroup, data, isLoading } = this.state; // should be set on componentDidUpdate or onOptionSelect
        if (isLoading) {
            return <Loader />;
        }
        const { seriesData, totalCount, selectedGroupOptions } = this.parseTasksData(data);
        const availableGroups = this.getGroupsSequence(widgetGroups, breadcrumbs);

        return (
            <Widget title={'Tasks'} >
                {<ReactEcharts
                    option={this.buildWidget(widgetOptions, seriesData, totalCount)}
                    theme={'dark'}
                />}
                {<DashboardBreadcrumbs data={breadcrumbs} />}
                {<DashboardTaskWidgetList
                    breadcrumbs={breadcrumbs}
                    selectedGroup={selectedGroup}
                    availableGroups={availableGroups}
                    saveComponentState={saveComponentState}
                    selectedGroupOptions={selectedGroupOptions}
                    onWidgetGroupChange={this.onWidgetGroupChange}
                    onWidgetOptionSelect={this.onWidgetOptionSelect}
                    getPrevSelectedGroup={this.getPrevSelectedGroup}
                />}
            </Widget>
        );
    }

}

const mapStateToProps: Function = (state) => {
    return {
        preferences: state.user.preferences,
        widgetGroups,
        widgetOptions
    };
};

export default connect(mapStateToProps, { saveComponentState })(DashboardTaskWidget);
