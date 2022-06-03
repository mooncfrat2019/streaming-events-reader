import React, {createContext, FC, PropsWithChildren, useReducer} from 'react';
import {Actions, ContextProps, Reducer, ReducerAction, State} from "../../types";

const initialState: State = {
    history: [],
    activeView: 'START',
    activePanel: 'DASHBOARD',
};

const actions: Actions = {
  add: (prevState: State, item: string) => ({
    ...prevState,
    history: [...prevState.history, item],
  }),
};

const reducer: Reducer = (state, action: ReducerAction) => (actions[action.type]) ? actions[action.type](state, action.payload) : state;

export const StateContext = createContext<ContextProps>({
    state: initialState,
    dispatch: (state) => state,
});

export const StateProvider: FC<PropsWithChildren<any>> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <StateContext.Provider value={{ state, dispatch }}>{props.children}</StateContext.Provider>;
};
