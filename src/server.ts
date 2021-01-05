import 'dotenv/config'
import { Client, Message } from 'discord.js';
import { CommandManager } from './commandManager';

const client = new Client();
const cmdManager = new CommandManager(process.env.PREFIX);

client.on('ready', () => {
    console.log('BlueBubbles Bot Has Started!')
});

client.on('message', (message: Message) => {
    cmdManager.handleMessage(message);
});

client.on('error', (e) => {
    console.log(typeof(e));
    console.error('Discord client error!', e);
});

client.login(process.env.TOKEN)