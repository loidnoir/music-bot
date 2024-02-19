import { ClientEvents } from 'discord.js'
import BaseClient from './BaseClient'

export default abstract class BaseEvent {
    public abstract data: EventData

    public abstract run(client: BaseClient, ...args: unknown[]): void
}

export interface EventData {
    name: keyof ClientEvents
    once: boolean
}