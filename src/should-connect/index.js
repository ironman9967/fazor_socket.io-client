
export const create = createAction => createAction([
	'socketShouldConnect',
	connect => ({ connect }),
	(state, { connect }) => ({ ...state, socket: { ...state.socket, connect } })
])
