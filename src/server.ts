import "dotenv/config"
import { Client, Message } from "discord.js";
import { CommandManager } from "./commandManager";
import { IssueCommand, HelpCommand } from "./commands";

const client = new Client();
const cmdManager = new CommandManager(process.env.PREFIX);

client.on("ready", async() => {
    const servers = await client.guilds.cache.size;

    await client.user.setActivity(`${process.env.PREFIX} help`, { type: "STREAMING" });
    console.log(`BlueBubbles Bot has started on ${servers} servers!`);
});

client.on("message", (message: Message) => {
    cmdManager.handler(message);
});

client.on("error", (e) => {
    console.log(typeof(e));
    console.error("Discord client error!", e);
});

client.login(process.env.TOKEN);