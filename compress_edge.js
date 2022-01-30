import fs from "fs";
import graph from "./graph.json";

let output = "";
let output_lang = "";

for (const node of Object.values(graph).sort((a, b) => a.layer - b.layer)) {
    // if (node.layer > 2) continue
    const userLanguages = node.userRepos.map(x => x.language).filter(x => x)
    const starLanguages = node.starredRepos.map(x => x.language).filter(x => x)

    const selfAdjustWeight = 1;
    const starAdjustWeight = 0.5;

    const userLanguagesCount = userLanguages.reduce((acc, e) => { acc[e] = (acc[e] || 0) + selfAdjustWeight; return acc; }, {})
    const starLanguagesCount = starLanguages.reduce((acc, e) => { acc[e] = (acc[e] || 0) + starAdjustWeight; return acc; }, {})

    // add user languages to star languages

    const fixDistribution = {
        "Python": 17.926,
        "JavaScript": 14.058,
        "Java": 12.208,
        "HTML": 10.846,
        "TypeScript": 8.472,
        "Go": 8.161,
        "C++": 6.67,
        "Ruby": 6.165,
        "PHP": 5.252,
        "C#": 3.372,
        "C": 3.15,
        "Nix": 2.42,
        "Shell": 2.184,
        "Scala": 2.047,
        "Kotlin": 1.028,
        "Rust": 0.694,
        "Dart": 0.694,
        "Swift": 0.648,
        "Groovy": 0.354,
        "Lean": 0.323,
        "Elixir": 0.311,
        "DM": 0.3,
        "SCSS": 0.295,
        "Objective-C": 0.241,
        "OCaml": 0.24,
        "SystemVerilog": 0.232,
        "Perl": 0.231,
        "Lua": 0.198,
        "Erlang": 0.187,
        "Haskell": 0.18,
        "Clojure": 0.138,
        "Emacs Lisp": 0.138,
        "PowerShell": 0.114,
        "CodeQL": 0.109,
        "Jinja": 0.105,
        "Jsonnet": 0.098,
        "R": 0.078,
        "CoffeeScript": 0.077,
        "Verilog": 0.076,
        "Roff": 0.061,
        "Julia": 0.058,
        "Vim script": 0.055,
        "F#": 0.05,
        "MATLAB": 0.046,
        "Puppet": 0.046,
        "Elm": 0.044,
        "Fortran": 0.039,
        "Vala": 0.039,
        "YAML": 0.036,
        "Visual Basic .NET": 0.034,
        "WebAssembly": 0.033
    };

    const defaultValue = 1;

    const combineCount = {};
    for (const key of new Set([...Object.keys(userLanguagesCount), ...Object.keys(starLanguagesCount)])) {
        combineCount[key] = (1 / (fixDistribution[key] || defaultValue)) * ((userLanguagesCount[key] || 0) + (starLanguagesCount[key] || 0));
    }

    let chosenLanguage = Object.keys(combineCount).sort((a, b) => combineCount[b] - combineCount[a])[0] || "none";
    chosenLanguage = chosenLanguage.split("#").join("Sharp")
    output_lang += node.username + "\t" + chosenLanguage + "\t" + node.layer + "\n";
    console.log({ username: node.username, chosenLanguage })
    for (const followingPerson of node.following) {
        output += node.username + "\t" + followingPerson + "\t" + chosenLanguage + "\t" + node.layer + "\n";
    }
}

fs.writeFileSync("compressed_lang.data", output_lang);
fs.writeFileSync("compressed_edge.data", output);