import { Message } from 'discord.js';
import { Command, Commandable } from './models';
import { HelpCommand, IssueCommand } from './commands';

export class CommandManager {
  private commands: Commandable[];
  private readonly prefix: string;

  constructor(prefix: string) {
    this.commands = [
      new IssueCommand()
    ]

    this.commands.push(new HelpCommand(this.prefix, this.commands));
    this.prefix = prefix;
  }

  async handler(message: Message): Promise<void> {
    if (message.author.bot || !this.isCommand(message)) {
      return;
    }

    const commandContext = new Command(message, this.prefix);

    const allowedCommands = this.commands.filter((command) =>
      command.userCanRun(commandContext),
    );

    const matchedCommand = this.commands.find((command) =>
      command.aliases.includes(commandContext.parsedCommand),
    );

    if (!matchedCommand) {
      await message.reply(`I don't recognize that command. Try ${process.env.PREFIX}help.`);
    } else if (!allowedCommands.includes(matchedCommand)) {
      await message.reply(`you aren't allowed to use that command. Try ${process.env.PREFIX}help.`);
    } else {
      await matchedCommand.executeCommand(commandContext);
    }
  }

  private isCommand(message: Message): boolean {
    return message.content.startsWith(this.prefix);
  }
}