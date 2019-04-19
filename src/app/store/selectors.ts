import { createSelector } from 'reselect'
import { IState } from './state'

export const getState = (state: IState) => state

export const getUsers = createSelector(
	[getState],
	(state: any) => {
		return state.users
	},
)

export const getAgeSum = createSelector(
	[getUsers],
	(users: any) => {
		return users.reduce((acc: any, user: any) => acc + user.age, 0)
	},
)
