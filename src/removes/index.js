
export const create = (createAction, socket) => {
	const getListenersWithoutEvent = (oldListeners, evt) =>
		Object.keys(oldListeners).reduce((listeners, listenerType) => {
			if (!listeners[listenerType]) {
				listeners[listenerType] = {}
			}
			listeners[listenerType] =
				Object.keys(oldListeners[listenerType]).reduce((newListenerType, e) => {
					if (e !== evt) {
						newListenerType[e] = oldListeners[listenerType][e]
					}
					else {
						newListenerType[e] = false
					}
					return newListenerType
				}, {})
			return listeners
		}, {})

	const getAllEvents = listeners =>
		Object.keys(listeners).reduce((events, listenerType) =>
			events.concat(Object.keys(listeners[listenerType]))
		, [])

	createAction([
		'socketRemoveListener',
		evt => {
			socket.removeListener(evt)
			return { evt }
		},
		({ socket: { listeners, ...socket }, ...state }, { evt }) => ({
			...state,
			socket: { listeners: getListenersWithoutEvent(listeners, evt), ...socket }
		})
	])

	createAction([
		'socketRemoveAllListeners',
		listeners => {
			const events = getAllEvents(listeners)
			events.forEach(evt => socket.removeListener(evt))
			return { events }
		},
		({ socket: { listeners, ...socket }, ...state }, { events }) => ({
			socket: {
				listeners: events.reduce(getListenersWithoutEvent, listeners),
				...socket
			}, ...state
		})
	])
}
