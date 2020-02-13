
import styled from 'styled-components';

import { Select } from '@mic3/platform-ui';
import Filters from 'app/components/organisms/Filters/Filters';

export const TimelineToolbarSelect = styled(Select)`
    min-width: 150px;
    margin-left: 12px;

    #select-range {
        &:focus {
            background-color: transparent;
        }
    }
`;

export const FiltersTimeline = styled(Filters)`
    background: #343a45;

    .filter-toolbar {
        box-shadow: 0 0 3px #000;
        padding-bottom: 0;
    }

    .filter-chips {
        margin: 24px 12px;
    }

    .page-content {
        height: 100%;
    }

    div[class*='Filters__Content'] {
        max-height: 100%;
    }
`;

export const Label = styled.strong`
`;