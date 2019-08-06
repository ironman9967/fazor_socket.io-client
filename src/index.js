
import React from 'react'

import uniq from 'lodash.uniq'
import without from 'lodash.without'

import socketio from 'socket.io-client'

import { create as createClose } from './close'
import { create as createConnecting } from './connecting'
import { create as createConnectionChange } from './connection-change'
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
	const eventListeners = {}
	const removeAllEvents = () => eventListeners = ({ ...{ on: [], once: [] } })
	removeAllEvents()
	const hasEvent = (listener, evt) => eventListeners[listener].includes(evt)
	const addEvent = (listener, evt) =>
		eventListeners[listener] = uniq(eventListeners[listener].concat([ evt ]))
	const removeEvent = evt => Object.keys(eventListeners).forEach(listener =>
		eventListeners[listener] = without(eventListeners[listener], evt))
	[
		createClose,
		createConnecting,
		createConnectionChange,
		createEventFromServer,
		createListeners,
		createOpen,
		createRemoveAllListeners,
		createRemoveListener,
		createShouldConnect
	].forEach(create => create(createAction, socket, [
		hasEvent, addEvent, removeEvent, removeAllEvents
	]))
}

export const Socket = ({ getFaze }) => {
	const [ state, actions ] = getFaze()
	const { socket: { connect, connecting, connected } } = state
	const { socketOpen, socketClose, socketOn } = actions

	if (connect) {
		if (!connected) {
			if (!connecting) {
				socketOpen(state, actions, socket)
			}
		}
		else {
			socketOn(state, actions, [
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
