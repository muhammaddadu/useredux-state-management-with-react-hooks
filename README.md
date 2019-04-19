# Use Redux State Management with React Hooks
> This repo conains an example of how to use React Hooks with State Management (with the ability to share state between two React apps)

Their are many patterns to software engineering which help solve certain problems. The problem that I faced was the migration of a Application that was built using AngularJS in the pre-transpiler days. The client needed a way to migrate to modern patterns, without huge refatoring and the ability to roll out featues in React. The code-base has a mix of server rendered logic in parralel with micro-apps.

### Packages Used

- [immer](https://www.npmjs.com/package/immer) - Create the next immutable state tree by simply modifying the current tree
- [redoox](https://www.npmjs.com/package/redoox) - Redux state management pattern using React Hooks.
- [reselect](https://www.npmjs.com/package/reselect) - Simple “selector” library for Redux

### Patterns for sharing state between two React apps

To derive the correct pattern for your project, you need to understand the value it would bring.

#### Pattern 1 (API pubSub)

In reality, the most common use-case for needed a shared state is the data that comes from the APIs. Most of the other times, the state contains data on how to render a Component - which does not need to be shared.

This is where the power of pubsub comes in. You can now allow your state to listen to the results of an API call and ensure all the relative places stay upto data. A package such as [postal.js](https://github.com/postaljs/postal.js) can be used.

#### Pattern 2 (Shared Dispatch)

This pattern is a basic form of PubSub that sits on the action dispatch level. Each App would register their instance of Provider with a key. The developer would have the power to dispatch the event to all dispatchers for that action.

##### Library
```jsx
const sharedDispatches: any = {};

export const RegisterContext = ({key = 'default'}: any = {}): any => {
  const [appState, appActions] = useRedux((state: any) => state, {
    shareContext: () => {
      return async (dispatch: any) => {
        sharedDispatches[key].push(dispatch);
      }
    }
  });

  useEffect(() => {
    if (!sharedDispatches[key]) {
      sharedDispatches[key] = []
    }
    appActions.shareContext();
  }, []);

  return null;
}

export const actionAll = ({key = 'default'}: any = {}) =>
  (action: any) => (...args: any) => () => {
    sharedDispatches[key].forEach((dispatch: any) => {
      const actionData = action(...args);
      if (typeof actionData === 'function') {
        actionData(dispatch)
      } else {
        dispatch(actionData);
      }
    })
  };
```

#### Example

```jsx
ReactDOM.render((
  <Provider>
    <span>
      <RegisterContext />
      <Hello compiler="Typescript" framework="React" bundler="Webpack" />
    </span>
  </Provider>
), document.getElementById('root'));

ReactDOM.render((
  <Provider>
    <span>
      <RegisterContext />
      <Hello compiler="Typescript" framework="React" bundler="Webpack" />
    </span>
  </Provider>
), document.getElementById('root2'));
```

```jsx
export function Hello({ framework, compiler, bundler }: HelloProps) {
	const extractState = (state: IAppState) => ({
		users: Selectors.getUsers(state),
		ageSum: Selectors.getAgeSum(state),
	});
	const actionMap = {
		loadUsers: actionAll()(Actions.loadUsers),
		incrementAge: actionAll()(Actions.incrementAge),
		decrementAge: actionAll()(Actions.decrementAge),
	};
	const [appState, appActions] = useRedux(extractState, actionMap);

	const getYounger = (id: string) => () => appActions.decrementAge(id)
	const getOlder = (id: string) => () => appActions.incrementAge(id)
...
```
