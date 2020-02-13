import gql from 'graphql-tag';

export default gql`
query taskMessageQuery($id: String) {
    result: task(id: $id) {
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
       owner {
          id
          login
          name
          image
      }
      assignee {
          id
          login
          name
          image
      }
      _attachmentsCount
      _childrenCount
    }
}`;
