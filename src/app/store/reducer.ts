import { Action } from 'redoox'
import produce from 'immer'

import { IUser } from '../api'
import { InitialState, IState } from './state'
import * as Actions from './actions'

function incrementAge(state: IState, { payload }: Actions.IncrementAge) {
	return produce(state, (draft: any) => {
		const user: any = draft.users.find((user: any) => user.id === payload.id) as IUser
		user.age++
	})
}

function decrementAge(state: IState, { payload }: Actions.DecrementAge) {
	return produce(state, (draft: any) => {
		const user: any = draft.users.find((user: any) => user.id === payload.id) as IUser
		user.age--
	})
}

function loadUsers(state: IState, { payload }: Actions.LoadUsers) {
	return produce(state, (draft: any) => {
		draft.pending = payload.pending
		if (payload.response) {
			draft.users = payload.response
		}
		if (payload.error) {
			draft.error = payload.error
		}
	})
}

const ReducerMap = {
	// Sync
	[Actions.Type.IncrementAge]: incrementAge,
	[Actions.Type.DecrementAge]: decrementAge,
	// Async
	[Actions.Type.LoadUsersRequest]: loadUsers,
	[Actions.Type.LoadUsersSuccess]: loadUsers,
	[Actions.Type.LoadUsersError]: loadUsers,
}

export function Reducer(state: IState = InitialState, action: Action) {
	const reducer = ReducerMap[action.type]
	return reducer(state, action)
}
