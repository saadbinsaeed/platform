/* @flow */
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Container from 'app/components/atoms/Container/Container';
import { get } from 'app/utils/lo/lo';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import TextIcon from 'app/components/molecules/TextIcon/TextIcon';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import Immutable from 'app/utils/immutable/Immutable';
import { updateUser } from 'store/actions/admin/userManagementAction';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';
import FormGenerator from 'app/containers/Designer/Form/components/FormGenerator';

/**
 * General tab in users view.
 * Todo: We probably should extract the form in it's own component, however
 * nearly the only code here is form related.
 */
class UserAbout extends PureComponent<Object, Object> {
    state: Object;

    static propTypes: Object = {
        user: PropTypes.object,
        updateUser: PropTypes.func.isRequired,
        userProfile: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = { user: Immutable({ ...props.user, language: props.user.language && { name: props.user.language } }) };
    }

    componentDidUpdate(prevProps: Object) {
        const { user } = this.props;
        if (prevProps.user !== user) {
            this.setState({ user: Immutable({ ...user, language: user.language && { name: user.language } }) });
        }
    }

    formRef: Object = React.createRef();

    @bind
    @memoize()
    fieldDefinitions(user, isAdmin) {
        return [
            {
                field: 'panel',
                type: 'panel',
                properties: {
                    header: 'Basic',
                    expanded: true,
                },
                children: [
                    {
                        field: 'id',
                        type: 'number',
                        properties: {
                            label: 'ID',
                            name: 'id',
                            disabled: true,
                        },
                    },
                    {
                        field: 'lastUpdatedDate',
                        type: 'dateTime',
                        properties: {
                            label:'Last Authenticated',
                            name: 'lastUpdatedDate',
                            disabled: true,
                            fullWidth: true,
                        },
                    },
                    {
                        field: 'createdDate',
                        type: 'dateTime',
                        properties: {
                            label:'Created On',
                            name: 'createdDate',
                            disabled: true,
                            fullWidth: true,
                        },
                    },
                    {
                        field: 'createdBy.name',
                        type: 'text',
                        properties: {
                            label:'Created By',
                            name: 'createdBy.name',
                            disabled: true,
                        },
                    },
                    {
                        field: 'login',
                        type: 'text',
                        properties: {
                            label:'Login ID',
                            name: 'login',
                            disabled: true,
                        },
                    },
                ],
            },
            {
                field: 'panel',
                type: 'panel',
                properties: {
                    header: 'Person Details',
                    expanded: true,
                },
                children: [
                    {
                        field: 'image',
                        type: 'avatarEditor',
                        properties: {
                            name: 'image',
                            disabled: true,
                            initials: user.name,
                            image: user.image,
                        },
                    },
                    {
                        field: 'name',
                        type: 'text',
                        properties: {
                            label: 'Name',
                            name: 'name',
                        },
                        constraints: {
                            required: true,
                            minLength: 3,
                            maxLength: 60,
                        },
                    },
                    {
                        field: 'partyId',
                        type: 'text',
                        properties: {
                            label: 'Email',
                            name: 'partyId',
                        },
                        constraints: {
                            required: true,
                            minLength: 3,
                            maxLength: 50,
                            email: true,
                        },
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
                        field: 'language',
                        type: 'customEntitiesTypeahead',
                        properties: {
                            label: 'Language',
                            name: 'language',
                            valueField: 'name',
                            placeholder: 'Select language...',
                            directoryType: 'languages',
                        },
                    },
                    {
                        field: 'groups',
                        type: 'groupTypeahead',
                        properties: {
                            label: 'Select User Groups',
                            name: 'groups',
                            filterBy: (groups) => {
                                const filterBy = [];
                                if (groups && groups.length) {
                                    const modifiedGroups = groups.map(({ name }) => name);
                                    filterBy.push(
                                        { field: 'allChildren.name', op: 'not in', value: modifiedGroups },
                                        { field: 'allParents.name', op: 'not in', value: modifiedGroups }
                                    );
                                }
                                return filterBy;
                            } ,
                            multiple: true,
                        },
                    },
                ]
            }
        ];
    };


    @bind
    handleChange(user) {
        this.setState({ user });
    }

    @bind
    onFormSubmit(event: Object) {
        event.preventDefault();
        this.formRef.current.isValidForm().then(({ data, errors }) => {
            if (!errors) {
                const { user } = this.state;
                this.props.updateUser({
                    ...user,
                    language: get(user, 'language.name', null),
                    groups: user.groups && user.groups.map(({ id }) => id),
                });
            }
        });
    };

    render(): Object {
        const { user } = this.state;
        const { isAdmin } = this.props.userProfile;
        return (
            <Fragment>
                <ContentArea>
                    <Container width="1024">
                        <FormGenerator
                            components={this.fieldDefinitions(user, isAdmin)}
                            ref={this.formRef}
                            ListItemProps={{
                                disableGutters: true
                            }}
                            onChange={this.handleChange}
                            data={user}
                        />
                    </Container>
                </ContentArea>
                <FooterBar>
                    <TextIcon
                        icon="content-save"
                        label="Save"
                        color="primary"
                        form="user_about_form"
                        type="submit"
                        onClick={this.onFormSubmit}
                    />
                </FooterBar>
            </Fragment>
        );
    }
}

const mapStateToProps: Function = (state: Object): Object => {
    return {
        userProfile: state.user.profile,
    };
};

export default connect(
    mapStateToProps,
    {
        updateUser,
    },
)(UserAbout);
