
export const create = (createAction, socket) => createAction([
	'socketEmit',
	(...args) => socket.emit.apply(socket, args)
])
