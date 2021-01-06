import { Octokit } from "@octokit/core";

export class GitHub {
    api: Octokit

    constructor(token: string) {
        this.api = new Octokit({ auth: token });
    }

    async createIssue(owner: string, ghRepo: string, title: string, body: string) {
        let repo: string = null;

        if (ALLOWED_REPOS.hasOwnProperty(ghRepo.toLocaleLowerCase())) {
            repo = ALLOWED_REPOS[ghRepo.toLocaleLowerCase()]
        }

        if (!repo) {
            console.log(`An unhabled repository [${ghRepo}] was provided!`)
            return;
        }

        return await this.api.request("POST /repos/{owner}/{repo}/issues", {
            owner,
            repo,
            title,
            body,
            labels: LABELS
          });
    }
}

const ALLOWED_REPOS = {
    "server": "BlueBubbles-Server",
    "android": "BlueBubbles-Android-App",
    "desktop": "BlueBubbles-Desktop-App",
    "bot": "BlueBubbles-Discord-Bot"
}

const LABELS = [
    "Bot Created"
]