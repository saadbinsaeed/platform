// @flow
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { onlyUpdateForKeys } from 'recompose';
import styled from 'styled-components';
import { loadEntityAttachments, deleteEntityAttachment, attachEntityFile } from 'store/actions/common/attachmentsActions';
import { formatBytes, chooseIcon, getExtension, isInvalidExtension, isInvalidSize } from 'app/utils/attachments/attachmentsUtils';
import VirtualListManaged from 'app/components/molecules/VirtualList/VirtualListManaged';
import ListItem from 'app/components/molecules/List/ListItem';
import { showToastr } from 'store/actions/app/appActions';
import Filters from 'app/components/organisms/Filters/Filters';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import Icon from 'app/components/atoms/Icon/Icon';
import UploadButton from 'app/components/molecules/UploadButton/UploadButton';
import ResponsiveActions from 'app/components/molecules/ResponsiveActions/ResponsiveActions';
import DropzoneWrapper from 'app/components/molecules/Dropzone/DropzoneWrapper';
import affectliSso from 'app/auth/affectliSso';
import { fromNow } from 'app/utils/date/date';
import { bind } from 'app/utils/decorators/decoratorUtils';
import { serialPromises } from 'app/utils/utils';

const AttachmentIcon = onlyUpdateForKeys(['item'])((props: Object) => {
    const { mimeType } = props.item;
    const iconName = chooseIcon(mimeType);
    return (
        <AttachmentLinkRenderer data={props.item}>
            <Icon name={iconName} size="lg" />
        </AttachmentLinkRenderer>
    );
});

const ListItemStyled = styled(ListItem)`
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
`;

const Link = styled.a`
    text-decoration: none;
`;

const DropzoneWrapperFull = styled(DropzoneWrapper)`
height: calc(100vh - 240px);
`;

const AttachmentLinkRenderer = ({ data, children }: Object) => {
    const { createdDate } = data;
    let url = data.url;
    if (url.includes('/api/rsc/')) {
        url = url.replace('/api/rsc/', '/graphql/file/');
    }
    return (
        <Link target="_blank" rel="noopener noreferrer" download href={`${url}/download?created=${createdDate}&token=${affectliSso.getToken()}`}>
            {children}
        </Link>
    );
};

/**
 * Renders the view to display the entity attachments.
 */
class EntityAttachmentsView extends PureComponent<Object, Object> {
    static propTypes = {
        entityId: PropTypes.string.isRequired,
        entityType: PropTypes.oneOf(['thing', 'person', 'organisation', 'custom']).isRequired,
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        startIndex: PropTypes.number,
        totalRecords: PropTypes.number,
        loadEntityAttachments: PropTypes.func.isRequired,
        deleteEntityAttachment: PropTypes.func.isRequired,
        attachEntityFile: PropTypes.func.isRequired,
        showToastr: PropTypes.func.isRequired
    };

    canEdit: boolean = false;

    constructor(props: Object) {
        super(props);
        const {
            entityType,
            userProfile: { permissions, isAdmin }
        } = props;
        const permissionsSet = new Set(permissions || []);

        if (entityType === 'thing') {
            this.canEdit = isAdmin || permissionsSet.has('entity.thing.edit');
        } else if (entityType === 'organisation') {
            this.canEdit = isAdmin || permissionsSet.has('entity.organisation.edit');
        } else if (entityType === 'custom') {
            this.canEdit = isAdmin || permissionsSet.has('entity.custom.edit');
        } else {
            this.canEdit = isAdmin || permissionsSet.has('entity.person.edit');
        }
    }

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
                    { value: 'image', label: 'Image' },
                    { value: 'application', label: 'File' },
                    { value: 'text', label: 'Text' },
                    { value: 'application/octet-stream', label: 'Audio' },
                    { value: 'pdf', label: 'Pdf' }
                ]
            },
        },
        {
            field: 'createdDate',
            type: 'dateTimeRange',
            properties: {
                label: 'Created date',
                name: 'createdDate',
            },
        },
    ];

    searchBar = ['name'];
    defaultOrder = [{ field: 'createdDate', direction: 'desc' }];

    @bind
    resetView() {
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
            this.props.attachEntityFile(this.props.entityId, file).then(this.resetView);
        }
    };

    uploadAttachment = (files) => {
        const fileArray = Array.isArray(files) ? files : Object.values(files);
        serialPromises(fileArray, file => this.uploadFile(file));
    };

    buildRemoveAttachment = (name: string) => () => {
        this.props.deleteEntityAttachment(this.props.entityId, name).then(this.resetView);
    };

    @bind
    renderComponent(props: Object) {
        const { data, index, style } = props;
        return (
            <div key={index} style={style}>
                <ListItemStyled
                    component={<AttachmentIcon item={data} />}
                    title={<AttachmentLinkRenderer data={data}>{data.name}</AttachmentLinkRenderer>}
                    subTitle={`${getExtension(data.mimeType)} - ${formatBytes(data.size)} ${fromNow(data.createdDate)}`}
                    actions={
                        <ResponsiveActions
                            actions={[
                                <AttachmentLinkRenderer data={data} key="1">
                                    <Icon name="download" />
                                </AttachmentLinkRenderer>,
                                this.canEdit ? <Icon name="delete" onClick={this.buildRemoveAttachment(data.name)} key="2" /> : null
                            ]}
                        />
                    }
                    raised
                />
            </div>
        );
    };

    loadAttachments = (options: Object) => {
        const { entityId, entityType } = this.props;
        return this.props.loadEntityAttachments(entityId, entityType, options);
    };

    /**
     * @override
     */
    render() {
        const { records, isLoading, totalRecords, startIndex, entityId, entityType } = this.props;

        return (
            <Fragment>
                <Filters
                    id={`EntityAttachmentsView.${entityType}.${entityId}`}
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
                <FooterBar>{this.canEdit ? <UploadButton multiple label="Upload" loading={false} onSelect={this.uploadAttachment} /> : null}</FooterBar>
            </Fragment>
        );
    }
}

export default connect(
    state => ({
        userProfile: state.user.profile,
        startIndex: state.entities.attachments.startIndex,
        isLoading: state.entities.attachments.isLoading,
        isDownloading: state.entities.attachments.isDownloading,
        records: state.entities.attachments.records,
        totalRecords: state.entities.attachments.count,
        count: state.entities.attachments.count,
        countMax: state.entities.attachments.countMax
    }),
    {
        showToastr,
        loadEntityAttachments,
        deleteEntityAttachment,
        attachEntityFile
    }
)(EntityAttachmentsView);
