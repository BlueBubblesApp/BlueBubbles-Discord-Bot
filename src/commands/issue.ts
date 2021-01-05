import { Command, CommandContext } from '../models';
import { GitHub } from '../github';

export class IssueCommand implements Command {
  commandNames = ['issue'];

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}issue to create a github issue.
    Useage: ${process.env.PREFIX}issue {Repository} {Title} {Message}
    Example: ${process.env.PREFIX}issue android "Messages won't send" "When I try to send messages it the app gives an error."
    Allowed repositories android, server, desktop
    `;
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    const args = parsedUserCommand.args;
    const message = parsedUserCommand.originalMessage
    const gh = new GitHub(process.env.GH_TOKEN)
    const regex = new RegExp('"', 'g');

    let channel = message.guild.channels.cache.find(
      channel => channel.id === message.channel.id
    );

    let issueBody = ISSUE_TEMPLATE
      .replace("{PLACEHOLDER}", args[2].replace(regex, "") || "_No content_")
      .replace("{GUILD}", message.guild.name)
      .replace("{CHANNEL}", channel.name)
      .replace("{USER}", message.author.username);
    
    try {
      const response = await gh.createIssue(
        process.env.GH_NAME,
        args[0],
        args[1].replace(regex, ""),
        issueBody,
      );

      let reply = SUCCESS_TEMPLATE.replace("{PLACEHOLDER}", response.data.html_url)
      await message.reply(reply)
    }
    catch(error) {
      console.error(error)
      let formattedError = JSON.stringify(error, null, 4)
      let reply = ERROR_TEMPLATE.replace('{PLACEHOLDER}', formattedError)
      await message.reply(reply)
    }
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }
}

const ISSUE_TEMPLATE =
`
{PLACEHOLDER}
---
Issue created by BlueBubbles Bot in the \`{GUILD}\` commnity on \
behalf of \`@{USER}\` in \`#{CHANNEL}\`.
`

const ERROR_TEMPLATE =
`
Command should be: ${process.env.PREFIX}issue {Repository} {Title} {Message}
Example: ${process.env.PREFIX}issue android "Messages won't send" "When I try to send messages it the app gives an error."
An error occurred while creating the issue.
Details:
\`\`\`
{PLACEHOLDER}
\`\`\`
`

const SUCCESS_TEMPLATE =
`
Issue created successfully! {PLACEHOLDER}
`