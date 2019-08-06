
export const create = createAction => createAction([
	'socketRemoveAllListeners',
	socket => { socket.removeAllListeners() },
	({ socket, ...state }) => ({
		...state,
		socket: { ...socket, eventListeners: { on: [], once: [] } }
	})
])
