
export const create = createAction => createAction([
	'socketClose',
	socket => socket.close(),
	({ socket, ...state }) => ({
		...state,
		socket: { ...socket, connecting: false } })
])
