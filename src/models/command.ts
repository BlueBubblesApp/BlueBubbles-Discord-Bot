import { Message } from 'discord.js';

export class Command {
  readonly parsedCommand: string;
  readonly args: string[];
  readonly message: Message;
  readonly prefix: string;

  constructor(message: Message, prefix: string) {
    this.prefix = prefix;
    const parsedMessage = message.content
      .slice(prefix.length)
      .trim();

    const splitMessage = parsedMessage.match(/\w+|"[^"]+"/g)

    this.parsedCommand = splitMessage.shift()!.toLowerCase();
    this.args = splitMessage;
    this.message = message;
  }
}