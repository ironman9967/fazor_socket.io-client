
export const create = (createAction, socket, getDefListeners) => createAction([
	'socketOpen',
	async (
		reconnectDelay,
		socketConnecting,
		socketConnectionChange,
		socketRemoveAllListeners
	) => {
		socket.removeAllListeners()
		const t = setTimeout(() => {
			socketConnecting(false)
		}, reconnectDelay)
		socket.once('connect', () => {
			clearTimeout(t)
			socketConnectionChange(true)
		})
		socket.once('disconnect', () => {
			socketConnectionChange(false)
		})
		socket.open()
	},
	({ socket, ...state }) => ({
		...state,
		socket: {
			...socket,
			closing: false,
			connecting: true,
			listeners: getDefListeners()
		}
	})
])
