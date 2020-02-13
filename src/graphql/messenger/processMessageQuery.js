import gql from 'graphql-tag';

export default gql`
query processMessageQuery($id: String) {
    result: process(id: $id) {
        id
        name
        comments {
            id
            createDate
            message
            createdBy {
                id
                login
                image
                name
            }
       }
       teamMembers {
         id
         type
         createdDate
         user {
           id
           name
           login
           image
         }
         group {
           id
           name
           users {
             id
             name
             image
             login
             active
           }
         }
       }
       createdBy {
            id
            login
            image
            name
        }
        attachments {
            id
        }

    }
}`;
