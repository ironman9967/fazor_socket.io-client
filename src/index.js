
import React, { useEffect } from 'react'

import socketio from 'socket.io-client'

import { create as createClose } from './close'
import { create as createConnecting } from './connecting'
import { create as createConnectionChange } from './connection-change'
import { create as createEmit } from './emit'
import { create as createEventFromServer } from './event-from-server'
import { create as createListeners } from './listeners'
import { create as createOpen } from './open'
import { create as createRemoves } from './removes'
import { create as createShouldConnect } from './should-connect'

const socket = socketio(undefined, { autoConnect: false })

const getDefListeners = () => ({ on: {}, once: {} })

export const initialState = {
	socket: {
		id: void 0,
		lastPing: void 0,
		connected: false,
		connect: true,
		connecting: false,
		closing: false,
		reconnectDelay: 5000,
		listeners: getDefListeners()
	}
}

export const createActions = createAction => {
	const actionCreators = [
		createClose,
		createConnecting,
		createConnectionChange,
		createEmit,
		createEventFromServer,
		createListeners,
		createOpen,
		createRemoves,
		createShouldConnect
	]
	actionCreators.forEach(create => create(createAction, socket, getDefListeners))
}

export const Socket = ({ getFaze }) => {
	const [ state, actions ] = getFaze()

	const {
		socket: {
			connect,
			connected,
			connecting,
			closing,
			reconnectDelay,
			listeners
		}
	} = state
	const {
		socketOpen,
		socketConnecting,
		socketConnectionChange,
		socketRemoveAllListeners,
		socketClose,
		socketOn,
		socketEventFromServer
	} = actions

	useEffect(() => {
		if (connect) {
			if (!connected && !connecting) {
				socketOpen(reconnectDelay, socketConnecting, socketConnectionChange, socketRemoveAllListeners)
			}
		}
		else if (connected && !closing) {
			socketClose()
		}
	})

	useEffect(() => {
		socketOn(connected, socketEventFromServer, listeners, [
			'fazor_socket.io-client_ping',
			data => data,
			({ socket, ...state }, { id, now: lastPing }) => ({
				...state,
				socket: { ...socket, id, lastPing }
			})
		])
	})

	return (
		<div/>
	)
}
