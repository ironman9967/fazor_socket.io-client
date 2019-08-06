
import React from 'react'

import uniq from 'lodash.uniq'
import without from 'lodash.without'

import socketio from 'socket.io-client'

import { create as createClose } from './close'
import { create as createConnecting } from './connecting'
import { create as createConnectionChange } from './connection-change'
import { create as createEmit } from './emit'
import { create as createEventFromServer } from './event-from-server'
import { create as createListeners } from './listeners'
import { create as createOpen } from './open'
import { create as createRemoveAllListeners } from './remove-all-listeners'
import { create as createRemoveListener } from './remove-listener'
import { create as createShouldConnect } from './should-connect'

const socket = socketio(undefined, { autoConnect: false })

export const initialState = {
	socket: {
		id: void 0,
		lastPing: void 0,
		connected: false,
		connect: true,
		connecting: false,
		reconnectDelay: 5000
	}
}

export const createActions = createAction => {
	const defEvents = () => ({ ...{ on: [], once: [] } })
	let eventListeners = defEvents()
	const hasEvent = (listener, evt) => eventListeners[listener].includes(evt)
	const addEvent = (listener, evt) =>
		eventListeners[listener] = uniq(eventListeners[listener].concat([ evt ]))
	const removeEvent = evt => {
		eventListeners = Object.keys(eventListeners).reduce((
			newEventListeners,
			listener
		) => {
			newEventListeners[listener] = without(eventListeners[listener], evt)
			return newEventListeners
		}, defEvents())
	}
	const removeAllEvents = () => eventListeners = defEvents()
	const actionCreators = [
		createClose,
		createConnecting,
		createConnectionChange,
		createEmit,
		createEventFromServer,
		createListeners,
		createOpen,
		createRemoveAllListeners,
		createRemoveListener,
		createShouldConnect
	]
	actionCreators.forEach(create => create(createAction, socket, [
		hasEvent, addEvent, removeEvent, removeAllEvents
	]))
}

export const Socket = ({ getFaze }) => {
	const [ state, actions ] = getFaze()
	const { socket: { connect, connecting, connected } } = state
	const { socketOpen, socketClose, socketOn, socketEventFromServer } = actions

	if (connect) {
		if (!connected) {
			if (!connecting) {
				socketOpen(state, actions, socket)
			}
		}
		else {
			socketOn(connected, socketEventFromServer, [
				'fazor_socket.io-client_ping',
				data => data,
				({ socket, ...state }, { id, now: lastPing }) => ({
					...state,
					socket: { ...socket, id, lastPing }
				})
			])
		}
	}
	else if (connected) {
		socketClose(socket)
	}

	return (
		<div />
	)
}
