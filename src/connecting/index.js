
export const create = createAction => createAction([
	'socketConnecting',
	connecting => ({ connecting }),
	(state, { connecting }) => ({
		...state,
		socket: { ...state.socket, connecting }
	})
])
