
export const create = createAction => createAction([
	'socketEventFromServer',
	async (evt, data, handler, reducer) => {
		const result = await handler(data)
		return result
			? { evt, reducer, ...result }
			: false
	},
	(preState, { reducer, ...action }) => ({
		...preState,
		...reducer(preState, action)
	})
])
