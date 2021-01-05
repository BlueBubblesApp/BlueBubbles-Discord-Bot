import { Message } from 'discord.js';

/** A user-given command extracted from a message. */
export class CommandContext {
  /** Command name in all lowercase. */
  readonly parsedCommandName: string;

  /** Arguments (split by space). */
  readonly args: string[];

  /** Original Message the command was extracted from. */
  readonly originalMessage: Message;

  readonly commandPrefix: string;

  constructor(message: Message, prefix: string) {
    this.commandPrefix = prefix;
    const parsedMessage = message.content
      .slice(prefix.length)
      .trim()

    const splitMessage = parsedMessage.match(/\w+|"[^"]+"/g)

    this.parsedCommandName = splitMessage.shift()!.toLowerCase();
    this.args = splitMessage;
    this.originalMessage = message;
  }
}