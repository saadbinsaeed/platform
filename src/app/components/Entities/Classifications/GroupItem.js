/* @flow */
import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import Card from 'app/components/molecules/Card/Card';
import FieldItem from './FieldItem';

/**
 * Single Classification Item component
 */
class GroupItem extends PureComponent<Object, Object> {
    static propTypes = {
        name: PropTypes.string,
        fields: PropTypes.array,

        canEdit: PropTypes.bool,

        searchText: PropTypes.string,
        filterAttrName: PropTypes.string,

        isCollapsed: PropTypes.bool,
        attributes: PropTypes.object,
        updateAttribute: PropTypes.func.isRequired,
    };

    static defaultProps = {
        name: 'Ungrouped',
        fields: [],
        canEdit: false,
        searchText: '',
        filterAttrName: '',
        isCollapsed: true,
        attributes: {},
    };

    static _getVisibleFields = memoize((fields, searchText, filterAttrName) => {
        if (!fields) {
            return [];
        }
        if (!searchText && !filterAttrName) {
            return fields;
        }
        const text = filterAttrName || searchText;
        return fields.filter(({ name }) => name.toLowerCase().includes(text));
    });

    static _buildFieldItems = memoize((visibleFields, attributes, updateAttribute, canEdit) =>
        visibleFields.map((field, index) => (
            <FieldItem
                {...field}
                key={index}
                attributes={attributes}
                updateAttribute={updateAttribute}
                disabled={!canEdit}
                canBeAppendTo={true}
            />
        ))
    );

    render() {
        const { name, fields } = this.props;
        const { canEdit, isCollapsed, attributes, updateAttribute } = this.props;
        const { searchText, filterAttrName } = this.props;
        const showEntireGroup = searchText && name.toLowerCase().includes(searchText);
        const visibleFields = showEntireGroup ? fields : GroupItem._getVisibleFields(fields, searchText, filterAttrName);
        const fieldItems = GroupItem._buildFieldItems(visibleFields, attributes, updateAttribute, canEdit);
        const collapsed = !((searchText || filterAttrName) && visibleFields.length) && isCollapsed;
        return (
            <Card
                collapsible
                collapsed={collapsed}
                headerColor="#384147"
                title={name || 'Ungrouped'}
                description={<Fragment> {fieldItems} </Fragment>}
            />
        );
    }

}

export default GroupItem;
