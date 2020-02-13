/* @flow */

import { connect } from 'react-redux';
import AvatarEditor from 'react-avatar-editor';
import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import styled, { css } from 'styled-components';

import { loadUser } from 'store/actions/admin/userManagementAction';
import { loadUserProfile, uploadProfileImage } from 'store/actions/admin/usersActions';
import { showToastr } from 'store/actions/app/appActions';
import Avatar from 'app/components/molecules/Avatar/Avatar';
import Button from 'app/components/atoms/Button/Button';
import Event from 'app/utils/layout/event';
import Flex from 'app/components/atoms/Flex/Flex';
import Icon from 'app/components/atoms/Icon/Icon';
import Modal from 'app/components/molecules/Modal/Modal';
import { get } from 'app/utils/lo/lo';


const AvatarEditorStyled = styled(AvatarEditor)`
    background-color: ${({ theme }) => theme.color.white};
    border-radius: 100rem;
`;
const center = css`
    text-align: center;
    display: block;
    font-size: 4rem;
`;
const AvatarWrapper = styled.div`
    ${center}
`;
const ButtonStyled = styled(Button)`
    padding: .3rem;
`;
const EditorWapper = styled.div`
    ${center};
    font-size: 1rem;
    max-width: 400px;
    margin: 0 auto 1rem auto;
    & > div > div > * {
        margin: 0 .7rem;
    }
`;
const AvatarStyled = styled(Avatar)`
    cursor: pointer;
    margin: auto;
`;
const HiddenInput = styled.input`
    display: none;
`;
const styleColor = [255, 255, 255, 1];
const borderStyle = 0;
const defaultState = key => ({
    showAvatarEditor: false,
    scale: 1,
    rotate: 0,
    inputKey: key + 1,
});

const FlexStyled = styled(Flex)`
    min-height: 1.9rem;
`;

/**
 * Renders the view to show user profile.
 */
class ShowUser extends PureComponent<Object, Object> {

    static propTypes = {
        loadUser: PropTypes.func.isRequired,
        loadUserProfile: PropTypes.func.isRequired,
        uploadProfileImage: PropTypes.func.isRequired,
        showToastr: PropTypes.func.isRequired,
        name: PropTypes.string,
        id: PropTypes.number,
        email: PropTypes.string,
        createdDate: PropTypes.string,
        domain: PropTypes.string,
        imageURL: PropTypes.string,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        isLoading: false,
    };

    editorRef: Object = React.createRef()
    inputRef: Object = React.createRef()

    state: Object = defaultState(0);

    constructor(props: Object) {
        super(props);
        props.loadUser(props.name);
    }

    onClick = ( event: Event ) => {
        if ( !this.props.isLoading && this.inputRef.current ) {
            this.inputRef.current.click();
        }
    }

    onImageSelect = ( event: Event ) => {
        event.preventDefault();
        event.stopPropagation();
        const file = get(this, 'inputRef.current.files[0]');
        if ( file && !this.props.isLoading ) {
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                this.setState({
                    showAvatarEditor: true
                });
            } else {
                this.props.showToastr({ severity: 'error', detail: 'Incorrect format. Accepted formats are png or jpg.' });
            }
        }
    }

    cancelUpload = (event: Event) => this.setState(defaultState(this.state.inputKey));

    uploadCroppedImage = (event: Event) => {
        if (this.editorRef.current) {
            const canvas = this.editorRef.current.getImage();
            const context = canvas.getContext('2d');
            context.globalCompositeOperation = 'destination-over';
            context.fillStyle = '#fff';
            context.fillRect(0, 0, canvas.width, canvas.height);
            if (canvas) {
                canvas.toBlob((blob) => {
                    const image = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
                    this.props.uploadProfileImage(image).then(() => {
                        this.props.loadUserProfile();
                        this.setState(defaultState(this.state.inputKey));
                    });
                }, 'image/jpeg', 1);
            }
        }
        this.setState(defaultState(this.state.inputKey));
    }

    handleChange = (event) => {
        const { name } = event.target;
        const value = parseFloat(event.target.value);
        this.setState({ [name]: value });
    }

    handleRotateLeft = (event) => {
        const { rotate } = this.state;
        this.setState({
            rotate: parseFloat(rotate - 90),
        });
    }

    handleRotateRight = (event) => {
        const { rotate } = this.state;
        this.setState({
            rotate: parseFloat(rotate + 90),
        });
    }

    render(): Object {
        const { name, id, email, domain, createdDate, imageURL } = this.props;
        const { showAvatarEditor } = this.state;
        return (
            <Modal
                title={`${name || ''} (${id}) Profile`}
                footer={<Flex spaceBetween grow></Flex>}
                open
            >
                <Fragment>
                    <HiddenInput key={this.state.inputKey} type="file" name="file" onChange={this.onImageSelect} innerRef={this.inputRef} />
                    {!showAvatarEditor ? (
                        <AvatarWrapper>
                            <AvatarStyled src={imageURL} name={name} alt={name} width="200px" height="200px" onClick={this.onClick} />
                        </AvatarWrapper>
                    ) : (
                        <EditorWapper>
                            <AvatarEditorStyled
                                image={get(this, 'inputRef.current.files[0]', '')}
                                scale={this.state.scale}
                                rotate={this.state.rotate}
                                innerRef={this.editorRef}
                                border={borderStyle}
                                color={styleColor}
                            />
                            <Flex spaceAround wrap grow>
                                <div>Zoom: <input type="range" max="4" min="1" name="scale" step="0.1" value={this.state.scale} onChange={this.handleChange} /></div>
                                <div>
                                    Rotate: <Icon rotate-left name="rotate-left" onClick={this.handleRotateLeft} />
                                    <Icon name="rotate-right" onClick={this.handleRotateRight} />
                                </div>
                            </Flex>
                            <Flex spaceAround wrap grow>
                                <ButtonStyled color="primary" onClick={this.uploadCroppedImage}>Crop and Upload</ButtonStyled>
                                <ButtonStyled color="danger" onClick={this.cancelUpload}>Cancel</ButtonStyled>
                            </Flex>
                        </EditorWapper>
                    )}
                    <h2>{name}</h2>
                    <FlexStyled><Icon name="affectli" type="af" />{name}</FlexStyled>
                    <FlexStyled><Icon name="email" />{email}</FlexStyled>
                    <FlexStyled><Icon name="web" />{domain}</FlexStyled>
                    <h4>About:</h4>
                    <div>Created: {moment(createdDate).format('LLL')}</div>
                </Fragment>
            </Modal>
        );
    }
}
export default connect(
    state => ({
        user: state.admin.users.details.data,
        name: state.user.profile.name,
        id: state.user.profile.id,
        email: state.user.profile.email,
        createdDate: state.user.profile.createdDate,
        domain: state.user.profile.domain,
        imageURL: state.user.profile.image,
    }),
    {
        loadUser,
        uploadProfileImage,
        loadUserProfile,
        showToastr,
    }
)(ShowUser);
