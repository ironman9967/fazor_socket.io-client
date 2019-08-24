
export const create = createAction => createAction([
	'socketConnectionChange',
	connected => ({ connected }),
	({ socket: { id, lastPing, ...socket }, ...state }, { connected }) => ({
		...state,
		socket: {
			...socket,
			id: connected ? id : void 0,
			lastPing: connected ? lastPing : void 0,
			connected,
			connecting: false,
			closing: false
		}
	})
])
