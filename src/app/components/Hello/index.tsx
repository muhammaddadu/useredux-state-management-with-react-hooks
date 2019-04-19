import * as React from 'react';
import { useRedux, IAppState, actionAll } from '../../store/store';
import * as Selectors from '../../store/selectors'
import * as Actions from '../../store/actions'

interface HelloProps {
	compiler: string,
	framework: string,
	bundler: string
}

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
	return (
		<div className='example'>
			<h1>This is a {framework} application using    {compiler} with {bundler}</h1>
			<div>
				<button className='btn' onClick={appActions.loadUsers}>
					Load Users
				</button>
			</div>
			<br />
			{appState.users.length === 0 && <div>No users yet.</div>}
			{appState.users.length > 0 && (
				<>
					<div className='users'>
						{appState.users.map((user: any) => (
							<div key={user.id} className='user'>
								<div className='info'>
									<div>Name: {user.name}</div>
									<div>Age: {user.age}</div>
								</div>
								<div>
									<button onClick={getYounger(user.id)}>Get younger</button>
									<button onClick={getOlder(user.id)}>Get older</button>
								</div>
							</div>
						))}
					</div>
					<div className='age-sum'>Age SUM: {appState.ageSum}</div>
				</>
			)}
		</div>
	)
}
