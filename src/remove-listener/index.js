
export const create = createAction => createAction([
	'socketRemoveListener',
	(socket, evt) => {
		socket.removeListener(evt)
		return { evt }
	},
	({ socket: { eventListeners: el, ...socket }, ...state }, { evt }) => ({
		...state,
		socket: {
			...socket,
			eventListeners: Object.keys(el).reduce((nel, type) => {
				nel[type] = el[type].reduce((nelType, e) => {
					if (e !== evt) {
						nelType.push(e)
					}
					return nelType
				}, [])
				return nel
			}, {})
		}
	})
])
