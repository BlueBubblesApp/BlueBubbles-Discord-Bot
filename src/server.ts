import { Client, Message } from 'discord.js';

const client = new Client();

client.on('ready', () => {
    console.log('BlueBubbles Bot Has Started!')
});

client.on('message', (message: Message) => {
    console.log(`User ${message.author.username}#${message.author.discriminator} says "${message.content}" / "${message.cleanContent}"`);
});

client.on('error', (e) => {
    console.log(typeof(e));
    console.error('Discord client error!', e);
});

client.login('Nzk1NDM3NjQ4MjAyMTcwMzc5.X_JXCQ.-mmvDDn9dfDIU-cFRv0vA1YvM40')