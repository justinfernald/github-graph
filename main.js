import 'dotenv/config'
import { Octokit } from "octokit";
import fs from "fs";
import { env } from "process";
const octokit = new Octokit({ auth: env.GITHUB_API });

class Node {
    constructor(username, userData, userRepos, starredRepos, following, layer) {
        this.username = username;
        this.userData = userData;
        this.userRepos = userRepos;
        this.starredRepos = starredRepos;
        this.following = following;
        this.layer = layer;
    }
}

const {
    data: { login },
} = await octokit.rest.users.getAuthenticated();

const queue = [{ layer: 0, username: login }];
const nodes = {};

let count = 0;

while (queue.length > 0) {
    const { layer, username } = queue.shift();
    if (layer > 4) break;
    if (nodes[username]) continue;

    const [userData, userRepos, starredRepos, followingData] = await Promise.all([
        octokit.rest.users.getByUsername({ username }),
        octokit.rest.repos.listForUser({ username, per_page: 100 }),
        octokit.rest.activity.listReposStarredByUser({ username, per_page: 100 }),
        octokit.rest.users.listFollowingForUser({ username }),
    ])

    const following = followingData.data.map(({ login }) => login);

    nodes[username] = new Node(username, userData.data, userRepos.data, starredRepos.data, following, layer);

    const userSet = new Set(following);
    queue.push(...[...userSet].map(username => ({ layer: layer + 1, username })));

    console.log({ count, layer, username });
    if (count % 25 === 0) fs.writeFileSync("graph.json", JSON.stringify(Object.values(nodes), null, 4));
    count++;
}

fs.writeFileSync("graph.json", JSON.stringify(Object.values(nodes)));