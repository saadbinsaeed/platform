import styled from 'styled-components';
import FullHeight from 'app/components/atoms/FullHeight/FullHeight';

const DataTableContainer = styled.div`
  max-width: 100%;
  overflow-y: auto;
  overflow-x: auto;
  height: 100%;
  & .ui-datatable-thead th {
    position: relative;
  }
  & .ui-datatable {
    & .ui-cell-data {
        display: block;
        overflow: hidden;
        & div {
            overflow: hidden;
        }
    }
  }
  .ui-datatable-odd:not(.ui-state-highlight) {
      background: rgba(0,0,0,0.1);
  }
  .ui-state-highlight .Icon {
    color: white;
  }

`;

const DataTableFullHeight = styled(FullHeight)`
   background: ${({ theme }) => theme.base.background};
`;


export { DataTableContainer, DataTableFullHeight };
