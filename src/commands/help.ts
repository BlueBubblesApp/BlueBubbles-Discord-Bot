import { Command, Commandable } from '../models';

export class HelpCommand implements Commandable {
  readonly aliases = ['help', 'h'];
  private commands: Commandable[];
  private prefix: string;

  constructor(prefix:string, commands: Commandable[]) {
    this.prefix = prefix;
    this.commands = commands;
  }

  async executeCommand(parsedMessage: Command): Promise<void> {
    const userCommands = this.commands.filter((command) =>
      command.userCanRun(parsedMessage),
    );

    if (parsedMessage.args.length === 0) {
      const aliases = userCommands.map(
        (command) => command.aliases[0],
      );

      await parsedMessage.message.reply(
        `Here is a list of your available commands \`${aliases.join(', ',)}.\`\
        \n\nTry \`${this.prefix}help {{alias}}\` to learn more about one of them.`
      );
      return;
    }

    const foundComand = this.commands.find((command) =>
      command.aliases.includes(parsedMessage.args[0]),
    );

    if (!foundComand) {
      await parsedMessage.message.reply(
        `Unknown Command. Please try ${process.env.PREFIX}help for more info on what I can do.`,
      );
      return;
    }
    
    if (userCommands.includes(foundComand)) {
      await parsedMessage.message.reply(`${foundComand.fetchHelp(this.prefix)}`);
    }
  }

  userCanRun(parsedMessage: Command): boolean {
    return true;
  }

  fetchHelp(prefix: string) {
    return 'You are already using this command properly :)'
  }
}