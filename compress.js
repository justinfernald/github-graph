import fs from "fs";
import graph from "./graph.json";

const usernameIndexMap = {};
let index = 0;
let output = "";

for (const node of graph) {
    console.log(node.username)
    if (usernameIndexMap[node.username] === undefined)
        usernameIndexMap[node.username] = index++;
    // for (const follower of node.followers)
    //     if (usernameIndexMap[follower] === undefined)
    //         usernameIndexMap[follower] = index++;
    for (const following of node.following)
        if (usernameIndexMap[following] === undefined)
            usernameIndexMap[following] = index++;
}

for (const [username, i] of Object.entries(usernameIndexMap)) {
    output += username + " " + i + "\n";
}

output += "##########################\n";

for (const node of graph) {
    const userIndex = usernameIndexMap[node.username];
    // const followersIndex = node.followers.map(follower => usernameIndexMap[follower]);
    const followingsIndex = node.following.map(following => usernameIndexMap[following]);

    // for (const followerIndex of followersIndex)
    //     output += userIndex + " " + followerIndex + "\n";
    for (const followingIndex of followingsIndex)
        output += userIndex + " " + followingIndex + "\n";
}

fs.writeFileSync("compressed.data", output);