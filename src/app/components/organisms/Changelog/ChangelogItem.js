/* @flow */
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { darken } from 'polished';
import { Link } from 'react-router-dom';

import { getPriorityLabel } from 'app/config/aboxConfig';
import Avatar from 'app/components/molecules/Avatar/Avatar';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import Icon from 'app/components/atoms/Icon/Icon';
import ItemColumn from 'app/components/molecules/List/ItemColumn';
import ItemRow from 'app/components/molecules/List/ItemRow';
import ListComponent from 'app/components/molecules/List/List';
import ListItemBase from 'app/components/molecules/List/ListItemBase';
import { DATE_FORMAT, DATE_SAVE_FORMAT, TIME_SAVE_REGEXPR, formatDate, isIsoDate, displayByKind } from 'app/utils/date/date';
import { get } from 'app/utils/lo/lo';
import { chooseIcon } from 'app/utils/attachments/attachmentsUtils';
import { isDefined, isEmpty, getStr, isObject } from 'app/utils/utils';
import { getProperties } from 'app/utils/json/json';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';

const ListItem = styled(ListItemBase)`
word-break: break-all;
a {
    color: ${({ theme }) => theme.base.textColor};
}
`;

const ChangesRow = styled(ItemRow)`
background: ${({theme}) => darken(0.05, theme.widget.background)};
`;

const MultipleItemStyled = styled.div`
padding: .5rem 1rem;
`;
const EmptyElement = styled.div`
margin-bottom: -1rem;
`;

const UnorderedList = styled.ul`
margin-top: 0;
margin-bottom: 0;
`;

const OrderedList = styled.ol`
margin-top: 0;
margin-bottom: 0;
`;

const Message = styled.div`
display: inline;
p {
    margin: 0;
}
`;
const AttachmentImage = styled.img`
    max-width: 100%;
    max-height: 300px;
    position: relative;
    padding: 5px 0;
    &:after {
      content: "\\F82A";
      font: normal normal normal 24px/1 "Material Design Icons";
      display: block;
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #343434;
    }
    &:before {
      content: attr(alt);
      display: block;
      position: absolute;
      z-index: 3;
      top: 4px;
      left: 26px;
      width: 100%;
      height: 100%;
    }
`;

const convertDateTime = (value) => {
    const time = displayByKind('time', value);
    if(isIsoDate(value)) {
        return displayByKind('datetime', value);
    } else if (moment(value, DATE_SAVE_FORMAT).isValid() && value.length === 8) {
        return displayByKind('date', value);
    } else if (time && time !== 'Invalid date' && TIME_SAVE_REGEXPR.test(value)) {
        return time;
    }
};

/**
 *
 */
class ChangelogItem extends PureComponent<Object, Object> {

    static propTypes = {
        logEntry: PropTypes.object.isRequired,
        translate: PropTypes.func.isRequired,
        resizeRow: PropTypes.func,
        updateHeight: PropTypes.func,
    };

    static defaultProps = {
        resizeRow: () => {},
        updateHeight: () => {}
    }

    state = { showDetails: false };

    componentDidUpdate() {
        this.props.resizeRow();
        this.props.updateHeight();
    }

    componentDidMount() {
        window.addEventListener('resize', this.props.resizeRow);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.props.resizeRow);
    }

    @bind
    toggleDetails() {
        this.setState({ showDetails: !this.state.showDetails });
    }

    /**
     * Check if the given value is a JSON or in case it isn't tryes to parse it.
     *
     * @param value the value to check/parse.
     * @return a JSON containig two properties: "isValid" indicates if the value is a JSON and "value" contains the value as JSON (only when isValid is true)
     */
    @bind
    tryAsJson(value: ?any) {
        try {
            if (!isDefined(value) || typeof value === 'object') {
                return { isValid: true, value };
            } else if (typeof value === 'string' && value.startsWith('{')) {
                return { isValid: true, value: JSON.parse(value) };
            }
            return { isValid: false };
        } catch (e) {
            return { isValid: false };
        }
    };

    /*
     * # Standard Operations
     *
     * N new
     * E edit
     * D delete
     *
     * # Array Operations
     *
     * P push
     * R remove
     */
    @bind
    getMessageType(kind: string) {
        const type = {
            N: 'created',
            E: 'updated',
            D: 'deleted',
            // array operations:
            P: 'added',
            R: 'removed',
            U: 'updated',
        }[kind];
        if (!type) {
            throw new Error(`Unknown kind ${kind}`);
        };
        return type;
    }

    @bind
    getEntityUrl(entityType: string) {
        return {
            'thing': 'things',
            'organisation': 'organisations',
            'person': 'people',
            'custom': 'custom-entities',
            'task': 'abox/task',
            'process': 'abox/process',
            'group': 'groups',
            'classification': 'classifications',
        }[entityType];
    };

    @bind
    enrichValue(path: Array<string>, value: any, kind: string, formatJson?: boolean = true) {
        const { formatValue } = this;
        const { entityType } = this.props;
        switch(path[0]) {
            case 'parentId':
                return value ? <Link to={`/${this.getEntityUrl(entityType)}/${value}`}>{formatValue(value)}</Link> : 'with no value';
            default:
        }
        if (!isDefined(value)) {
            return null;
        }
        const propertyPath = path.join('.');
        switch(propertyPath) {
            case 'assignee.id': case 'owner.id':
                return value && <a href={`/#/${this.getEntityUrl('person')}/${value}`}>{value}</a>;
            case 'variable.completion':
                return `${value}%`;
            case 'priority':
                return getPriorityLabel(value);
            default:
        }
        switch(path[0]) {
            case 'dateOfBirth':
                return formatDate(new Date(value), DATE_FORMAT);
            case 'iconName':
                return <Icon name={value} size="sm" />;
            case 'image':
                return <a href={value} target="_blank" rel="noopener noreferrer">{decodeURIComponent(value.split('/').pop())}</a>;
            case 'organisationId':
                return value && <Link to={`/organisations/${value}`}>{formatValue(value)}</Link>;
            case 'thingId':
                return value && <Link to={`/things/${value}`}>{formatValue(value)}</Link>;
            case 'children':
                return value && value.id && <Link to={`/${this.getEntityUrl(entityType)}/${value.id}`}>{formatValue(value.id)}</Link>;
            case 'attachments': {
                const { id, url, name, mimeType } = value;
                const href = url || `/graphql/file/${id}/download`;
                if(mimeType.startsWith('image/')) {
                    return (
                        kind === 'R' ? <Fragment> <Icon name="image-off" size="sm" />{' '}{name}</Fragment>
                            : (
                                <div>
                                    <a href={href} target="_blank" rel="noopener noreferrer"><AttachmentImage alt={name} src={url || `/graphql/file/${id}`} /></a>
                                </div>
                            )
                    );
                }
                const iconName = chooseIcon(mimeType);
                return (
                    <Fragment>
                        <Icon name={iconName} size="sm" /> {' '}
                        {kind === 'R' ? name : <a href={href} target="_blank" rel="noopener noreferrer">{name}</a>}
                    </Fragment>
                );
            }
            case 'comments': {
                const { message, id, name, mimeType } = value;
                if (message) {
                    return <Message dangerouslySetInnerHTML={{ __html: message }} />;
                } else if (id) {
                    const href = `/graphql/file/${id}/download`;
                    const iconName = chooseIcon(mimeType);
                    return (
                        <Fragment>
                            <Icon name={iconName} size="sm" /> {' '}
                            {<a href={href} target="_blank" rel="noopener noreferrer">{name}</a>}
                        </Fragment>
                    );
                }
                return '';
            }
            case 'relations': {
                if (path.length === 1) {
                    const { to: { id, name, type }, definition } = value;
                    return <Fragment> {definition} <a href={`/#/${this.getEntityUrl(type)}/${id}`}>{id} - {name}</a> </Fragment>;
                } else if (path[1] === 'attributes') {
                    const date = convertDateTime(value);
                    if (date) {
                        return date;
                    }
                }
                if (formatJson || typeof value !== 'object') {
                    return formatValue(value);
                }
                return value;
            }
            case 'teamMembers': {
                const { id, type } = value;
                const entityType = (!type || type === 'user') ? 'person' : 'group';
                return (
                    <Fragment>
                        {type === 'group' ? 'group ' : ''}
                        <a href={`/#/${this.getEntityUrl(entityType)}/${id}`}>{id}</a>
                    </Fragment>
                );
            }
            case 'contactInfo': {
                let contacts = Array.isArray(value) ? value : [value];
                contacts = contacts.map<Object>((contact: Object): any => {
                    const { type, sub_type, identifier, is_primary, address } = contact;
                    if (type === 'address') {
                        const { line1, line2, city, province, code, country } = address || {};
                        const formatted = Object.entries({ line1, line2, city, province, code, country })
                            .filter(([key, value]) => value)
                            .map(([key, value]) => value)
                            .join(', ');
                        return address ? `address: ${formatted}` : <Fragment>with <b>"No value"</b></Fragment>;
                    }
                    return <Fragment> {type} {sub_type && `(${sub_type})`}: {identifier || <b>"No value"</b>} {is_primary && '(primary)'} </Fragment>;
                });
                if (contacts.length === 1) {
                    return contacts[0];
                }
                return (
                    <ul>
                        {contacts.map(contact => <li>{contact}</li>)}
                    </ul>
                );
            }
            case 'entities.permissions': {
                const permissions = (get(value, 'permissions') || []).join(', ');
                const uid = get(value, 'entities[0].uid');
                const entityId = getStr(value, 'entities[0].entityId');
                const entityType = getStr(value, 'entities[0].entityType');
                return (
                    <Fragment>
                        {' '}permissions to {entityType}
                        {' '}{entityId ? <Link to={`/${this.getEntityUrl(entityType || '')}/${entityId || ''}`}>{uid}</Link> : <b>{uid}</b>} with
                        {' '}{permissions ? <b>{permissions}</b> : 'no'} permissions
                    </Fragment>
                );
            }
            case 'group.classificationUris': {
                return (
                    <b>{get(value, '[0]')}</b>
                );
            }
            case 'entities': {
                if(getStr(value, 'entityType') === 'proc_def' || !get(value, 'entityId')) {
                    return (
                        <Fragment>
                            {' '}{this.props.translate([get(value, 'entityType')])}
                            {' '}<b>{get(value, 'uid')}</b>
                        </Fragment>
                    );
                } else {
                    return (
                        <Fragment>
                            {' '}{this.props.translate([get(value, 'entityType')])}
                            {' '}<b><Link to={`/${this.getEntityUrl(getStr(value, 'entityType') || '')}/${getStr(value, 'entityId') || ''}`}>{get(value, 'uid')}</Link></b>
                        </Fragment>
                    );
                }
            }
            case 'attributes': {
                const date = convertDateTime(value);
                if (date) {
                    return date;
                }
                break;
            }
            default:
        }
        if (formatJson || typeof value !== 'object') {
            return formatValue(value);
        }
        return value;
    }

    @bind
    formatValue(value: any) {
        if (!isDefined(value)) {
            return '';
        }
        if (isIsoDate(value)) {
            return formatDate(new Date(value));
        }
        if (value instanceof Object) {
            return JSON.stringify(value);
        }
        return String(value);
    };

    @bind
    displayJson(kind: string, path: Array<string>, value: any) {
        const { translate } = this.props;
        const label = translate(path);
        if (!value || typeof value !== 'object' || isEmpty(value)) {
            return <Fragment><strong>{label}</strong> {this.enrichValue(path, value, kind)}</Fragment>;
        }
        if (Array.isArray(value)) {
            return (
                <Fragment>
                    {label ? <strong>{label}:</strong> : <br />}
                    <OrderedList>
                        {value.map(val => <li key={val}>{this.displayJson(kind, [], val)}</li> )}
                    </OrderedList>
                </Fragment>
            );
        }

        const properties = getProperties(value);
        return (
            <Fragment>
                {label ? <strong>{label}:</strong> : <br />}
                <UnorderedList>
                    {properties.sort().map((property) => {
                        const newValue = get(value, property);
                        return <li key={property}>{this.displayJson(kind, property.split('.'), newValue)}</li>;
                    })}
                </UnorderedList>
            </Fragment>
        );
    }

    @bind
    buildItemInfo(change: Object) {
        const { entityType, translate } = this.props;
        const { path, item, kind, lhs, rhs } = change;
        const label = translate(path);
        const type = this.getMessageType(change.kind);
        if (change.valueTooLarge) {
            return <Fragment> {type} <strong>{label}</strong> (value not stored because is too large) </Fragment>;
        }
        if (kind === 'N' && path.length === 0) {
            return <Fragment> {type} <b>{entityType}.</b> </Fragment>;
        } else if (kind === 'N' && get(path, '[0]') === 'name') {
            return <Fragment> {type} <b>{entityType}</b> {rhs}</Fragment>;
        } else if (kind === 'E' && get(path, '[0]') === 'endDate') {
            return <Fragment> closed <b>{entityType}.</b> </Fragment>;
        } else if (kind === 'E') {
            const fromValue = this.enrichValue(path, lhs, kind);
            let toValue = this.enrichValue(path, rhs, kind);

            if (fromValue && toValue) {
                return (
                    <Fragment>
                        {type} <strong>{label}</strong>
                        <i> from </i> {fromValue}
                        <i> to </i> { toValue }
                    </Fragment>
                );
            }

            toValue = this.enrichValue(path, rhs, kind, false);
            if (isDefined(toValue) && toValue === rhs && typeof rhs === 'object' && !isEmpty(rhs)) {
                return <Fragment>{type} {this.displayJson(kind, path, rhs)}</Fragment>;
            }

            if(!item && (isObject(rhs) && isEmpty(rhs))) {
                return (
                    <Fragment>
                        {type} <strong>{label}</strong> with no value
                    </Fragment>
                );
            }

            if(item) {
                return (
                    <Fragment>
                        {type} { this.enrichValue(path, item, kind) }
                    </Fragment>
                );
            }

            return (
                <Fragment>
                    {type} <strong>{label}</strong>
                    {
                        fromValue && toValue
                            ? <Fragment> <i>from</i> {fromValue} <i>to</i> </Fragment>
                            : (toValue ? ' with value ' : ' with no value ')
                    }
                    { toValue }
                </Fragment>
            );
        } else if (path[0] === 'bpmnVariable') {
            if (kind === 'R' || kind === 'D') {
                return <Fragment> {type} <strong>{label}</strong> </Fragment>;
            } else if (kind === 'N' || kind === 'P') {
                const itemJson = this.tryAsJson(item || rhs);
                if (itemJson.isValid && !isEmpty(itemJson.value)) {
                    return <Fragment>{type} {this.displayJson(kind, path, itemJson.value)}</Fragment>;
                }
            }
        } else if (path[0] === 'group.users') {
            return (
                <Fragment>
                    {type} <strong>{label}</strong>
                    <UnorderedList>
                        {item.map(val => <li key={val}><b>id</b> {val}</li> )}
                    </UnorderedList>
                </Fragment>
            );
        }
        const value = this.enrichValue(path, item || rhs, kind, false);
        if (value === (item || rhs) && typeof value === 'object') {
            return <Fragment>{type} {this.displayJson(kind, path, value)}</Fragment>;
        }
        if ((kind === 'P' || kind === 'R') && path[0] === 'entities') {
            return <Fragment> {type} {value} </Fragment>;
        }
        return <Fragment> {type} <strong>{label}</strong> {value} </Fragment>;
    }

    @bind
    @memoize()
    buildExpandedList(changes: Array<Object>): Array<Object> {
        return changes.map((change, i) => (
            <MultipleItemStyled key={i}>
                {this.buildItemInfo(change)}
            </MultipleItemStyled>
        ));
    };

    @bind
    @memoize()
    buildSingleItem(changes: Array<Object>) {
        const { logEntry, translate } = this.props;
        const user = logEntry.modifiedBy || {};
        return (
            <ListItem raised small>
                <ItemRow>
                    <ItemColumn shrink>
                        <Avatar src={user.image} name={user.name} size='lg' />
                    </ItemColumn>
                    <ItemColumn grow wrap>
                        <b><a href={`/#/people/${user.id}/summary`}>{user.name}</a> </b>
                        {this.buildItemInfo({
                            ...changes[0],
                            label: translate(get(changes[0], 'path', [])),
                        })}
                        <div><em>{formatDate(new Date(logEntry.modifiedDate))}</em></div>
                    </ItemColumn>
                </ItemRow>
            </ListItem>
        );
    };

    render() {
        const { logEntry, className } = this.props;
        const user = logEntry.modifiedBy || {};
        const changes = logEntry.changes;
        if (changes.length === 0) {
            return <EmptyElement />;
        } else if (changes.length === 1) {
            return this.buildSingleItem(changes);
        }
        return (
            <ListItem className={className} raised small>
                <ItemRow>
                    <ItemColumn shrink>
                        <Avatar src={user.image} name={user.name} size='lg' />
                    </ItemColumn>
                    <ItemColumn grow wrap>
                        <b><a href={`/#/people/${user.id}/summary`}>{user.name}</a></b> updated <b>multiple</b> values.
                        <div><em>{formatDate(new Date(logEntry.modifiedDate))}</em></div>
                    </ItemColumn>
                    <ItemColumn>
                        <ButtonIcon icon="menu-down" onClick={this.toggleDetails} />
                    </ItemColumn>
                </ItemRow>
                {
                    this.state.showDetails &&
                    <ChangesRow>
                        <ListComponent>
                            {this.buildExpandedList(changes)}
                        </ListComponent>
                    </ChangesRow>
                }
            </ListItem>
        );
    }

};

export default ChangelogItem;
