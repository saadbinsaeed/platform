# Affectli platform

## Requirements

* [node](https://nodejs.org/en/) v8.11.3 (npm v5.6.0)
* [yarn](https://yarnpkg.com/en/) 1.7.0


## Getting started

Compile and run (development mode):

```
yarn
yarn start
```

## Production Build

```
yarn
yarn build
```

## Project structure

### Folders

* config - contains the build and test configurations.
* flow-typed - contains the Flow Type info of some external libraries.
* public - contains the public resources to expose.
* scripts - contains the npm scripts to start (development), to build (production)
  or to test the project.
* src - contains all the source code and resources related to this application
  (this is the project root).
  * app - main application source folder.
    * actions - Redux Actions.
    * auth - SSO authentication manager.
    * components - React Components.
    * config - app configuration.
    * containers - React containers.
    * reducers - Redux reducers.
    * store - Redux store configuration.
    * theme - theme commons.
    * utils - Utilities.
  * assets - contains the application's assets (fonts, icons, ...).
  * meta - contains the project meta info.
  * style - contains the [SASS](http://sass-lang.com/) styles.
  * test - test utilities.
  * App.jsx - App main object.
  * index.js - App startup script.
  * registerServiceWorker.js - service worker used to improve the App performance.
* .eslintrc - [eslint](http://eslint.org/docs/user-guide/configuring) configuration.
* .flowconfig - [Flow](https://flow.org/) configuration.
* .gitignore - git ignore configuration.
* .gitlab-ci.yml - GitLab CI configuration to deploy the app in the CI environments.
* yarn.lock - created and used by yarn to lock the modules versions
  in order to get consistent installs across machines.

### Conventions

#### React Containers and Components

The _/src/app/containers_ folder contains all the React Containers,
while the _/src/app/components_ folder contains all the React Components.

A React Container:

* it concerns with _how things works_.
* it should extends the
  [React.PureComponent](https://facebook.github.io/react/docs/react-api.html#react.purecomponent).
* it can contains Components and/or Containers.
* it uses the Redux connect function to read from the Redux state and to connect Redux Actions.
  The connected Actions can be used directly in the Container
  or can be passed as parameter to the Components.
* it provides the data and behavior to presentational Components or other Containers.
* it can be generated using
  [Higher-Order Components](https://facebook.github.io/react/docs/higher-order-components.html).

A React Component (presentational):

* it concerns with _how things looks_.
* it should extends the
  [React.PureComponent](https://facebook.github.io/react/docs/react-api.html#react.purecomponent).
* it can contains other Components but it must not contains any Containers.
* it must not use the Redux connect function.
* rarely have its own state and it should be written as a
  [functional component](https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#stateless-functional-components).
* it must not be generated using
  [Higher-Order Components](https://facebook.github.io/react/docs/higher-order-components.html)

#### Redux Actions

The _/src/actions_ folder contains all the Redux Actions.
All the generated Redux Actions MUST NOT include properties other than:
* type
* payload
* error
* meta

##### Action Type

The _type_ property is a string that identify the Action,
it is a required field and its value must be unique.

##### Action Payload

The optional _payload_ property MAY be any type of value.
It represents the payload of the action.
Any information about the action that is not the type or status of the action
should be part of the payload field.
By convention, if _error_ property is true, the payload SHOULD be an error object.
The _payload_ must be immutable.

##### Action Error

The optional _error_ property is a boolean and if true indicates that action represents an error.
In case the Action is not an error this property must be omitted rather that setting it to false.

##### Action Meta

The _meta_ property must be an immutable object.
It is optional and it is intended for any extra information that is not part of the payload.


#### Redux Reducers

The _/src/reducers_ folder contains all the Redux reducers.
The relative path of the reducers (starting from the _reducers_ folder)
must reflects the path where we are storing the information in the Redux store.
For example, the eventsListReducer is located in the _src/reducers/stream/events/list_ folder
and it will write in the  _state.stream.events.list_ property of the Redux store.
The reduces is a **pure function**.
A pure function is a function where the return value is only determined by its input values.
A pure function must not mutate the value of any input parameter.
When the reducer has to mutate the state, it has to create and return a new immutable object.
It's good practice define the default values in the reducer to safely access to the value from
the actions and in the components.

#### Routing

To handle the application routing we are using
[react-router](https://reacttraining.com/react-router/).
The main routing configuration is contained in the _src/app/containers/App/index.js_ file.
Here we solve only the first token of the routing path redirecting
to a specific router Component that will handle the route path in deep.

#### Show Messages

To show a message to the end user we are using
[react-redux-toastr](https://github.com/diegoddox/react-redux-toastr).
To display a message when we dispatch an action we only need to add a property to the _meta_ object.

To announce an info we need to set at least one of the following properties:
* infoTitle - the notification's title
* infoMessage - the notification's content
To announce a success we need to set at least one of the following properties:
* successTitle - the notification's title
* successMessage - the notification's content
To announce an warning we need to set at least one of the following properties:
* warnTitle - the notification's title
* warnMessage - the notification's content
To announce an error we need to set at least one of the following properties:
* errorTitle - the notification's title
* errorMessage - the notification's content

These properties are caught in the Affectli Middleware that will properly show the notification.
Even if we don't specify to announce an error, if the action.error flag is true and the
action.meta.errorMessage is not defined the Affectli Middleware will extract the error message from
the payload and it will annunce the error.
For this reason, in the action, we have to specify the error message only when we want to override
the error message that we receive from the server API (this should happen rarely).

Because the messages are related to the actions, the _react-redux-toastr_ module should never used
directly.

### DataTable

Our DataTable is a wrapper of the Primereact DataTable. When you specify the columns definitions of the DataTable it is
important that we specify the type of the column. The valid values for this field are 'number', 'date' or 'text'
(if not specified the column type is 'text'). If the type of the column is not specified correctly the global search of
the Component will not work properly. Based on the type the DataTable will also set the correct filter and renderer for
the column (so you don have to specify them in the column definition).

#### Initial Filters for the DataTable

If you want to apply initial/default filters on your grid you will have to pass the grid setting object to your DataTable as a prop, Your grid setting object will look like

```
const gridSettings = {
        pageSize: 100,
        filters: {
            name: { value: [ 'test'] },  // it will apply the test filter on name column of the grid
        },
        sort: [{ field: 'createDate', direction: 'asc' }],
        globalFilter: { value: '' }
    };
```
- `pageSize`  -  ( Number ) - How many records you want to load.
- `filters` -  (Object) -How you want to filter your column.
- `sort` - (Array) -How you want to sort your grid columns. To sort columns in descending order you will set `asc:  false`
- `globalFilter` - (Object) - It is being used for global searching in grid

## The building tool

This project was bootstrapped with
[Create React App](https://github.com/facebookincubator/create-react-app).
We have ejected the project to be compatible with the previous settings
(the project was not started using create-react-app)

You can find the most recent version of the create-react-app guide
[here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

# Code Quality

## Optimize the React components

### Pure Components

Always use pure Components. If the component is a class, extend tne PureComponent class:

```js
import React, { PureComponent } from 'react';

// A component that is expensive to render
class MyComponent extends PureComponent {...}
```

If the Component is not a class use the 'recompose' module. Recompose helpers like pure() and onlyUpdateForKeys() do it:

```js
import { pure, onlyUpdateForKeys } from 'recompose';

// A component
const ExpensiveComponent = ({ propA, propB }) => {...}

// Optimized version of same component, using shallow comparison of props
// Same effect as extending React.PureComponent
const OptimizedComponent = pure(ExpensiveComponent)

// Or even more optimized: only updates if specific prop keys have changed
const HyperOptimizedComponent = onlyUpdateForKeys(['propA', 'propB'])(ExpensiveComponent)
```

Because we also want to specify the PropTypes of the Component, we will use:

```js
import { compose, pure, setPropTypes } from 'recompose';

// A component
const ExpensiveComponent = ({ propA, propB }) => {...}

export default compose(pure, setPropTypes({
    propA: PropTypes.string.isRequired,
    propB: PropTypes.number,
}))(ExpensiveComponent);
```

or

```js
import { compose, onlyUpdateForKeys, setPropTypes } from 'recompose';

// A component
const ExpensiveComponent = ({ propA, propB }) => {...}

export default compose(onlyUpdateForKeys(['propA', 'propB']), setPropTypes({
    propA: PropTypes.string.isRequired,
    propB: PropTypes.number,
}))(ExpensiveComponent);
```


### Avoid object Literals in JSX

Bad code example:

```js
import React from 'react';
import MyTableComponent from './MyTableComponent';

const Datagrid = (props) => (
    <MyTableComponent style={{ marginTop: 10 }}>
        ...
    </MyTableComponent>
)
```

In the above example, the style prop of the <MyTableComponent> component gets a new value every time the <Datagrid> component is rendered.
So even if <MyTableComponent> is pure, it will be rendered every time <Datagrid> is rendered.
In fact, each time you pass an object literal as prop to a child component, you break purity.
The solution is simple:

```js
import React from 'react';
import MyTableComponent from './MyTableComponent';

const tableStyle = { marginTop: 10 };
const Datagrid = (props) => (
    <MyTableComponent style={tableStyle}>
        ...
    </MyTableComponent>
)
```

### Avoid arrow function declaration in the render method.

Using an arrow function in render creates a new function each time the component renders, which may have performance implications.

Bad code example:

```js
class MyComponent extends PureComponent {
    // ...

    render() {
        // ...
        return <MyButton onClick={() => this.save(this.state.id)}>;
    }
}
```

Good code example:

```js
class MyComponent extends PureComponent {
    // ...

    onSave = () => this.save(this.state.id);

    render() {
        // ...
        return <MyButton onClick={this.onSave}>;
    }
}
```


### Filtering and mutation in the render() method

Bad example:

```js
class MyComponent extends PureComponent {
    // ...

    render() {
        const options = this.props.userList.map(({ id, name }) => { id, label: name });
        return <MySelect options={options}>;
    }
}
```

In the above example every time the render is called the options variable will contains a new Object even if the userList property is not changed.
So even if the Component is pure, it will be rendered every time the render method is called (the purity is broke).
To solve this problem we can use the 'memoize-one' module.
The module will store the results of the function calls and it will returns the cached result when the same inputs occur again:

```js
import memoize from 'memoize-one';
// ...

class MyComponent = (props) => {
    // ...

    buildOptions = memoize((userList) => userList.map(({ id, name }) => { id, label: name }));

    render() {
        const options = this.buildOptions(this.props.userList);
        return <MySelect options={options}>;
    }
}
```

In this way the options variable will contains a new Object only when the userList property is changed.
Naturally the same logic must be applied on components that are not a class.

Bad code:

```js
import MySelect form 'app/component/blabla/MySelect';
// ...

const MyComponent = (props) => {
    const options = props.userList.map(({ id, name }) => { id, label: name });
    return <MySelect options={options}>;
};
```

Good code:

```js
import { pure } from 'recompose';
import memoize from 'memoize-one';
// ...

const buildOptions = memoize((userList) => userList.map(({ id, name }) => { id, label: name }));
const MyComponent = pure((props) => <MySelect options={buildOptions(props.userList)}>);
```

**Notes about the memoize-one module**

The memoize-one module to return the cached result will compare the parameters using the === operator.
If you want to wrap all the parameters in one argument (object) you need to specify the compare function as second parameter, e.g.:
```js
import memoize from 'memoize-one';
import { shallowEquals } from 'app/utils/utils';

const hello = memoize((user) => `Hello ${user.name} ${user.surname}`, shallowEquals);

/*
 * better syntax deconstructing the arguments:
 */
const hello = memoize(({ name, surname }) => `Hello ${name} ${surname}`, shallowEquals);
```

**IMPORTANT:** The function that we memoize must be a **pure function**.


## Main code style conventions

### Imports

**Good practice**

All our paths should have full project path to component or another file.

```javascript
import Text from 'app/components/atoms/Text/Text';
```

**Bad practice**

```javascript
import Text from 'app/components/atoms/Text/Text';
```

### VARS

Naming of our variable we use CamelCase everywhere

**Good practice**

```javascript
const isLoading = true;
```

**Bad practice**

```javascript
var is_loading = true,
	this_thing_is_loading = true,
	//also all our vars name should be clear and simple
	thisIsThingLoading = true;
```


### NEW FILE

All new files should include the flow annotation in the first line.

```javascript
/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
```

### Flow

Add the flow annotations only when it is strictly required

**Good practice**

```javascript
const doSomething = ( varA: Object): String => varA.some + varA.thing;
```

**Bad practice**

```javascript
const doSomething: Function = ( varA: Object): String => varA.some + varA.thing;
// The :Function declaration is implicit here, you don't need to declare it
```


### Containers and Components

The logic to load the data from the backend should be managed in the Containers.
We need to avoid to bind data with a Components, therefore each Component should be data agnostic.

#### Simple idea is:

> A container does data fetching and then renders its corresponding sub-component.

**Structure:**
```
ThingContainer
    |=>	ThingAddComponent
	|=>	ThingListComponent
    |=> ...
```

In the example the ThingContainer will load the data (using a Redux Action or reading the Redux state)
and it will pass the data to render to its Components (through a property).

#### Lifecycle

1. The data pre-fetching must be load in the `componentDidMount` for example:

```javascript
    /**
     * @override
     */
    componentDidMount(): void {
        this.props.loadThing();
    }
```

2. If we need to use the state in a Component/Container,
in `constructure` we should declare the `state` variable and initialize it using some data/logic.

**Good practice**

```javascript
    /**
     * @param props the Component's properties
     */
    constructor(props) {
        super(props);
        this.state = {
            thingForm: props.thing,
            imageError: false
        };
    }
```


3. Avoid the implementation of state related methods that needs flag to indicated
the current lifecycle phase.

**Bad practice**
```javascript
    /**
     * @override
     */
    constructor(props) {
	    super(props);
        this.resetForm(true, props);
    }

	resetForm = (initial: boolean, props: Object) => {
		if (initial){
			this.state = { thing: props.thing };
		} else {
			this.setState({ thing: props.thing });
		}
	}
```

**Good Practice**
```javascript
    /**
     * @override
     */
    constructor(props) {
	    super(props);
        state = this.resetFormData(props);
    }

    /**
     *  someFunction
     */
    resetForm = () {
	    this.setState(this.resetFormData(this.props))
	}
    /**
     * create pure function without side effects
     */
	resetFormData = (newProps) => {
		return { thing: newProps.thing };
	}
```

4. Modify the component state using setState only when required.

**Good practice**

```javascript
    /**
     * @override
     * @param nextProps the properties that the component will receive.
     */
    componentWillReceiveProps(nextProps) {
      if(nextProps.thing !== this.props.thing){
        this.setState({
            thingForm: this.props.thing,
        });
      }
    }
```

**Bad practice** is empty returning in this lifecircle part:
```javascript
    /**
     * @override
     * @param nextProps the properties that the component will receive.
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            thingForm: this.props.thing,
        });
    }
```

5. In the `render` method we should include the Components only when the data that they have to render is available
This will make our Components Pure and more reusable.
The Component have to render only the data passed from the Containers without side effects in logic.

**Good Practice**

```javascript
    /**
     * @override
     */
    render() {
        const { thing, thingLoading } = this.props;
        return thingLoading ? <LoadingComponent /> : (thing && <ThingComponent thing={thing} />);
    }
}
```

**Bad practice**
```javascript
    /**
     * @override
     */
    render() {
        const { thing, thingLoading } = this.props;
        return <ThingComponent thing={thing} thingLoading={thingLoading} />;
    }
}
```

#### Fetching Redux state and load Action functions

```javascript
const mapStateToProps = ( state: Object, ownProps: Obhject): Object => ({
    thing: state.entities.things.data,
    isLoading: state.entities.things.isLoading,
});
export default connect(mapStateToProps, { saveThing, loadThing })( ThingContainer );
```

 - If we load some component data we must naming it with our naming convention.
   If it's thing data it's must naming like `thing`.
 - All logic of data loading should be in `Action`, in Container we call only action function, like `loadThing`.
 - Paths to Redux data should be simple and clear.

**Bad practice**

```javascript
const mapStateToProps: Function = ( state: Object, ownProps: Object): Object => {
    return {
        data: state.entities.things.list.list.data,
    };
};
```
* The property `data` is too generic
* `list.list` it's a bad path.


#### General thoughts

> Be SIMPLE ;)

> Remember that in every moment it's better if you do what you think is best,
not what you should ;)


#### Steal thoughts

> [KISS principle](https://en.wikipedia.org/wiki/KISS_principle)
# platform
