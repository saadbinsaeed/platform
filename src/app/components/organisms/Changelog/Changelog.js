/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Container from 'app/components/atoms/Container/Container';
import VirtualListManaged from 'app/components/molecules/VirtualList/VirtualListManaged';
import ResizableListItem from 'app/components/molecules/VirtualList/ResizableListItem';
import Filters from 'app/components/organisms/Filters/Filters';
import ChangelogItem from 'app/components/organisms/Changelog/ChangelogItem';
import Layout from 'app/components/molecules/Layout/Layout';
import { isEmpty, isObject } from 'app/utils/utils';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';
import { get } from 'app/utils/lo/lo';

/**
 * Renders the given changelog.
 */
class Changelog extends PureComponent<Object, Object> {

    static propTypes = {
        entityType: PropTypes.string.isRequired,
        loadData: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        startIndex: PropTypes.number.isRequired,
        changelog: PropTypes.arrayOf(PropTypes.object),
        count: PropTypes.number,
    };
    listRef = React.createRef();

    static translations = {
        'attachments': 'attachment',
        'attributes': 'attribute',
        'bpmnVariable': 'variable',
        'classes': 'classification',
        'classificationUris': 'classification uri',
        'group.classificationUris': 'classification uri',
        'comments': 'comment',
        'contactInfo': 'contact info',
        'dateOfBirth': 'birthday',
        'dueDate': 'due date',
        'enableGis': 'show on situational awareness',
        'endDate': 'end date',
        'fullName': 'full name',
        'iconColor': 'icon color',
        'iconName': 'icon',
        'parentId': 'parent',
        'organisationId': 'organisation',
        'relations': 'relation',
        'teamMembers': 'team member',
        'thingId': 'unique external reference',
        'entities.permissions': 'permissions',
        'proc_def': 'process definition',
        'custom': 'custom entity',
        'group.users': 'users',
        'modifiedByLogin': 'modified by',
        'dataOwnerLogin': 'data owner',
        'contactPersonId': 'contact person',
        'is_manual': 'custom address',

        'bpmnVariable.startDate': 'start date',
        'locationInfo.address.city': 'city',
        'locationInfo.address.code': 'post/zip code',
        'locationInfo.address.country': 'country',
        'locationInfo.address.line1': 'address line 1',
        'locationInfo.address.line2': 'addresss line 2',
        'locationInfo.address.province': 'state/province',
        'locationInfo.latitude': 'latitude',
        'locationInfo.longitude': 'longitude',
        'locationInfo.name': 'location name',
        'variable.completion': 'progress',
    };

    filterDefinitions = [
        { field: 'changes', type: 'text', properties: { label: 'Filter', name: 'changes' }, sort: false, filters: false },
    ];
    searchBar = ['changes'];
    defaultOrder = [{ field: 'modifiedDate', direction: 'desc' }];

    @bind
    getTranslation(key: string) {
        if (this.props.translations) {
            return this.props.translations[key] || Changelog.translations[key];
        }
        return Changelog.translations[key];
    }

    @bind
    translate(path: Array<string>) {
        const translated = this.getTranslation(path.join('.'));
        if (translated) {
            return translated;
        }
        return path.map(token => this.getTranslation(token) || token).join(' ');
    };

    @bind
    renderComponent({ index, data, resize, style }: Object) {
        return (
            <Container key={data.id} width="1024" noPadding>
                <ResizableListItem style={style} index={index} resize={resize} padding={8}>
                    {resizeRow =>
                        <ChangelogItem
                            entityType={this.props.entityType}
                            logEntry={data}
                            translate={this.translate}
                            resizeRow={resizeRow}
                            updateHeight={this.listRef.current && this.listRef.current.updateHeight}
                        />
                    }
                </ResizableListItem>
            </Container>
        );
    }

    @bind
    loadRecords(options: Object) {
        const filterByChanges = options.filterBy && options.filterBy[0] && {
            ...options.filterBy[0],
            value: options.filterBy[0].value && options.filterBy[0].value.trim(),
            cast: 'text',
        };
        const filterBy = filterByChanges && filterByChanges.value
            ? [filterByChanges]
            : [];
        return this.props.loadData({ ...options, filterBy });
    };

    @bind
    @memoize()
    normalizeChangelog(changelog) {
        return (changelog || []).map((change) => {
            const changes = change.changes.filter(({ path }) => !['modifiedDate', 'parentIds'].includes(path[0]));
            const nextChanges = [];
            changes.forEach((ch) => {
                if (get(ch, 'path[0]') === 'attributes' && isObject(get(ch, 'rhs'))) {
                    const rhs = get(ch, 'rhs') || {};
                    nextChanges.push(...Object.keys(rhs).map(key => ({
                        path: ['attributes', key],
                        rhs: rhs[key],
                        kind: 'E'
                    })));
                } else if (get(ch, 'path[1]') === 'attributes' && isObject(get(ch, 'rhs'))) {
                    const rhs = get(ch, 'rhs') || {};
                    nextChanges.push(...Object.keys(rhs).map(key => ({
                        path: ['relations', 'attributes', key],
                        rhs: rhs[key],
                        kind: 'E'
                    })));
                } else {
                    nextChanges.push(ch);
                }
            });
            return isEmpty(nextChanges) ? change : { ...change, changes: nextChanges };
        });
    }

    /**
     * @override
     */
    render(): Object {
        const { isLoading, startIndex, changelog, count, match, entityType } = this.props;
        const normalizedChangelog = this.normalizeChangelog(changelog);
        return (
            <Layout noPadding>
                <Filters
                    id={`Changelog.${entityType}.${match.params.id}`}
                    filterDefinitions={this.filterDefinitions}
                    defaultOrder={this.defaultOrder}
                    searchBar={this.searchBar}
                >
                    {(filterBy, orderBy) => (
                        <VirtualListManaged
                            ref={this.listRef}
                            renderComponent={this.renderComponent}
                            itemSize={54}
                            itemCount={count || 0}
                            loadData={this.loadRecords}
                            isLoading={isLoading}
                            filterBy={filterBy}
                            orderBy={orderBy}
                            list={normalizedChangelog}
                            startIndex={startIndex}
                            maxWidth="1024"
                        />
                    )}
                </Filters>
            </Layout>
        );
    }
}

export default withRouter(Changelog);
