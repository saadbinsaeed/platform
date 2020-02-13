/* @flow */

import PropTypes from 'prop-types';

export const ChildrenProp = PropTypes.any;

export const IdProp = PropTypes.any;

export const SizeProps = PropTypes.oneOf([ 'xs', 'sm', 'md', 'lg', 'xl']);

export const PlacementProps = PropTypes.oneOf([ 'auto auto', 'top left', 'top center', 'top right', 'middle left', 'middle center', 'middle right', 'bottom left', 'bottom center', 'bottom right' ]);

export const IconTypeProps = PropTypes.oneOf([ 'mdi', 'af']);

export const HeaderTagProps = PropTypes.oneOf([ 'h1', 'h2', 'h3', 'h4', 'h5']);

export const UserStatusProps = PropTypes.oneOf([ 'online', 'offline', 'disabled', 'busy']);

export const entitiesTypes = {
    thing: 'Things',
    person: 'People',
    organisation: 'Organisations',
    custom: 'Custom Entities',
};
export const bpmnTypes = {
    process: 'Processes',
    task: 'Tasks',
};
export const allTypes = { ...entitiesTypes, ...bpmnTypes };

export const allTypesProps = PropTypes.oneOf(Object.keys(allTypes));

/**
 * Build the match property injected by the redux-router using the function withRouter.
 *
 * @param paramsTypes an object that describe the type of the parameters that are parsed in the url.
 *
 * @example
 *
 * static propTypes = {
 *     match: RouterMatchPropTypeBuilder({ id: PropTypes.string.isRequired }),
 * };
 */
export const RouterMatchPropTypeBuilder = ( paramsTypes: ?Object ) => (
    PropTypes.shape({
        path: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        isExact: PropTypes.bool.isRequired,
        params: paramsTypes ? PropTypes.shape( paramsTypes ).isRequired : PropTypes.object,
    }).isRequired
);
