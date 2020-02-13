// @flow

import React from 'react';
import MediaQuery from 'react-responsive';

import { breakpointsMap } from 'app/themes/breakpoints';

const SmallScreenMin = (props: Object) => <MediaQuery {...props} minWidth={breakpointsMap.sm} />;
const MediumScreenMin = (props: Object) => <MediaQuery {...props} minWidth={breakpointsMap.md} />;
const LargeScreenMin = (props: Object) => <MediaQuery {...props} minWidth={breakpointsMap.lg} />;
const ExtraLargeScreenMin = (props: Object) => <MediaQuery {...props} minWidth={breakpointsMap.xl} />;

export { SmallScreenMin, MediumScreenMin, LargeScreenMin, ExtraLargeScreenMin };
