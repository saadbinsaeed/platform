// @flow
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import UploadButton from '../UploadButton/UploadButton';
import Avatar from '../Avatar/Avatar';

const ImageLoaderStyle = styled.aside`
   display: inline-block;
   border: solid 1px ${({theme}) => theme.base.borderColor};
   border-radius: .2rem;
   margin: 0 0 1rem 0;
   background: ${({ theme }) => theme.widget.background };
   box-shadow: ${({ theme }) => theme.shadow.z1 };
`;

const ImageUploadTitle = styled.header`
   font-size: 0.7rem;
   padding: 0.2rem .5rem;
   border-bottom: solid 1px ${({theme}) => theme.base.borderColor};
`;

const UploadWrapper = styled.div`
   display: flex;
`;

const ImageCol = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 1rem;
`;

const UploadCol = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 1rem;
   border-left: solid 1px ${({theme}) => theme.base.borderColor};
   & button {
      margin-left: 0;
   }
`;
/**
 * Component to show a image upload box
 */
class ImageUploader extends PureComponent<Object, Object> {

    static propTypes = {
        image: PropTypes.string,
        error: PropTypes.string,
        uploadFunction: PropTypes.func,
        isUploading: PropTypes.bool,
        canEdit: PropTypes.bool,
        title: PropTypes.string,
        name: PropTypes.string
    };

    render() {
        const { image, error, uploadFunction, isUploading, canEdit, title, name } = this.props;
        return <ImageLoaderStyle>
            { title && <ImageUploadTitle>{title}</ImageUploadTitle> }
            <UploadWrapper>
                <ImageCol>
                    { error ? '' : <Avatar src={image} name={name || 'NA'} size="lg" /> }
                </ImageCol>
                <UploadCol>
                    { !canEdit ? null : <UploadButton label="Upload" loading={isUploading} onSelect={uploadFunction} id="img" icon="image" placeholder="Upload an image" /> }
                </UploadCol>
            </UploadWrapper>
        </ImageLoaderStyle>;
    }
}

export default ImageUploader;
