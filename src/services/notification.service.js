import { EventEmitter } from 'node:events'

const emitter = new EventEmitter()

// Listeners
emitter.on('user:registered', (data) => {
    console.log('Usuario registrado:', data)
})

emitter.on('user:verified', (data) => {
    console.log('Usuario verificado:', data)
})

emitter.on('user:invited', (data) => {
    console.log('Usuario invitado:', data)
})

emitter.on('user:deleted', (data) => {
    console.log('Usuario eliminado:', data)
})

// Add personal
emitter.on('user:login', (data) => {
    console.log('Usuario ha iniciado sesión:', data)
})

emitter.on('user:updated', (data) => {
    console.log('Usuario actualizado:', data)
})

emitter.on('user:fetched', (data) => {
    console.log('Usuario consultado:', data)
})

emitter.on('user:logout', (data) => {
    console.log('Usuario ha cerrado sesión:', data)
})

export default emitter