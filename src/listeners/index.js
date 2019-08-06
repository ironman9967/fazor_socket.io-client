
export const create = (createAction, socket, [ hasEvent, addEvent ]) => {
	const listenToServer = ({
		socket: { connected }
	}, {
		socketEventFromServer
	}, socket, listener, evt, handler, reducer) => {
		if (connected && !hasEvent(listener, evt)) {
			addEvent(listener, evt)
			socket[listener](
				evt,
				data => socketEventFromServer(evt, data, handler, reducer)
			)
			return { evt }
		}
		return false
	}
	const createListenerAction = listenerType => {
		const listenerName = `socket${
			listenerType.substring(0, 1).toUpperCase()
		}${
			listenerType.substring(1)
		}`
		createAction([
			listenerName,
			(state, actions, ...args) => {
				const {
					evt,
					handler = () => ({}),
					reducer = state => ({ ...state })
				} = Array.isArray(args[0])
					? { evt: args[0][0], handler: args[0][1], reducer: args[0][2] }
					: typeof args[0] === 'object'
						? { evt: args[0].evt, handler: args[0].handler, reducer: args[0].reducer }
						: { evt: args[0], handler: args[1], reducer: args[2] }
				if (evt && handler && reducer) {
					return listenToServer(state, actions, socket, listenerType, evt, handler, reducer)
				}
				throw new Error(`you must pass ${listenerName} action state, actions`
					+ ` and an object, an array or arguments containing 'evt', 'handler'`
					+ ` and 'reducer' - received ${JSON.stringify.apply(null, args)}`)
			}
		])
	}
	createListenerAction('on')
	createListenerAction('once')
}
