// @flow

// $FlowFixMe
import React, { Suspense } from 'react';

import Loader from 'app/components/atoms/Loader/Loader';
import ErrorBoundary from 'app/components/atoms/ErrorBoundary/ErrorBoundary';

const lazyComponent = (Component: Object) => (props: Object) => (
    <ErrorBoundary>
        <Suspense fallback={<Loader absolute backdrop />}>
            <Component {...props} />
        </Suspense>
    </ErrorBoundary>
);

export default lazyComponent;
