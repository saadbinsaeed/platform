/* @flow */

import gql from 'graphql-tag';

export default gql`
    mutation deleteAttachmentMutation($attachmentId: Int!) {
        deleteAttachment(id: $attachmentId)
    }
`;
