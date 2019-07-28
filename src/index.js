
import React, { useEffect } from 'react'

import socketio from 'socket.io-client'

const socket = socketio(undefined, { autoConnect: false })

export const socketInitialState = {
	socket: {
		connected: false,
		connect: true,
		connecting: false,
		reconnectDelay: 5000,
		eventListeners: {
			once: [],
			on: []
		}
	}
}

export const Socket = ({
	useFaze,
	createAction,
	children
}) => {
	const [ getState, getActions ] = useFaze()

	createAction([
		'socketConnectionChange',
		connected => ({ connected }),
		(state, { connected }) => ({
			...state,
			socket: { ...state.socket, connected, connecting: false }
		})
	])
	createAction([
		'socketConnecting',
		connecting => ({ connecting }),
		(state, { connecting }) => ({
			...state,
			socket: { ...state.socket, connecting }
		})
	])
	createAction([
		'socketOpen',
		() => {
			const { socket: { reconnectDelay } } = getState()
			const {
				socketConnectionChange,
				socketConnecting,
				// socketRemoveAllListeners
			} = getActions()
			// socketRemoveAllListeners()
			const t = setTimeout(() => {
				// socketRemoveAllListeners()
				socketConnecting(false)
			}, reconnectDelay)
			socket.once('connect', () => {
				clearTimeout(t)
				socketConnectionChange(true)
			})
			socket.once('disconnect', () => socketConnectionChange(false))
			socket.open()
		},
		state => ({ ...state, socket: { ...state.socket, connecting: true } })
	])
	createAction([
		'socketClose',
		() => socket.close(),
		state => ({ ...state, socket: { ...state.socket, connecting: false } })
	])
	createAction([
		'socketShouldConnect',
		connect => ({ connect }),
		(state, { connect }) => ({ ...state, socket: { ...state.socket, connect } })
	])
	createAction([
		'socketEventFromServer',
		(evt, args, handler, reducer) => ({ evt, reducer, ...handler(args) }),
		(state, { reducer, ...action }) => ({
			...reducer(state, action),
			socket: {
				...state.socket,
				eventListeners: {
					...state.socket.eventListeners,
					once: state.socket.eventListeners.once.reduce((once, eventName) => {
						if (eventName !== action.evt) {
							once.push(eventName)
						}
						return once
					}, [])
				}
			}
		})
	])

	const listenToServer = (listener, evt, handler, reducer) => {
		const { socket: { connected, eventListeners } } = getState()
		if (connected && !eventListeners[listener].includes(evt)) {
			socket[listener](
				evt,
				(...args) => {
					const { socketEventFromServer } = getActions()
					socketEventFromServer(evt, args, handler, reducer)
				}
			)
			return { evt }
		}
		return false
	}
	const reduceEventListenerState = (listenerType, evt, {
		socket: { eventListeners, ...socket },
		...state
	}) => ({
		...state,
		socket: {
			...socket,
			eventListeners: {
				...eventListeners,
				[listenerType]: [
					...eventListeners[listenerType].reduce((otherEventListeners, eventName) => {
						if (!eventName === evt) {
							otherEventListeners.push(eventName)
						}
						return otherEventListeners
					}, []),
					evt
				]
			}
		}
	})
	const createListenerAction = listenerType => createAction([
		`socket${listenerType.substring(0, 1).toUpperCase()}${listenerType.substring(1)}`,
		(evt, handler, reducer) => listenToServer(listenerType, evt, handler, reducer),
		(state, { evt }) => reduceEventListenerState(listenerType, evt, state)
	])
	createListenerAction('on')
	createListenerAction('once')

	createAction([
		'socketRemoveAllListeners',
		() => { socket.removeAllListeners() },
		({ socket, ...state }) => ({
			...state,
			socket: { ...socket, eventListeners: { on: [], once: [] } }
		})
	])
	createAction([
		'socketRemoveListener',
		evt => {
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

	useEffect(() => {
		const { socket: { connected, connect, connecting } } = getState()
		const { socketOpen, socketClose } = getActions()
		if (connect) {
			if (!connecting && !connected) {
				socketOpen()
			}
		}
		else if (connected) {
			socketClose()
		}
	})

	return (
		<div> --- Socket --- { children } </div>
	)
}
