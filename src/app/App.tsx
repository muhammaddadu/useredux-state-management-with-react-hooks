import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, RegisterContext } from './store/store'
import { Hello } from './components/Hello';
declare let module: any

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

if (module.hot) {
  module.hot.accept();
}
