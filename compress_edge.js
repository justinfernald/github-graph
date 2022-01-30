import fs from "fs";
import graph from "./graph.json";

let output = "";

for (const node of Object.values(graph).sort((a, b) => a.layer - b.layer)) {
    // if (node.layer > 2) continue
    for (const followingPerson of node.following)
        output += node.username + " " + followingPerson + " " + node.layer + "\n";
}

fs.writeFileSync("compressed_edge.data", output);