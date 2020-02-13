import { css } from 'styled-components';
import { lighten } from 'polished';

const primeTheme = css`
  .ui-widget {
    font-family: Roboto, Arial, sans-serif;
    font-size: 0.9em;
  }
  .ui-widget input, .ui-widget select, .ui-widget textarea, .ui-widget button {
    font-family: Roboto, Arial, sans-serif;
    font-size: 1em;
  }
  .ui-widget :active {
    outline: none;
  }
  .ui-widget-content {
    border: 1px solid ${({ theme }) => theme.base.borderColor};
    background: ${({ theme }) => theme.widget.background};
    color: ${({ theme }) => theme.widget.textColor};
  }
  .ui-widget-content a {
    color: ${({ theme }) => theme.widget.linkColor}; // Overriding the styles used in Tag.js
  }
.ui-widget-header {
    border: 1px solid ${({ theme }) => theme.base.borderColor};
    background: ${({ theme }) => theme.widget.backgroundAlt};
    color: ${({ theme }) => theme.widget.header.textColor};
    font-weight: bold;
 }
.ui-widget-header a {
    color: ${({ theme }) => theme.widget.header.textColor};
}
.ui-widget-overlay {
    background: #666666;
    opacity: .50;
    filter: Alpha(Opacity=50);
}

.ui-state-default {
  border: 1px solid ${({ theme }) => theme.base.borderColor};
  background: ${({ theme }) => theme.base.background};
  color: ${({ theme }) => theme.base.textColor};
}
.ui-state-default a {
    color: ${({ theme }) => theme.base.linkColor};
}
.ui-state-active {
    border-color: ${({ theme }) => theme.base.active.borderColor};
    background: ${({ theme }) => theme.base.active.background};
    color: ${({ theme }) => theme.base.active.textColor};
  }
  .ui-state-active a {
    color: ${({ theme }) => theme.base.active.linkColor};
  }

.ui-state-highlight {
    border-color: ${({ theme }) => theme.base.highlight.borderColor};
    background: ${({ theme }) => theme.base.highlight.background};
    color: ${({ theme }) => theme.base.highlight.textColor};
  }
  .ui-state-highlight a {
    color: ${({ theme }) => theme.base.highlight.linkColor};
  }

.ui-state-focus {
    border-color: ${({ theme }) => theme.base.focus.borderColor};
    background: ${({ theme }) => theme.base.focus.background};
    color: ${({ theme }) => theme.base.focus.textColor};
  }
  .ui-state-focus a {
    color: ${({ theme }) => theme.base.focus.linkColor};
  }

.ui-state-error {
  border-color: ${({ theme }) => theme.base.error.borderColor};
  background: ${({ theme }) => theme.base.error.background};
  color: ${({ theme }) => theme.base.error.textColor};
   }
  .ui-state-error a {
    color: ${({ theme }) => theme.base.error.linkColor};
   }

.ui-state-disabled,
.ui-widget:disabled {
    opacity: 0.35;
    filter: Alpha(Opacity=35);
    background-image: none;
    cursor: default !important;
  }
  .ui-state-disabled *,
  .ui-widget:disabled * {
    cursor: default !important;
  }

.ui-inputtext {
  border-color: ${({ theme }) => theme.input.borderColor};
  background: ${({ theme }) => theme.input.background};
  color: ${({ theme }) => theme.input.textColor};
  min-height: ${({ theme }) => theme.input.height};
 }

.ui-inputtext:hover {
  background: ${({ theme }) => theme.input.hover.background};
  color: ${({ theme }) => theme.input.hover.textColor};
  border-color: ${({ theme }) => lighten(0.1, theme.input.hover.background)};
 }

.ui-inputtext.ui-state-focus,
.ui-inputtext:focus {
  outline: 0 none;
  background: ${({ theme }) => theme.input.focus.background};
  border-color: ${({ theme }) => theme.input.focus.borderColor};
  color: ${({ theme }) => theme.input.focus.textColor};
}

.ui-inputgroup .ui-inputgroup-addon {
  border-color: ${({ theme }) => theme.base.borderColor};
  background-color: ${({ theme }) => theme.base.backgroundColor};
  color: ${({ theme }) => theme.base.textColor};
  }

.ui-float-label input.ng-dirty.ng-invalid ~ label {
    color: ${({ theme }) => theme.base.textColor};
  }

.ui-autocomplete .ui-autocomplete-multiple-container:not(.ui-state-disabled):hover {
    border-color: ${({ theme }) => theme.base.borderColor};
 }
.ui-autocomplete .ui-autocomplete-multiple-container:not(.ui-state-disabled).ui-state-focus {
    border-color: ${({ theme }) => theme.base.borderColor};
 }

.ui-autocomplete-panel .ui-autocomplete-list-item:hover {
    border-color: ${({ theme }) => theme.base.active.borderColor};
    background: ${({ theme }) => theme.base.active.background};
    color: ${({ theme }) => theme.base.active.textColor};
 }
.ui-autocomplete-panel .ui-autocomplete-list-item:hover a {
    color: ${({ theme }) => theme.base.active.linkColor};
 }

.ui-chips > ul:not(.ui-state-disabled):hover {
  border-color: ${({ theme }) => theme.base.highlight.borderColor};
 }
.ui-chips > ul:not(.ui-state-disabled).ui-state-focus {
    border-color: ${({ theme }) => theme.base.hover.borderColor};
 }

.ui-button:focus,
.ui-button:enabled:hover,
.ui-fileupload-choose:not(.ui-state-disabled):hover {
    outline: 0 none;
    border-color: ${({ theme }) => theme.base.hover.borderColor};
    background: ${({ theme }) => theme.base.hover.background};
    color: ${({ theme }) => theme.base.hover.textColor};
  }
  .ui-button:focus a,
  .ui-button:enabled:hover a,
  .ui-fileupload-choose:not(.ui-state-disabled):hover a {
    color: ${({ theme }) => theme.base.focus.borderColor};
    }

.ui-button:enabled:active,
.ui-fileupload-choose:not(.ui-state-disabled):active {
    border-color: ${({ theme }) => theme.base.active.borderColor};
    background: ${({ theme }) => theme.base.active.background};
    color: ${({ theme }) => theme.base.active.textColor};
  }

.ui-chkbox-box:not(.ui-state-disabled):not(.ui-state-active):hover {
    border-color: ${({ theme }) => theme.base.hover.borderColor};
    background: ${({ theme }) => theme.base.hover.background};
    color: ${({ theme }) => theme.base.hover.textColor};
  }
  .ui-chkbox-box:not(.ui-state-disabled):not(.ui-state-active):hover a {
    color: ${({ theme }) => theme.base.linkColor};
  }

.ui-radiobutton-box:not(.ui-state-disabled):not(.ui-state-active):hover {
  border-color: ${({ theme }) => theme.base.borderColor};
  background: ${({ theme }) => theme.base.background};
  color: ${({ theme }) => theme.base.textColor};
  }
  .ui-radiobutton-box:not(.ui-state-disabled):not(.ui-state-active):hover a {
    color: ${({ theme }) => theme.base.linkColor};
    }

.ui-dropdown:not(.ui-state-disabled):hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
   }
  .ui-dropdown:not(.ui-state-disabled):hover a {
    color: ${({ theme }) => theme.base.hover.textColor};
  }

.ui-dropdown-panel .ui-dropdown-item:not(.ui-state-highlight):hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
  }

  .ui-dropdown-panel .ui-dropdown-item:not(.ui-state-highlight):hover a {
    color: ${({ theme }) => theme.base.hover.textColor};
   }

.ui-listbox .ui-listbox-header .ui-listbox-filter-container .fa {
  color: ${({ theme }) => theme.base.textColor};
 }

.ui-listbox:not(.ui-state-disabled) .ui-listbox-item:not(.ui-state-highlight):hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-listbox:not(.ui-state-disabled) .ui-listbox-item:not(.ui-state-highlight):hover a {
   color: ${({ theme }) => theme.base.hover.linkColor};
}

.ui-listbox.ui-state-disabled .ui-chkbox-box:not(.ui-state-active):hover {
  border-color: ${({ theme }) => theme.base.disabled.borderColor};
  background: ${({ theme }) => theme.base.disabled.background};
  color: ${({ theme }) => theme.base.disabled.textColor};
}

.ui-multiselect:not(.ui-state-disabled):hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
  }
  .ui-multiselect:not(.ui-state-disabled):hover a {
    color: ${({ theme }) => theme.base.hover.linkColor};
  }

.ui-multiselect-panel .ui-multiselect-item {
    padding: 0.3rem .6rem;
}

.ui-multiselect-panel .ui-multiselect-item:not(.ui-state-highlight):hover {
    border-color: ${({ theme }) => theme.base.hover.borderColor};
    background: ${({ theme }) => theme.base.hover.background};
    color: ${({ theme }) => theme.base.hover.textColor};
  }

  .ui-multiselect-panel .ui-multiselect-item:not(.ui-state-highlight):hover a {
    color: ${({ theme }) => theme.base.hover.linkColor};
  }

.ui-multiselect-panel .ui-multiselect-close {
  color: ${({ theme }) => theme.base.textColor};
 }

 .ui-multiselect-header .ui-multiselect-filter-container {
    width: calc(100% - 40px);
}

.ui-multiselect-panel .ui-multiselect-filter-container .fa {
  color: ${({ theme }) => theme.base.textColor};
 }

.ui-spinner:not(.ui-state-disabled) .ui-spinner-button:enabled:hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-spinner:not(.ui-state-disabled) .ui-spinner-button:enabled:hover a {
    color: ${({ theme }) => theme.base.hover.linkColor};
}

.ui-spinner:not(.ui-state-disabled) .ui-spinner-button:enabled:active {
  border-color: ${({ theme }) => theme.base.active.borderColor};
  background: ${({ theme }) => theme.base.active.background};
  color: ${({ theme }) => theme.base.active.textColor};
}

.ui-selectbutton .ui-button:not(.ui-state-disabled):not(.ui-state-active):hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-selectbutton .ui-button:not(.ui-state-disabled):not(.ui-state-active):hover a {
   color: ${({ theme }) => theme.base.hover.linkColor};
}

.ui-togglebutton:not(.ui-state-disabled):not(.ui-state-active):hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-togglebutton:not(.ui-state-disabled):not(.ui-state-active):hover a {
   color: ${({ theme }) => theme.base.hover.linkColor};
}

.ui-paginator a:not(.ui-state-disabled):not(.ui-state-active):hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-paginator a:not(.ui-state-disabled):not(.ui-state-active):hover a {
  color: ${({ theme }) => theme.base.hover.linkColor};
}

.ui-paginator a {
  color: ${({ theme }) => theme.base.hover.linkColor};
}

.ui-datatable .ui-rowgroup-header a {
  color: ${({ theme }) => theme.base.hover.linkColor};
}

.ui-datatable .ui-multiselect-panel .ui-multiselect-filter-container .fa {
    left: .140em;
    top: .45em;
}
.ui-datatable .ui-multiselect-header .ui-multiselect-close {
    right: .600em;
    top: .400em;
}

.ui-datatable .ui-datatable-thead .ui-state-default:not(input) {
  background: ${({ theme }) => theme.widget.header.backgroundAlt};
}
.ui-datatable th, .ui-datatable td, .ui-datatable tr {
  border-color: ${({ theme }) => theme.base.borderColor} !important;
}

.ui-datatable input {
  min-height: 25px !important;
}

.ui-datatable .ui-sortable-column:not(.ui-state-active):hover {
  background: ${({ theme }) => theme.base.focus.background} !important;
  color: ${({ theme }) => theme.base.focus.textColor};
}

.ui-datatable .ui-row-toggler {
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-datatable tbody.ui-datatable-hoverable-rows > tr.ui-widget-content:not(.ui-state-highlight):hover {
  cursor: pointer;
  background: ${({ theme }) => theme.widget.hover.background};
  color: ${({ theme }) => theme.widget.hover.textColor};
}

.ui-orderlist .ui-orderlist-item:not(.ui-state-highlight):hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-orderlist .ui-orderlist-item:not(.ui-state-highlight):hover a {
  color: ${({ theme }) => theme.base.hover.linkColor};
}

.ui-picklist .ui-picklist-item:not(.ui-state-highlight):hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-picklist .ui-picklist-item:not(.ui-state-highlight):hover a {
  color: ${({ theme }) => theme.base.hover.linkColor};
}

.ui-picklist .ui-picklist-droppoint-highlight {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-picklist .ui-picklist-droppoint-highlight a {
  color: ${({ theme }) => theme.base.hover.linkColor};
}

.ui-picklist .ui-picklist-highlight {
  border-color: ${({ theme }) => theme.base.highlight.borderColor};
  color: ${({ theme }) => theme.base.highlight.linkColor};
}

.ui-picklist .ui-picklist-highlight a {
  color: ${({ theme }) => theme.base.highlight.linkColor};
}

.ui-tree.ui-treenode-dragover {
  border-color: ${({ theme }) => theme.base.active.borderColor};
}

.ui-tree .ui-treenode-content.ui-treenode-selectable .ui-treenode-label:not(.ui-state-highlight):hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

 .ui-tree .ui-treenode-content.ui-treenode-selectable .ui-treenode-label:not(.ui-state-highlight):hover a {
    color: ${({ theme }) => theme.base.hover.linkColor};
 }

.ui-tree .ui-treenode-content.ui-treenode-dragover {
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}


.ui-tree.ui-tree-horizontal .ui-treenode-content.ui-treenode-selectable .ui-treenode-label:not(.ui-state-highlight):hover {
  background-color: inherit;
  color: inherit;
}

.ui-tree.ui-tree-horizontal .ui-treenode-content.ui-treenode-selectable:not(.ui-state-highlight):hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-tree.ui-tree-horizontal .ui-treenode-content.ui-treenode-selectable:not(.ui-state-highlight):hover a {
  color: ${({ theme }) => theme.base.hover.linkColor};
}

.ui-treetable .ui-treetable-row.ui-treetable-row-selectable:not(.ui-state-highlight):hover {
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-organizationchart .ui-organizationchart-node-content.ui-organizationchart-selectable-node:not(.ui-state-highlight):hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-organizationchart .ui-organizationchart-node-content.ui-organizationchart-selectable-node:not(.ui-state-highlight):hover a {
   color: #ffffff;
}

.ui-accordion .ui-accordion-header:not(.ui-state-active):not(.ui-state-disabled):hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-accordion .ui-accordion-header:not(.ui-state-active):not(.ui-state-disabled):hover a {
  color: #ffffff;
}

.ui-fieldset.ui-fieldset-toggleable .ui-fieldset-legend:hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-fieldset.ui-fieldset-toggleable .ui-fieldset-legend:hover a {
  color: #ffffff;
}

.ui-panel .ui-panel-titlebar .ui-panel-titlebar-icon:hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-panel .ui-panel-titlebar .ui-panel-titlebar-icon:hover a {
    color: #ffffff;
}

.ui-tabview .ui-tabview-nav li:not(.ui-state-active):not(.ui-state-disabled):hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-tabview .ui-tabview-nav li:not(.ui-state-active):not(.ui-state-disabled):hover a {
   color: #ffffff;
}

.ui-dialog .ui-dialog-titlebar-icon {
  color: #eeeeee;
 }

.ui-dialog .ui-dialog-titlebar-icon:hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
 }

.ui-dialog .ui-dialog-titlebar-icon:hover a {
    color: #ffffff;
}

.ui-sidebar .ui-sidebar-close {
  color: #eeeeee;
 }

 .ui-sidebar .ui-sidebar-close:hover {
    border-color: ${({ theme }) => theme.base.hover.borderColor};
    background: ${({ theme }) => theme.base.hover.background};
    color: ${({ theme }) => theme.base.hover.textColor};
 }
 .ui-sidebar .ui-sidebar-close:hover a {
    color: #ffffff;
 }

.ui-overlaypanel .ui-overlaypanel-close:hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-overlaypanel .ui-overlaypanel-close:hover a {
  color: #ffffff;
}

.ui-inplace .ui-inplace-display:hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-inplace .ui-inplace-display:hover a {
  color: ${({ theme }) => theme.base.hover.linkColor};
}

.ui-breadcrumb a {
  color: ${({ theme }) => theme.base.linkColor};
}

.ui-menu .ui-menuitem .ui-menuitem-link {
  color: #eeeeee;
 }

.ui-menu .ui-menuitem .ui-menuitem-link:hover {
    border-color: ${({ theme }) => theme.base.hover.borderColor};
    background: ${({ theme }) => theme.base.hover.background};
    color: ${({ theme }) => theme.base.hover.textColor};
    border-color: transparent;
 }

 .ui-menu .ui-menuitem .ui-menuitem-link:hover a {
    color: #ffffff;
  }

.ui-menu .ui-menuitem.ui-menuitem-active > .ui-menuitem-link {
  border-color: ${({ theme }) => theme.base.active.borderColor};
  background: ${({ theme }) => theme.base.active.background};
  color: ${({ theme }) => theme.base.active.textColor};
  border-color: transparent;
}

.ui-menu .ui-menuitem.ui-menuitem-active > .ui-menuitem-link a {
  color: #ffffff;
}

.ui-tabmenu .ui-tabmenu-nav li:not(.ui-state-active):hover {
    border-color: ${({ theme }) => theme.base.hover.borderColor};
    background: ${({ theme }) => theme.base.hover.background};
    color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-tabmenu .ui-tabmenu-nav li:not(.ui-state-active):hover a {
  color: #ffffff;
}

.ui-steps .ui-steps-item:not(.ui-state-highlight):not(.ui-state-disabled):hover {
    border-color: ${({ theme }) => theme.base.hover.borderColor};
    background: ${({ theme }) => theme.base.hover.background};
    color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-steps .ui-steps-item:not(.ui-state-highlight):not(.ui-state-disabled):hover a {
  color: #ffffff;
}

.ui-panelmenu .ui-panelmenu-header:not(.ui-state-active):hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
  border-color: #2e2e2e;
}

.ui-panelmenu .ui-panelmenu-header:not(.ui-state-active):hover a {
  color: #ffffff;
}

.ui-panelmenu .ui-panelmenu-header:not(.ui-state-active):hover a {
  color: #ffffff;
 }
.ui-panelmenu .ui-panelmenu-header.ui-state-active a {
  color: #ffffff;
}
.ui-panelmenu .ui-panelmenu-content .ui-menuitem-link {
  color: #eeeeee;
}

.ui-panelmenu .ui-panelmenu-content .ui-menuitem-link:hover {
    border-color: ${({ theme }) => theme.base.hover.borderColor};
    background: ${({ theme }) => theme.base.hover.background};
    color: ${({ theme }) => theme.base.hover.textColor};
    border-color: transparent;
}

.ui-panelmenu .ui-panelmenu-content .ui-menuitem-link:hover a {
      color: #ffffff;
}

.ui-datepicker .ui-datepicker-header a {
    color: #eeeeee;
}

.ui-datepicker .ui-datepicker-header a:hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-datepicker .ui-datepicker-header a:hover a {
    color: #ffffff;
}

.ui-datepicker .ui-datepicker-calendar td:not(.ui-state-disabled) a:hover {
  border-color: ${({ theme }) => theme.base.hover.borderColor};
  background: ${({ theme }) => theme.base.hover.background};
  color: ${({ theme }) => theme.base.hover.textColor};
}

.ui-datepicker .ui-datepicker-calendar td:not(.ui-state-disabled) a:hover a {
  color: #ffffff;
}

.fc .fc-toolbar .fc-prev-button .ui-icon-circle-triangle-w {
  margin-top: .3em;
  background: none !important;
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-indent: 0px !important;
  text-align: center;
}

.fc .fc-toolbar .fc-prev-button .ui-icon-circle-triangle-w:before {
    content: "";
}

.fc .fc-toolbar .fc-next-button .ui-icon-circle-triangle-e {
  margin-top: .3em;
  background: none !important;
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-indent: 0 !important;
  text-align: center;
}


.fc .fc-toolbar .fc-next-button .ui-icon-circle-triangle-e:before {
    content: "";
 }

.ui-rating a {
  color: #222222;
}

.ui-organizationchart .ui-organizationchart-line-down {
  background-color: #4d4d4d;
   }
.ui-organizationchart .ui-organizationchart-line-left {
  border-right: 1px solid ${({ theme }) => theme.base.borderColor};
   }
.ui-organizationchart .ui-organizationchart-line-top {
  border-top: 1px solid ${({ theme }) => theme.base.borderColor};
   }
.ui-organizationchart .ui-organizationchart-node-content {
  border-color: ${({ theme }) => theme.base.textColor};
  }
.ui-organizationchart .ui-organizationchart-node-content .ui-node-toggler {
  color: ${({ theme }) => theme.base.textColor};
 }

/* Validation */
.ui-inputtext.ui-state-error {
  border-bottom-color: ${({ theme }) => theme.base.borderColor};
   }

/* Cornering */
.ui-corner-tl {
  border-top-left-radius: 3px;
  }

.ui-corner-tr {
  border-top-right-radius: 3px;
  }

.ui-corner-bl {
  border-bottom-left-radius: 3px;
   }

.ui-corner-br {
  border-bottom-right-radius: 3px;
   }

.ui-corner-top {
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
   }

.ui-corner-bottom {
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  }

.ui-corner-right {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  }
.ui-multiselect .ui-multiselect-trigger.ui-corner-right,
.ui-dropdown .ui-dropdown-trigger.ui-corner-right {
    height: 100%;
    width: 2em;
    vertical-align: top;
}
.ui-corner-left {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  }

.ui-corner-all {
  border-radius: 3px;
}
`;

export default primeTheme;
