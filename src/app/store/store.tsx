import React from 'react'
import {useEffect} from 'react';
import { initRedoox } from 'redoox'
import { Reducer } from './reducer'
import { InitialState, IState } from './state'

export interface IAppState extends IState {}

const { Provider, useRedux } = initRedoox(Reducer, InitialState);
export { Provider, useRedux }

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
