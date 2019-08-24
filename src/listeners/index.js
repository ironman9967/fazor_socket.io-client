
export const create = (createAction, socket, getDefListeners) => {
	const createListenerAction = listenerType => {
		const listenerName = `socket${
			listenerType.substring(0, 1).toUpperCase()
		}${
			listenerType.substring(1)
		}`
		createAction([
			listenerName,
			(connected, socketEventFromServer, listeners, ...args) => {
				const {
					evt,
					handler = () => ({}),
					reducer
				} = Array.isArray(args[0])
					? { evt: args[0][0], handler: args[0][1], reducer: args[0][2] }
					: typeof args[0] === 'object'
						? { evt: args[0].evt, handler: args[0].handler, reducer: args[0].reducer }
						: { evt: args[0], handler: args[1], reducer: args[2] }
				if (evt && handler) {
					if (connected && listeners[listenerType][evt] === void 0) {
						socket[listenerType](
							evt,
							data => socketEventFromServer(evt, data, handler, reducer)
						)
						return { evt, listenerType }
					}
					return false
				}
				throw new Error(`you must pass ${listenerName} action state, actions`
					+ ` and an object, an array or arguments containing 'evt', 'handler'`
					+ ` and 'reducer' - received ${JSON.stringify.apply(null, args)}`)
			},
			({ socket: { listeners, ...socket }, ...state }, { evt, listenerType }) => {
				const ls = { ...listeners }
				ls[listenerType][evt] = true
				return { ...state, socket: { listeners: ls, ...socket } }
			}
		])
	}
	createListenerAction('on')
	createListenerAction('once')
}
