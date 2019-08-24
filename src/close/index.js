
export const create = (createAction, socket) => createAction([
	'socketClose',
	() => { socket.close() },
	({ socket, ...state }) => ({
		...state,
		socket: { ...socket, closing: true, connecting: false } })
])
