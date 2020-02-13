/* @flow */

import React from 'react';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { HashRouter as Router, Route } from 'react-router-dom';
import { injectGlobal, ThemeProvider } from 'styled-components';
import { PuiProvider } from '@mic3/platform-ui';

import AppRoute from 'app/containers/App/AppRoute';
import theme from 'app/themes/theme.default';
import { client } from 'graphql/client';
import store from 'store/Store';

import 'style/index.scss';

// eslint-disable-next-line no-unused-expressions
injectGlobal`
    *, *:after, *:before {
        box-sizing: border-box;
    }
    *:focus {
        outline: none;
    }
   html {
    height: 100%;
    min-height: 100%;
    font-size: 16px;
    line-height: 1.5;
    font-family: 'Roboto', sans-serif;
   }
  body {
    font-size: 1rem;
    height: 100%;
    position: relative;
    margin:0; padding: 0;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    font-family: 'Roboto', sans-serif;
    background: ${theme.base.background};
  }
   #root, .AppContainer {
        height: 100%;
        position: relative;
        overflow: hidden;
        font-family: 'Roboto', sans-serif;
    }
    .fullHeight {
       height: 100%;
       min-height: 100%;
    }
    .fullHeight.withTabs {
        height: calc(100% - 51px);
        min-height: calc(100% - 51px);
    }
    .fullHeight.withTabsAndFooter {
        height: calc(100% - 113px);
        min-height: calc(100% - 113px);
        overflow: auto;
    }
    .block {
        display: block;
    }
    a {
      cursor: pointer;
    }
    h1 {
        font-size: 1.2em;
    }
    h2 {
        font-size: 1em;
    }
    h3 {
        font-size: .9em;
    }
    h4 {
        font-size: .8em;
    }
    .ui-datepicker-today .ui-state-highlight {
      color: ${theme.base.textColor};
      background: transparent;
    }
    .ui-autocomplete, .ui-autocomplete-multiple-container {
      width: 100% !important;
    }
`;

export const MainApp = () => (
    <PuiProvider>
        <ThemeProvider theme={theme}>
            <ApolloProvider client={client}>
                <Provider store={store}>
                    <div className="app">
                        <Router>
                            <Route path="/" component={AppRoute} />
                        </Router>
                    </div>
                </Provider>
            </ApolloProvider>
        </ThemeProvider>
    </PuiProvider>
);
