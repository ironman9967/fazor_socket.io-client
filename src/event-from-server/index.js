
export const create = createAction => createAction([
	'socketEventFromServer',
	async (evt, data, handler, reducer) => {
		const result = await handler(data)
		return result
			? { reducer, result }
			: false
	},
	(preState, { reducer, result }) => ({
		...preState,
		...reducer(preState, result)
	})
])
