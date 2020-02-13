import { reversePalette } from 'styled-theme/composer';
import { darken, lighten/*, lighten, rgba, hsla*/ } from 'polished';

import { isDefined } from 'app/utils/utils';
import colorPalette from './palette';
import breakpoints from './breakpoints';
import shadow from './shadow';
import sizes from './sizes';

// const dynHeaderHeight = (window === window.parent) ? '60px' : '0px';

const theme = {};

theme.palette = colorPalette;
theme.sizes = sizes;
theme.reversePalette = reversePalette(theme.palette);
theme.media = breakpoints;
theme.shadow = shadow;

theme.color = {
    primary: '#00a99d',
    secondary: '#066ab1',
    info: '#4FC3F7',
    success: '#81C784',
    warning: '#FF8A65',
    alert: '#FFC107',
    danger: '#FF5722',
    error: '#c62828',
    white: '#FFFFFF',
    gray: '#808080',
    background: '#2c2c2c',
};

theme.statusColors = {
    primary: '#00a99d',
    secondary: '#066ab1',
    info: '#4FC3F7',
    success: '#81C784',
    warning: '#FF8A65',
    alert: '#FFC107',
    danger: '#FF5722',
    error: '#c62828',
};

theme.priorityColors = {
    danger: '#C22525',
    warning: '#E65100',
    alert: '#FFA100',
    info: '#88B342',
    success: '#12A98B',
    disabled: '#808080',
};

theme.priorityGradients = {
    danger: ['#C22525', '#DF4807'] ,
    warning: ['#E65100', '#F27000'],
    alert: ['#FFA100', '#FEB300'],
    info: ['#88B342', '#88B342'],
    success: ['#1FA3B3', '#12A98B'],
    disabled: ['#808080', '#80808077'],
};

theme.fonts = {
    primary: '\'Roboto\', \'Helvetica Neue\', Arial, Helvetica, sans-serif',
    pre: 'Consolas, Liberation Mono, Menlo, Courier, monospace',
    quote: 'Georgia, serif',
};

theme.base = {
    fontSize: '1rem',
    lineHeight: '1.5rem',
    textColor: '#efefef',
    altTextColor: '#aaaaaa',
    linkColor: '#fff',
    placeholderColor: '#888',
    background: theme.color.background,
    borderColor: '#222',
    borderRadius: '.3rem',
    padding: '1rem',
    active: {
        textColor: '#efefef',
        linkColor: '#efefef',
        background: theme.color.primary,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    hover: {
        textColor: '#efefef',
        linkColor: '#efefef',
        background: lighten(0.1, theme.color.background),
        borderColor: 'rgba(0,0,0,0.2)',
    },
    focus: {
        textColor: '#efefef',
        linkColor: '#efefef',
        background: theme.color.background,
        borderColor: 'rgba(0,0,0,0.3)',
    },
    highlight: {
        textColor: '#efefef',
        linkColor: '#ffffff',
        background: theme.color.primary,
        borderColor: lighten(0.2, theme.color.primary),
    },
    disabled: {
        textColor: '#555',
        linkColor: '#efefef',
        background: darken(0.1, theme.color.background),
        borderColor: 'rgba(0,0,0,0.1)',
    },
    error: {
        textColor: '#999',
        linkColor: '#efefef',
        background: lighten(0.1, theme.color.error),
        borderColor: darken(0.1, theme.color.error),
    }
};

theme.modal = {
    backdrop: {
        background: 'rgba(0,0,0,0.5)',
    }
};

theme.prime = {
    default: {
        color: theme.base.textColor,
        border: '#000',
        background: theme.base.background,
        hover: {
            color: theme.base.active.textColor,
            border: theme.base.active.borderColor,
            background: theme.base.active.background,
        }
    },
    highlight: {
        color: theme.base.focus.textColor,
        border: theme.base.focus.borderColor,
        background: theme.base.focus.background
    },
    widget: {}
};

theme.widget = {
    header: {
        textColor: 'white',
        iconColor: 'white',
        background: theme.color.secondary,
        backgroundAlt: '#3A3A3A'
    },
    textColor: theme.base.textColor,
    linkColor: theme.base.textColor,
    background: lighten(0.03, theme.color.background),
    iconColor: 'blue',
    borderColor: theme.base.borderColor,
    borderRadius: theme.base.borderRadius,
    hover: {
        textColor: theme.base.textColor,
        linkColor: theme.base.textColor,
        background: lighten(0.1, theme.color.background),
        iconColor: 'blue',
    }
};

theme.isLightColor = (color) => {
    if(!isDefined(color)) return false;
    const c = (color || '').substring(1); // strip #
    const rgb = parseInt(c, 16); // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff; // extract red
    const g = (rgb >> 8) & 0xff; // extract green
    const b = (rgb >> 0) & 0xff; // extract blue

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 160;
};

theme.input = {
    textColor: theme.base.textColor,
    background: darken(0.1, theme.base.background),
    placeholder: '#777',
    borderColor: theme.base.borderColor,
    borderRadius: '.3rem',
    shadow: 'none',
    height: '40px',
    hover: {
        textColor: theme.base.textColor,
        background: theme.base.background,
        borderColor: darken(0.01, theme.base.borderColor),
    },
    focus: {
        textColor: theme.base.textColor,
        background: darken(0.1, theme.base.background),
        borderColor: theme.base.borderColor,
    },
    active: {
        textColor: theme.base.textColor,
        background: darken(0.1, theme.base.background),
        borderColor: theme.base.borderColor,
    },
    disabled: {
        textColor: theme.base.disabled.textColor,
        background: theme.base.disabled.background,
        borderColor: theme.base.disabled.borderColor,
    },
    error: {
        textColor: theme.base.textColor,
        background: darken(0.1, theme.base.background),
        borderColor: theme.base.borderColor,
    }
};

theme.icon = {
    color: theme.base.textColor
};

theme.summary = {
    nameColor: theme.base.textColor,
    valueColor: theme.color.primary
};

theme.header = {
    background: theme.color.secondary,
    height: '56px',
    textColor: 'white',
    show: true
};

theme.filters = {
    toolbarBackground: 'rgba(0,0,0,0.1)',
};

theme.navigation = {
    background: theme.color.background,
    width: '335px',
    content: {
        text: 'rgba(255,255,255,0.8)'
    }
};

theme.navigation.apps = {
    width: '56px',
    background: darken(0.02, theme.navigation.background)
};

theme.navigation.menu = {
    width: '279px'
};

theme.drawer = {
    background: theme.navigation.background,
    textColor: 'white',
};

theme.pageHeader = {
    height: '0px'
};

theme.tabs = {
    tabRow: {
        height: '51px'
    }
};

theme.bar = {
    height: '50px'
};

theme.progressBar = {
    color: '#cccccc',
};

theme.actionBar = {
    background: '#f5f5f5',
    iconColor: '#666',
};

theme.menu = {
    hover: {
        background: 'rgba(0,0,0,0.2)',
    }
};


theme.layout = {
    content: {
        background: theme.color.background
    },
    navigation: {
        width: '300px',
        background: theme.color.background
    }
};

theme.iconSize = {
    xs: '12px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px'
};

theme.imageSize = {
    xs: '12px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px'
};


export default theme;
