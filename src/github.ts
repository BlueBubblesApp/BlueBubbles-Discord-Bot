import { Octokit } from "@octokit/core";

const allowedRepos = {
    "server": "BlueBubbles-Server",
    "android": "BlueBubbles-Android-App",
    "desktop": "BlueBubbles-Desktop-App"
}

export class GitHub {
    api: Octokit

    constructor(token: string) {
        this.api = new Octokit({ auth: token });
    }

    async createIssue(owner: string, ghRepo: string, title: string, body: string) {
        let repo = null;

        if (allowedRepos.hasOwnProperty(ghRepo)) {
            repo = allowedRepos[ghRepo]
        }

        if (!repo) {
            console.error('sometingwong with repo');
            return;
        }

        const res = await this.api.request('POST /repos/{owner}/{repo}/issues', {
            owner,
            repo,
            title,
            body,
            labels: ['Bot Created']
          });
        

          if (res == null || res == undefined) {
              console.error('sometingwong with github');
              return;
          }

          return res
    }
}