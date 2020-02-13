/* @flow */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateGroupDetails } from 'store/actions/admin/groupsActions';
import Container from 'app/components/atoms/Container/Container';
import Form from 'app/components/atoms/Form/Form';
import Card from 'app/components/molecules/Card/Card';
import TextIcon from 'app/components/molecules/TextIcon/TextIcon';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import { set, get } from 'app/utils/lo/lo';
import GroupClassificationSection from './GroupClassificationSection';
import FormGenerator from 'app/containers/Designer/Form/components/FormGenerator';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';

/**
 * Container that is used to display the General tab of the Groups & Permissions details view.
 */
class GroupAboutTab extends Component<Object, Object> {
    static propTypes = {
        group: PropTypes.object,
        updateGroupDetails: PropTypes.func,
        userProfile: PropTypes.object
    };

    /**
     * @param props the Component's parameters.
     */
    constructor(props) {
        super(props);
        (this: Object).state = { group: props.group };
    }

    /**
     * componentDidUpdate - description
     *
     * @param  {type} prevProps description
     * @return {type}           description
     */
    componentDidUpdate(prevProps) {
        const group = this.props.group;
        if (prevProps.group !== group) {
            this.setState({ group });
        }
    }

    formRef: Object = React.createRef();

    @bind
    @memoize()
    fieldDefinitions(isAdmin: boolean, isSuperGroup: boolean) {
        const groupParentFilter = [{ field: 'id', op: '<>', value: this.state.group.id }];
        return [
            {
                field: 'name',
                type: 'text',
                properties: {
                    label: 'Group Name',
                    name: 'name',
                },
                constraints: {
                    required: true,
                    minLength: 3,
                    maxLength: 60,
                },
            },
            {
                field: 'category',
                type: 'text',
                properties: {
                    label: 'Category',
                    name: 'category',
                },
            },
            {
                field: 'parent',
                type: 'groupTypeahead',
                properties: {
                    label: 'Parent',
                    name: 'parent',
                    filterBy: isAdmin ? groupParentFilter : groupParentFilter.push({ field: 'active', op: '=', value: true }),
                },
                condition: '=',
            },
            {
                field: 'active',
                type: 'boolean',
                properties: {
                    label: 'Active',
                    name: 'active',
                },
            },
            {
                field: 'classifications[0]',
                type: 'classificationTypeahead',
                properties: {
                    label: 'Classification',
                    name: 'classifications[0]',
                    filterBy: isAdmin ? null : [{ field: 'active', op: '=', value: true }],
                    applicableOn: 'group',
                },
                condition: '=',
            },
        ].map(def => ({
            ...def,
            properties: {
                ...def.properties,
                disabled: isSuperGroup,
            }
        }));
    };

    @bind
    handleChangeClassification(event) {
        const { name, value } = event.target;
        this.setState(set(this.state, `group.attributes.${name}`, value));
    };

    @bind
    handleGroupChanges(data) {
        const { group } = this.state;
        this.setState({
            group: {
                ...data,
                attributes: group.attributes,
            }
        });
    }

    @bind
    onFormSubmit(event: Object) {
        event.preventDefault();

        this.formRef.current.isValidForm().then(({ data, errors }) => {
            if (!errors) {
                this.props.updateGroupDetails(this.state.group);
            }
        });
    };

    @bind
    @memoize()
    getPermissions(isSuperGroup: boolean) {
        return !isSuperGroup ? ['view', 'edit', 'relation', 'start'] : [];
    }

    /**
     * @override
     */
    render() {
        const { group } = this.state;
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canEdit = isAdmin || permissionsSet.has('admin.group.edit');
        const { id, attributes } = group;
        const clsUri = get(group, 'classifications[0]') || {};
        const isSuperGroup = id === 1;
        return (
            <Fragment>
                <ContentArea>
                    <Form id="form" onSubmit={this.onFormSubmit}>
                        <Container width="1024">
                            <Card
                                collapsible
                                title="Group Details"
                                description={
                                    <Fragment>
                                        <FormGenerator
                                            components={this.fieldDefinitions(isAdmin, isSuperGroup)}
                                            ref={this.formRef}
                                            ListItemProps={{
                                                disableGutters: true
                                            }}
                                            onChange={this.handleGroupChanges}

                                            data={group}
                                        />
                                        <GroupClassificationSection
                                            name="classificationDropdown"
                                            value={clsUri.uri || null}
                                            permissions={this.getPermissions(isSuperGroup)}
                                            attributes={attributes}
                                            handleChangeClassification={this.handleChangeClassification}
                                            disabled
                                        />
                                    </Fragment>
                                }
                            />
                        </Container>
                    </Form>
                </ContentArea>
                <FooterBar>
                    <div>{group.id !== 1 && canEdit && <TextIcon icon="content-save" label="Save" form="form" color="primary" />}</div>
                </FooterBar>
            </Fragment>
        );
    }
}

export default connect(
    state => ({
        group: state.admin.groups.group.details,
        userProfile: state.user.profile
    }),
    { updateGroupDetails }
)(GroupAboutTab);
