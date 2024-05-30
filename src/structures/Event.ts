import Client from '@structures/Client'
import { ClientEvents } from 'discord.js'

export default abstract class Event {
    public abstract name: keyof ClientEvents
    public abstract once: boolean
    public abstract client: Client

    public abstract execute(...args: unknown[]): void
}