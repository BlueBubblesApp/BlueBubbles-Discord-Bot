import { Message } from 'discord.js';
import { Command, Commandable } from './models';
import { HelpCommand, IssueCommand, ConfigCommand } from './commands';

export class CommandManager {
  private commands: Commandable[];
  private readonly prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;

    this.commands = [
      new IssueCommand(),
      new ConfigCommand()
    ]

    this.commands.push(new HelpCommand(this.prefix, this.commands));
  }

  async handler(message: Message): Promise<void> {
    if (message.author.bot || !this.isCommand(message)) {
      return;
    }

    const context = new Command(message, this.prefix);

    const allowedCommands = this.commands.filter((command) =>
      command.userCanRun(context),
    );

    const matchedCommand = this.commands.find((command) =>
      command.aliases.includes(context.parsedCommand),
    );

    if (!matchedCommand) {
      await message.reply(`I don't recognize that command. Try ${process.env.PREFIX}help.`);
    } else if (!allowedCommands.includes(matchedCommand)) {
      await message.reply(`you aren't allowed to use that command. Try ${process.env.PREFIX}help.`);
    } else {
      await matchedCommand.executeCommand(context);
    }
  }

  private isCommand(message: Message): boolean {
    return message.content.startsWith(this.prefix);
  }
}