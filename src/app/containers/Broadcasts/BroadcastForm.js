/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Form from 'app/components/atoms/Form/Form';
import Button from 'app/components/atoms/Button/Button';
import NotificationsBar from 'app/components/molecules/NotificationsBar/NotificationsBar';
import CardFooter from 'app/components/molecules/Card/CardFooter';

import { get } from 'app/utils/lo/lo';
import { fetchBroadcast, saveBroadcast } from 'store/actions/broadcasts/broadcastsActions';
import { showToastr } from 'store/actions/app/appActions';
import FormGenerator from 'app/containers/Designer/Form/components/FormGenerator';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';

// $FlowFixMe
import audioSrc from 'media/sounds/notification.mp3';

const oneOfNotNull = (data) => {
    const required = { presence: { allowEmpty: false, message: '{label} is required.' } };
    if(!get(data, 'groups.length') && !get(data, 'users.length')) {
        return required;
    }
    return {};
};

/**
 * Create Broadcast
 */
class BroadcastForm extends PureComponent<Object, Object> {

    static propTypes = {
        fetchBroadcast: PropTypes.func,
        saveBroadcast: PropTypes.func,
        showToastr: PropTypes.func,
        broadcastCreatedId: PropTypes.number,
        isLoading: PropTypes.bool,
        isSubmitting: PropTypes.bool,
        broadcast: PropTypes.object,
        match: PropTypes.object,
        location: PropTypes.object,
        history: PropTypes.object,
        userProfile: PropTypes.object,
    };

    state: {
        broadcast: ?Object,
        previewActive: boolean,
        buttonDisabled: boolean,
    };

    audio: Object;

    formRef: Object = React.createRef();

    repeatTypes = [
        { value: 'H', label: 'Hourly', name: 'Hour' },
        { value: 'D', label: 'Daily', name: 'Day' },
        { value: 'DW', label: 'By Day of Week', name: 'Day(s) of the week' },
        { value: 'W', label: 'Weekly', name: 'Week' },
        { value: 'M', label: 'Monthly', name: 'Month' },
        { value: 'Y', label: 'Yearly', name: 'Year' },
    ];

    @bind
    @memoize()
    fieldDefinitions(isAdmin, data) {
        const definition: Array<Object> = [
            {
                field: 'groups',
                type: 'groupTypeahead',
                properties: {
                    label: 'Recipient groups',
                    name: 'groups',
                    multiple: true,
                    filterBy: isAdmin ? null : [{ field: 'active', op: '=', value: true }],
                },
                constraints: { custom: oneOfNotNull },
            },
            {
                field: 'users',
                type: 'userTypeahead',
                properties: {
                    label: 'Recipients',
                    name: 'users',
                    multiple: true,
                    filterBy: isAdmin ? null : [{ field: 'active', op: '=', value: true }],
                },
                constraints: { custom: oneOfNotNull },
            },
            {
                field: 'message',
                type: 'text',
                properties: {
                    label: 'Message',
                    name: 'message',
                },
                constraints: {
                    required: true,
                    maxLength: 1000,
                },
            },
            {
                field: 'startDate',
                type: 'dateTime',
                properties: {
                    label: 'Start time',
                    name: 'startDate',
                },
                constraints: {
                    required: true,
                    datetime: {
                        earliest: new Date(),
                        message: '{label} cannot be before %{value}',
                    }
                },
            },
            {
                field: 'expiresAfterValue',
                type: 'number',
                properties: {
                    label: 'Message expires after value',
                    name: 'expiresAfterValue',
                },
                constraints: {
                    required: true,
                    numericality: {
                        noString: true,
                        onlyInteger: true,
                        lessThanOrEqualTo: 999,
                        notLessThanOrEqualTo: '{label} needs to be less than or equal to %{count}',
                    }
                },
            },
            {
                field: 'expiresAfterUnit',
                type: 'typeahead',
                properties: {
                    label: 'Message expires after unit',
                    name: 'expiresAfterUnit',
                    options: [
                        { value: 'D', label: 'Day(s)' },
                        { value: 'H', label: 'Hour(s)' },
                        { value: 'M', label: 'Minutes(s)' },
                        { value: 'S', label: 'Second(s)' },
                    ],
                },
                constraints: {
                    required: true,
                },
            },
            {
                field: 'repeat',
                type: 'boolean',
                properties: {
                    label: 'Repeat',
                    name: 'repeat',
                },
            },
            {
                field: 'repeatInterval',
                type: 'typeahead',
                properties: {
                    label: 'Repeats',
                    name: 'repeatInterval',
                    options: this.repeatTypes,
                    isVisible: (data) => { return data && data['repeat']; },
                },
                constraints: {
                    required: true,
                },
            },
            {
                field: 'repeatValue',
                type: 'number',
                properties: {
                    label: 'Repeat Every',
                    name: 'repeatValue',
                    isVisible: (data) => { return data && data['repeatInterval'] && data['repeatInterval'] !== 'DW'; },
                },
                constraints: {
                    required: true,
                }
            },
            {
                field: 'repeatValue',
                type: 'typeahead',
                properties: {
                    label: 'Repeat Every',
                    name: 'repeatValue',
                    options: [
                        { value: 'Mo', label: 'Monday' },
                        { value: 'Tu', label: 'Tuesday' },
                        { value: 'We', label: 'Wednesday' },
                        { value: 'Th', label: 'Thursday' },
                        { value: 'Fr', label: 'Friday' },
                        { value: 'Sa', label: 'Saturday' },
                        { value: 'Su', label: 'Sunday' },
                    ],
                    isVisible: (data) => { return data && data['repeatInterval'] && data['repeatInterval'] === 'DW'; },
                    multiple: true,
                },
                constraints: {
                    required: true,
                }
            },
            {
                field: 'repeatEnds',
                type: 'dateTime',
                properties: {
                    label: 'Repeat ends',
                    name: 'repeatEnds',
                    isVisible: (data) => { return data && data['repeat']; },
                },
                constraints: {
                    required: true,
                    datetime: {
                        earliest: (data && data['startDate']) || new Date(),
                        message: '{label} cannot be before %{date}',
                    }
                },
            }
        ];
        return definition;
    };

    constructor(props: Object) {
        super(props);

        const id = get(this, 'props.match.params.id');
        this.state = {
            broadcast: id ? props.broadcast : { startDate: new Date() },
            previewActive: false,
            buttonDisabled: false,
        };
        if (id) {
            this.props.fetchBroadcast({ id });
        }

        // $FlowFixMe
        this.audio = new Audio(audioSrc);
    }

    componentDidUpdate(prevProps) {
        const { broadcast, match, broadcastCreatedId } = this.props;
        if (broadcastCreatedId !== prevProps.broadcastCreatedId) {
            // this.props.history.push(`/broadcasts/edit/${this.props.broadcastCreatedId}`);
            this.props.history.goBack(); // Go back to the previous page instead of to Edit
        }
        const id = get(match, 'params.id');
        if (id !== get(prevProps, 'match.params.id')) {
            if (id) {
                this.props.fetchBroadcast({ id });
            } else {
                this.setState({ broadcast: { startDate: new Date() } });
            }
        }
        if (broadcast !== prevProps.broadcast) {
            this.setState({ broadcast });
        }
    }

    /**
     * Function for dealing with our normal input on change
     */
    @bind
    onChange(data: Object) {
        this.setState({ broadcast: data });
    };

    /*
     * Submit our form data
     */
    @bind
    submitForm(event: Event) {
        event.preventDefault();
        this.disableSubmitButton();
        this.formRef.current.isValidForm().then(({ data, errors}) => {
            if (!errors) {
                const repeatValue = data['repeatValue'] && JSON.stringify(data['repeatValue']);
                const newData = { ...data, active: true, repeatValue };
                this.props.saveBroadcast(newData);
            }
        });
    };

    /**
     * Disable the submit button on press and slow the ability to repress.
     */
    @bind
    disableSubmitButton() {
        this.setState({ buttonDisabled: true });
        setTimeout(() => {
            this.setState({ buttonDisabled: false });
        }, 2000);
    };

    @bind
    togglePreview(event: Event) {
        event.preventDefault();
        this.audio.pause();
        this.audio.currentTime = 0;
        this.setState({ previewActive: !this.state.previewActive }, this.playAudio);
    };

    @bind
    playAudio() {
        this.state.previewActive && this.audio.play().catch();
    };

    @bind
    @memoize()
    parseRepeatValue(repeatValue, repeatInterval) {
        if (repeatInterval === 'DW') {
            if (typeof repeatValue === 'string') {
                const repeatValueParsed =  JSON.parse(repeatValue);
                this.setState(prevState => ({
                    broadcast: {
                        ...prevState.broadcast,
                        repeatValue: repeatValueParsed,
                    }
                }));
            }
        }
    };

    /**
     * Render our create broadcast form
     */
    render() {
        const { isLoading, isSubmitting, match, userProfile: { isAdmin } } = this.props;
        const id = get(match, 'params.id');
        const { broadcast, previewActive } = this.state;
        const { message, repeatValue, repeatInterval } = broadcast || {};
        this.parseRepeatValue(repeatValue, repeatInterval);
        const messages = [{ id: 1, text: message }];
        return (
            <Fragment>
                {previewActive && <NotificationsBar messages={messages}/>}
                <Form loading={isLoading} method="post">
                    <FormGenerator
                        components={this.fieldDefinitions(isAdmin, broadcast)}
                        ref={this.formRef}
                        data={broadcast}
                        onChange={this.onChange}
                        ListItemProps={{
                            disableGutters: true
                        }}
                    />
                    <CardFooter>
                        <Button
                            color="warning"
                            type="button"
                            onClick={this.togglePreview}
                            disabled={isSubmitting}
                        >{previewActive ? 'Close Preview' : 'Preview'}</Button>
                        <Button onClick={this.submitForm} color="primary" type="submit" disabled={isSubmitting || this.state.buttonDisabled}>{id
                            ? 'Save'
                            : 'Create'}</Button>
                    </CardFooter>
                </Form>

            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        broadcastCreatedId: state.broadcasts.save.data && state.broadcasts.save.data.id,
        broadcast: state.broadcasts.detail.data,
        isLoading: state.broadcasts.detail.isLoading,
        isSubmitting: state.broadcasts.save.isLoading,
        userProfile: state.user.profile,
    };
};

export default connect(mapStateToProps, {
    fetchBroadcast,
    saveBroadcast,
    showToastr,
})(BroadcastForm);
