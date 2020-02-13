// @flow

import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { onlyUpdateForKeys } from 'recompose';
import styled from 'styled-components';
import moment from 'moment';

import { AttachmentLink, formatBytes, chooseIcon, getExtension, isInvalidExtension, isInvalidSize } from 'app/utils/attachments/attachmentsUtils';
import VirtualListManaged from 'app/components/molecules/VirtualList/VirtualListManaged';
import ListItem from 'app/components/molecules/List/ListItem';
import { showToastr } from 'store/actions/app/appActions';
import Filters from 'app/components/organisms/Filters/Filters';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import Icon from 'app/components/atoms/Icon/Icon';
import UploadButton from 'app/components/molecules/UploadButton/UploadButton';
import ResponsiveActions from 'app/components/molecules/ResponsiveActions/ResponsiveActions';
import DropzoneWrapper from 'app/components/molecules/Dropzone/DropzoneWrapper';
import { loadAboxAttachments, deleteAboxAttachment, uploadAboxAttachment } from 'store/actions/abox/aboxActions';

const AttachmentIcon = onlyUpdateForKeys(['item'])((props: Object) => {
    const { mimeType, id } = props.item;
    const iconName = chooseIcon(mimeType);
    return (
        <AttachmentLink id={id}>
            <Icon name={iconName} size="lg" />
        </AttachmentLink>
    );
});

const ListItemStyled = styled(ListItem)`
width: 100%;
max-width: 1024px;
margin: 0 auto;
`;

const DropzoneWrapperFull = styled(DropzoneWrapper)`
height: calc(100vh - 240px);
`;

/**
 * Renders the view to display the classification.
 */
class AboxAttachments extends PureComponent<Object, Object> {

    static propTypes = {
        type: PropTypes.string,
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        outdated: PropTypes.bool,
        startIndex: PropTypes.number,
        totalRecords: PropTypes.number,
        loadAboxAttachments: PropTypes.func.isRequired,
        deleteAboxAttachment: PropTypes.func.isRequired,
        uploadAboxAttachment: PropTypes.func.isRequired,
        showToastr: PropTypes.func.isRequired,
    };

    // $FlowFixMe
    virtualListRef = React.createRef();

    filterDefinitions = [
        {
            field: 'name',
            type: 'text',
            properties: {
                label: 'Name',
                name: 'name'
            },
        },
        {
            field: 'mimeType',
            type: 'typeahead',
            properties: {
                label: 'Mime Type',
                name: 'mimeType',
                options: [
                    { value: 'image', label:'Image' },
                    { value: 'application', label: 'File' },
                    { value: 'text', label: 'Text' },
                    { value: 'application/octet-stream', label: 'Audio' },
                    { value: 'pdf', label: 'Pdf' },
                ],
            },
            sort: false,
        },
        {
            field: 'createDate',
            type: 'dateTimeRange',
            properties: {
                label: 'Created date',
                name: 'createDate',
            },
        },
    ];

    searchBar = ['name'];
    defaultOrder = [{ field: 'createDate', direction: 'desc' }];

    componentDidUpdate(prevProps: Object) {
        if (!prevProps.outdated && this.props.outdated) {
            this.refresh();
        }
    }

    refresh = () => {
        this.virtualListRef.current && this.virtualListRef.current.resetView();
    };

    /**
     *
     */
    uploadFile = (file: any) => {
        if (isInvalidExtension(file)) {
            this.props.showToastr({ severity: 'warn', detail: 'Invalid file type Please upload a valid file!' });
        } else if (isInvalidSize(file)) {
            this.props.showToastr({ severity: 'warn', detail: 'Maximum file size limit which is 50MB exceeded!' });
        } else {
            return this.props.uploadAboxAttachment(this.props.match.params.id, this.props.type, file);
        }
    };

    uploadAttachment = (files) => {
        const fileArray = Array.isArray(files) ? files : Object.values(files);
        return Promise.all(fileArray.map(file => this.uploadFile(file))).then(this.refresh);
    }


    buildRemoveAttachment = (id: number) => () => {
        this.props.deleteAboxAttachment(id).then(this.refresh);
    };

    renderComponent = (props: Object) => {
        const { data, index, style } = props;
        return (
            <div key={index} style={style}>
                <ListItemStyled
                    component={<AttachmentIcon item={data} />}
                    title={<AttachmentLink id={data.id}>{data.name}</AttachmentLink>}
                    subTitle={`${getExtension(data.mimeType)} - ${formatBytes(data.size)} ${moment(data.createDate).from(moment())}`}
                    actions={
                        <ResponsiveActions actions={[
                            <AttachmentLink id={data.id} key="1">
                                <Icon name="download" />
                            </AttachmentLink>,
                            <Icon name="delete" onClick={this.buildRemoveAttachment(data.id)} key="2"/>
                        ]} />
                    }
                    raised
                />
            </div>
        );
    };

    loadAttachments = (options: Object) => {
        const id = this.props.match.params.id;
        return this.props.loadAboxAttachments(id, this.props.type, options);
    }

    /**
     * @override
     */
    render() {
        const { records, isLoading, totalRecords, startIndex, match } = this.props;
        return (
            <Fragment>
                <Filters
                    id={`AboxAttachments.${match.params.id}`}
                    filterDefinitions={this.filterDefinitions}
                    defaultOrder={this.defaultOrder}
                    searchBar={this.searchBar}
                >
                    {(filterBy, orderBy) => (
                        <DropzoneWrapperFull
                            onDropRejected={this.uploadAttachment}
                            onDropAccepted={this.uploadAttachment}
                        >
                            <VirtualListManaged
                                ref={this.virtualListRef}
                                renderComponent={this.renderComponent}
                                itemSize={100}
                                itemCount={totalRecords || 0}
                                loadData={this.loadAttachments}
                                isLoading={isLoading}
                                startIndex={startIndex || 0}
                                filterBy={filterBy}
                                orderBy={orderBy}
                                list={records}
                                maxWidth="1024"
                            />
                        </DropzoneWrapperFull>
                    )}
                </Filters>
                <FooterBar>
                    <UploadButton label="Upload" loading={false} onSelect={this.uploadAttachment} multiple />
                </FooterBar>
            </Fragment>
        );
    }
}

export default connect(state => ({
    records: state.abox.attachments.records,
    outdated: state.abox.attachmentsOutdated, // this flag is true if the list of records is outdated
    isLoading: state.abox.attachments.isLoading,
    totalRecords: state.abox.attachments.count,
    startIndex: state.abox.attachments.startIndex,
}), {
    showToastr,
    loadAboxAttachments,
    deleteAboxAttachment,
    uploadAboxAttachment,
})(AboxAttachments);
