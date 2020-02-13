/* @flow */

// $FlowFixMe
import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';

import Button from 'app/components/atoms/Button/Button';
import Field from 'app/components/molecules/Field/Field';
import ModalFooter from 'app/components/molecules/Modal/ModalFooter';
import Form from 'app/components/atoms/Form/Form';
import { useOnChange } from 'app/utils/hook/hooks';

const Image = styled.img`
    max-width: 100%;
`;

const PasteForm = ({ close, attachMessengerFile, file }: Object) => {
    const [filename, onChangeFilename] = useOnChange('');
    const [imgSrc, setImgSrc] = useState(null);
    const attachFile = useCallback((event) => {
        event.preventDefault();
        const newFile = new File([file], `${filename}.jpg`);;
        attachMessengerFile(newFile).then(close);
    }, [filename, file, attachMessengerFile, close]);
    useEffect(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImgSrc(reader.result);
        };
        return reader.readAsDataURL(file);
    }, [file]);
    return (
        <Form>
            <Image alt={filename} src={imgSrc} />
            <Field
                label="File Name"
                name="name"
                value={filename}
                placeholder="Enter the filename"
                onChange={onChangeFilename}
                required
            />
            <ModalFooter>
                <Button type="button" onClick={close}>Cancel</Button>
                <Button disabled={!filename} onClick={attachFile} color="primary">Attach file</Button>
            </ModalFooter>
        </Form>
    );
};

export default PasteForm;
