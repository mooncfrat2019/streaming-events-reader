import { Dispatch } from 'react';

export enum ContextActions {
  'add',
  'nav',
}

export interface GenericObject {
  [key: string]: any;
}

export interface GenericReducerActions {
  payload?: GenericObject | undefined;
  type: ContextActions;
}

export interface ContextProps {
  state: State;
  dispatch: Dispatch<ReducerAction>;
}

export interface State {
  history: string[],
  activeView: string,
  activePanel: string,
}

export interface Actions {
  add: (prevState: State, item: string) => State
}

export type ActionNames = 'add';
export type ACtionPayloads = string;

export interface ReducerAction {
  type: ActionNames,
  payload: ACtionPayloads,
}

export type Reducer = (prevState: State, action: ReducerAction) => State;

