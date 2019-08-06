
export const create = (createAction, socket) => createAction([
	'socketOpen',
	async ({
		socket: { reconnectDelay }
	}, {
		socketConnecting,
		socketConnectionChange,
		socketRemoveAllListeners
	}) => {
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
			connecting: true
		}
	})
])
