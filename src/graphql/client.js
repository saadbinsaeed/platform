/*@flow*/

import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import HttpFetch from 'app/utils/http/HttpFetch';
// import { persistCache } from 'apollo-cache-persist';

import affectliSso from 'app/auth/affectliSso';
import { get } from 'app/utils/lo/lo';
import { isDev } from 'app/utils/env';

const httpLink = createHttpLink({
    uri: String('/graphql'),
    credentials: 'same-origin'
});

const cache = new InMemoryCache({ addTypename: false });
// This should allow us to persist the cache to local storage, or use localForage
/*
persistCache({
    cache,
    storage: window.localStorage,
});
*/

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            Authorization: affectliSso.getBearerToken(),
        }
    };
});
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
});

/**
 * The application GraphQL client wrapper.
 */
class GraphQlClient {

    client: Object;

    /**
     *
     */
    constructor(apolloClient: Object) {
        this.client = apolloClient;
    }


    handleResponse = (response: Object) => {
        if (response.errors) {
            const message = get(response, 'errors[0].message') || 'Server error.';
            throw new Error(message);
        }
        return response;
    }

    handleError = (error: Object, options: Object) => {
        const definitions = get(options, 'query.definitions') || get(options, 'mutation.definitions');

        // eslint-disable-next-line no-console
        console.log(
            '[GraphQlClient] an error occured executing', Array.isArray(definitions) && definitions.map(def => def.name && def.name.value).join(' '),
            ', variables:', get(options, 'variables'),
            ', error:', error
        );
        const message = get(error, 'networkError.result.errors[0].message');
        if (message) {
            throw new Error(message);
        }
        if (Array.isArray(error.graphQLErrors)) {
            throw new Error(error.graphQLErrors.map(({ message }) => message).join('\n'));
        }
        if (typeof error.message === 'string') {
            if (error.message.startsWith('Network error: Unexpected token')) {
                throw new Error('Service error.');
            }
            throw new Error(error.message);
        }
        throw error;
    }

    /**
     * Wraps the ApolloClient to fail in case of errors.
     */
    query(options: Object) {
        // eslint-disable-next-line no-console
        isDev && console.debug('[dev] graphql executing query', options.query.definitions.map(def => def.name && def.name.value).join(' '));
        return this.client.query(options)
            .then(this.handleResponse)
            .catch(error => this.handleError(error, options));
    }

    mutate(options: Object) {
        // eslint-disable-next-line no-console
        isDev && console.debug('[dev] graphql executing mutation', options.mutation.definitions.map(def => def.name && def.name.value).join(' '));
        return this.client.mutate(options)
            .then(this.handleResponse)
            .catch(error => this.handleError(error, options));
    }

    upload(options: { query: string, variables: Object, file: File }) {
        const { query, variables, file } = options;
        return HttpFetch.postForm('graphql', { query, variables }, file)
            .then(this.handleResponse)
            .catch(error => this.handleError(error, options));
    }
}

const graphql = new GraphQlClient(client);

export { client, graphql };
