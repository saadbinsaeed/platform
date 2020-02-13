/* @flow */

// $FlowFixMe
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isBrowser } from 'react-device-detect';

import { deepEquals } from 'app/utils/utils';
import { get } from 'app/utils/lo/lo';
import { outdateAboxAttachments } from 'store/actions/abox/aboxActions';
import { outdateTaskDetails } from 'store/actions/abox/taskActions';
import { outdateProcessDetails } from 'store/actions/abox/processActions';
import { saveMessage, toggleMessenger, loadMessenger, attachMessengerFile } from 'store/actions/messenger/messengerActions';
import { isInvalidExtension, isInvalidSize } from 'app/utils/attachments/attachmentsUtils';
import { showToastr } from 'store/actions/app/appActions';
import AboxTeam from 'app/components/ABox/Team/AboxTeam';
import Modal from 'app/components/molecules/Modal/Modal';
import MessageItem from 'app/components/organisms/Messenger/MessageItem';
import MessengerBody from 'app/components/organisms/Messenger/MessageBody';
import MessengerFooter from 'app/components/organisms/Messenger/MessengerFooter';
import MessengerHeader from 'app/components/organisms/Messenger/MessengerHeader';
import PasteForm from 'app/components/organisms/Messenger/PasteForm';
import history from 'store/History';
import DropzoneWrapper from 'app/components/molecules/Dropzone/DropzoneWrapper';
import { bind, debounce, memoize } from 'app/utils/decorators/decoratorUtils';

const MessengerContainer = styled.div`
    display: ${({ show }) => show ? 'grid' : 'none' };
    grid-area: gMessenger;
    position: absolute;
    bottom: 0; right: 0;
    top: 0;
    width: 100%;
    max-height: 100%;
    height: 100%;
    z-index: 998;
    @media(min-width: ${({ theme }) => theme.media.sm}) {
        ${({ fullScreen }) => !fullScreen && `position: relative; width: 400px; height: 100%;`}
    }
`;
const MessengerGrid = styled.div`
    display: grid;
    grid-template-areas: "chatSide chatHead"
                          "chatSide chatBody"
                          "chatSide chatFoot";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 0; // Change this to auto or give a value to show sidebar
    width: 100%;
    max-height: ${({ height }) => height ? `${height}px` : '100vh'};
    height: ${({ height }) => height ? `${height}px` : '100vh'};
`;

/**
 * Messenger
 */
class Messenger extends PureComponent<Object, Object> {

    static propTypes = {
        outdateProcessDetails: PropTypes.func.isRequired,
        outdateTaskDetails: PropTypes.func.isRequired,
        attachMessengerFile: PropTypes.func.isRequired,
        outdateAboxAttachments: PropTypes.func.isRequired,
        messages: PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            name: PropTypes.string,
            comments: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.number.isRequired,
                createDate: PropTypes.string.isRequired,
                createdBy: PropTypes.shape({
                    id: PropTypes.number.isRequired,
                    image: PropTypes.string,
                    login: PropTypes.string.isRequired,
                    name: PropTypes.string.isRequired,
                }),
                message: PropTypes.shape({
                    message: PropTypes.string,
                    plainMessage: PropTypes.string,
                }),
            })),
        }),
    };

    messageRef: Object = React.createRef();
    messageBodyRef: Object = React.createRef();
    reloadInterval: number;

    constructor(props: Object) {
        super(props);
        this.state = {
            message: '',
            plainMessage: '',
            showWindowPortal: false,
            sidebarOpen: false,
            showTeamModal: false,
            showPasteForm: false,
            fullScreen: false,
            pasteFile: null,
            height: window.innerHeight,
        };
        this.reloadInterval = window.setInterval(this.loadMessages, 5000);
    }

    componentDidMount() {
        this.scrollToBottom();
        if (this.messageRef.current) {
            this.messageRef.current.addEventListener('paste', this.pasteImage, false);
        }
        window.dispatchEvent(new Event('resize'));
        window.addEventListener('resize', this.updateHeight);
    }

    componentDidUpdate(prevProps: Object) {
        if (!deepEquals(get(this.props, 'messages.comments') || {}, get(prevProps, 'messages.comments') || {})) {
            this.scrollToBottom();
        }
        if (!this.props.messages && prevProps.messages !== this.props.messages) {
            this.setState(state => ({ showTeamModal: false }), this.reloadDetails);
        }
    }

    componentUnmount() {
        if (this.messageRef.current) {
            this.messageRef.current.removeEventListener('paste', this.pasteImage);
        }
        window.dispatchEvent(new Event('resize'));
        window.removeEventListener('resize', this.updateHeight);
        window.clearInterval(this.reloadInterval);
    }

    @bind
    updateHeight() {
        if (this.state.height !== window.innerHeight) {
            this.setState({ height: window.innerHeight });
        }
    }

    @bind
    pasteImage(event) {
        const items = event.clipboardData && event.clipboardData.items;
        const size = (items && items.length) || 0;
        for (let i = 0; i < size; ++i) {
            const item = items[i];
            if (item.type.startsWith('image')) {
                const pasteFile = item.getAsFile();
                this.setState({ showPasteForm: true, pasteFile });
            }
        }
    }

    @bind
    toggleFullscreen() { this.setState({ fullScreen: !this.state.fullScreen, }); }

    @bind
    toggleSidebar() { this.setState({ sidebarOpen: !this.state.sidebarOpen }); }

    @bind
    toggleTeamModal() { this.setState({ showTeamModal: !this.state.showTeamModal }); }

    goTo(to) {
        const goTo = () => history.push(to);
        if (isBrowser) {
            this.setState({ fullScreen: false, }, goTo);
        } else {
            goTo();
            this.props.toggleMessenger();
        }
    }

    @bind
    goToAttachments() { this.goTo(`/abox/${this.props.selection.type}/${this.props.selection.id}/attachments`); }

    @bind
    goToSummary() { this.goTo(`/abox/${this.props.selection.type}/${this.props.selection.id}`); }

    @bind
    closePasteForm() { this.setState({ showPasteForm: false, pasteFile: null }); }

    @bind
    @debounce()
    scrollToBottom() {
        const messageList = this.messageBodyRef && this.messageBodyRef.current;
        if (messageList) {
            messageList.scrollTop = messageList.scrollHeight;
        }
    }

    @bind
    @debounce()
    messageChange(event) {
        const { htmlValue, textValue } = event;
        this.setState({ message: htmlValue, plainMessage: textValue.trim() });
    }

    @bind
    @debounce()
    sendMessage() {
        const { id, type } = this.props.selection;
        const { message, plainMessage } = this.state;
        plainMessage && this.props.saveMessage(id, type, message, plainMessage);
        this.setState({ message: '', plainMessage: '' });
    }

    @bind
    reloadDetails() {
        const { selection, showMessenger } = this.props;
        const { id, type } = selection || {};
        if (id && type) {
            showMessenger && this.props.loadMessenger(id, type);
            type === 'process' ? this.props.outdateProcessDetails(id) : this.props.outdateTaskDetails(id);
        }
    };

    @bind
    reloadAttachments() {
        const { selection, showMessenger } = this.props;
        const { id, type } = selection || {};
        if (id && type) {
            showMessenger && this.props.loadMessenger(id, type);
            this.props.outdateAboxAttachments(id, type);
        }
    };

    @bind
    loadMessages() {
        const { selection, showMessenger } = this.props;
        const { id, type } = selection || {};
        if (showMessenger && id && type) {
            this.props.loadMessenger(id, type);
        }
    };

    @bind
    attachMessengerFile(files) {
        if (files instanceof File) {
            return this.uploadFile(files).then(this.reloadAttachments);
        }
        const fileArray = Array.isArray(files) ? files : Object.values(files);
        return Promise.all(fileArray.map(file => this.uploadFile(file))).finally(this.reloadAttachments);
    }

    uploadFile(file) {
        // extra check for Flow
        if (!(file instanceof File)) {
            return Promise.resolve(false);
        }

        const { attachMessengerFile, selection } = this.props;
        if (isInvalidExtension(file)) {
            this.props.showToastr({ severity: 'warn', detail: 'Invalid file type Please upload a valid file!' });
        } else if (isInvalidSize(file)) {
            this.props.showToastr({ severity: 'warn', detail: 'Maximum file size limit which is 50MB exceeded!' });
        } else {
            return attachMessengerFile(selection.id, selection.type, file);
        }
        return Promise.resolve(false);
    }

    normalizeMessages(userId: ?number, messages: ?Array<Object>) {
        return [...(messages || [])]
            .sort((a: Object, b: Object) => {
                return a.id === b.id ? 0 : Number(a.id) > Number(b.id) ? 1 : -1;
            }).map(message => ({
                isSelfMessage: userId === get(message, 'createdBy.id'),
                avatar: get(message, 'createdBy.image'),
                name: get(message, 'createdBy.name'),
                message: get(message, 'message'),
                createDate: get(message, 'createDate'),
            }));
    }

    @bind
    @memoize(deepEquals)
    buildMessages(profileId, messages) {
        return this.normalizeMessages(profileId, messages).map(({ isSelfMessage, createDate, message, name, avatar }, index) => (
            <MessageItem key={index} name={name} avatar={avatar} message={message} date={createDate} isSelfMessage={isSelfMessage} />
        ));
    }

    @bind
    @memoize()
    buildMessengerFooter(message) {
        return (
            <MessengerFooter
                attachMessengerFile={this.attachMessengerFile}
                messageText={message}
                onChange={this.messageChange}
                onSend={this.sendMessage}
            />
        );
    }

    @bind
    @memoize()
    renderChatWindow(props, state) {
        const { selection, messages, showMessenger, toggleMessenger, profile } = props;

        const { id, name, comments, owner, createdBy, assignee, teamMembers } = messages || {};
        const { message, showTeamModal, showPasteForm, pasteFile, fullScreen, height } = state;
        return this.props.messages && (
            <MessengerContainer fullScreen={fullScreen} show={showMessenger} innerRef={this.messageRef}>
                <DropzoneWrapper
                    onDropRejected={this.attachMessengerFile}
                    onDropAccepted={this.attachMessengerFile}
                >
                    <MessengerGrid height={height}>
                        <MessengerHeader
                            openTeamMembers={this.toggleTeamModal}
                            goToAttachments={this.goToAttachments}
                            goToSummary={this.goToSummary}
                            title={name || 'No Name'}
                            subTitle={`#${id}`}
                            onClose={toggleMessenger}
                            toggleSidebar={this.toggleSidebar}
                            toggleFullscreen={this.toggleFullscreen}
                            fullScreen={fullScreen}
                        />
                        <MessengerBody innerRef={this.messageBodyRef}>
                            {this.buildMessages(profile.id, comments)}
                        </MessengerBody>
                        {this.buildMessengerFooter(message)}
                        {showTeamModal && (
                            <Modal onToggle={this.toggleTeamModal} title="Team" open={showTeamModal} disableBack>
                                <AboxTeam
                                    details={{ assignee, owner, createdBy, teamMembers, id }}
                                    type={selection.type}
                                    reloadDetails={this.reloadDetails}
                                />
                            </Modal>
                        )}
                        {showPasteForm && (
                            <Modal onToggle={this.closePasteForm} title="Image form" open={showPasteForm} disableBack>
                                <PasteForm close={this.closePasteForm} attachMessengerFile={this.attachMessengerFile} file={pasteFile} />
                            </Modal>
                        )}
                    </MessengerGrid>
                </DropzoneWrapper>
            </MessengerContainer>
        );
    }

    render() {
        return (
            <Fragment>
                {this.renderChatWindow(this.props, this.state)}
            </Fragment>
        );
    }
}

export default connect(
    state => ({
        profile: state.user.profile,
        showMessenger: state.chat.showMessenger,
        messages: state.chat.messages,
        selection: state.chat.selection,
        isTask: state.chat.selection.type === 'task',
    }),
    {
        toggleMessenger,
        saveMessage,
        loadMessenger,
        attachMessengerFile,
        showToastr,
        outdateProcessDetails,
        outdateTaskDetails,
        outdateAboxAttachments,
    }
)(Messenger);
