
export const create = (createAction, socket, [ , , , removeAll ]) => createAction([
	'socketRemoveAllListeners',
	() => {
		removeAll()
		socket.removeAllListeners()
	}
])
