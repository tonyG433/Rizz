import _config from '../config.json'
import IConfig from './structure/interfaces/IConfig'
const config: IConfig = _config

import RZClient from './structure/Client'
import { Message } from 'revolt.js/dist/maps/Messages'

const client = new RZClient(config)


client.on('message', async (message: Message) => {
    if (message.author?.bot || typeof message.content !== 'string') return

    let args: string[] = message.content.slice(config.prefix.length).split(/ +/g)

    let commandName = args.shift()?.toLowerCase()

    let command = client.commands.get(commandName as string) ?? client.commands.find(c => {
        if (typeof c.aliases === 'string') c.aliases = [c.aliases]

        return !!c.aliases && c.aliases.includes(commandName as string)
    })

    if (!command) return

    try {
        command.run(client, message, args)
    } catch (err) {
        console.error(err)
    }
})

client.start()