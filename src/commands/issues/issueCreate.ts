import { Commandable } from '../../models';
import { Command } from '../../models';
import { GitHub } from '../../github';

export class CreateIssue implements Commandable {
    aliases = ['create']

    async executeCommand(parsedMessage: Command): Promise<void> {
        const args = parsedMessage.args;
        const message = parsedMessage.message;
        const gh = new GitHub(process.env.GH_TOKEN);
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

            if (!response || response == undefined) {
                await message.reply(FAILURE_RESPONSE);
            }

            let reply = `Issue created successfully! ${response.data.html_url}`
            await message.reply(reply);
        }
        catch(error) {
            console.error(error);
            await message.reply(FAILURE_RESPONSE);
        }
    }

    userCanRun(parsedMessage: Command): boolean {
        return true;
    }

    fetchHelp(prefix: string): string {
        return `Command aliases: ${this.aliases.join(', ')}
Use \`${prefix}issue create\` to create a github issue.
Useage: \`${prefix}issue create {Repository} {Title} {Message}\``;
    }
}

const ISSUE_TEMPLATE =
`
{PLACEHOLDER}

>  Issue created by BlueBubbles Bot in the \`{GUILD}\` commnity on \
behalf of \`@{USER}\` in \`#{CHANNEL}\`.
`

const FAILURE_RESPONSE = "Sorry, an error occurred while creating the issue.";