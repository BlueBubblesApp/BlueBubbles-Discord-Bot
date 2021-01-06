import { Command, Commandable, SubCommandable } from '../models';
import { CreateIssue } from '../commands/issues';
import { Message } from 'discord.js';

export class IssueCommand implements Commandable, SubCommandable {
  aliases = ['issue', 'i'];
  subCommands = [
    new CreateIssue()
  ]

  async executeCommand(parsedMessage: Command): Promise<void> {
    const args = parsedMessage.args;

    if (args.length == 0) {
      await parsedMessage.message.reply(`Sorry, you must supply proper arguments. \
See ${parsedMessage.prefix}help issue for more info.`)
      return;
    }

    let availableSubCommands = []
    for (const subCommand of this.subCommands) {
      availableSubCommands.push(...subCommand.aliases)
    }

    if (!availableSubCommands.includes(args[0])) {

      if (['android', 'desktop', 'server', 'bot'].includes(args[0].toLowerCase())
        && args.length > 1) {
          const subCommand = this.subCommands.find((command) =>
            command.aliases.includes("create")
          );

          subCommand.executeCommand(parsedMessage);
          return;
      }

      await parsedMessage.message.reply(`Sorry, I don't understand the sub command [${args[0]}]! \
See ${parsedMessage.prefix}help issue for more info.`);
      return;
    }

    const subCommand = this.subCommands.find((command) =>
        command.aliases.includes(args[0])
    );

    parsedMessage.args.shift()!.toLowerCase();
    subCommand.executeCommand(parsedMessage)
  }

  userCanRun(parsedMessage: Command): boolean {
    return true;
  }

  fetchSubHelp(prefix: string): string {
    let subCommandList: string = '';
    let subCommandHelp: string = '';
    for (const subCommand of this.subCommands) {
      subCommandHelp = subCommandHelp + subCommand.fetchHelp(prefix) + "\n\n";
      subCommandList = subCommandList + subCommand.aliases[0] + " ";
    }
    return `Sub Commands: ${subCommandList}
    
${subCommandHelp}
    `;
  }

  fetchHelp(prefix: string): string {
    return `Command aliases: ${this.aliases.join(', ')}
${this.fetchSubHelp(prefix)}`
  }
}