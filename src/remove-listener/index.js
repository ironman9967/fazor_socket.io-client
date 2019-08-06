
export const create = (createAction, socket, [ , , remove ]) => createAction([
	'socketRemoveListener',
	evt => {
		remove(evt)
		socket.removeListener(evt)
		return { evt }
	}
])
