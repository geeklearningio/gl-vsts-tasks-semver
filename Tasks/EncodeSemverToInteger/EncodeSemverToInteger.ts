import { Encoder } from "./encoder";
import tl = require("vsts-task-lib/task");
import semver = require("semver");

try {
    let sourceSemVer = tl.getInput("SourceSemver");
    let minorBits = parseInt(tl.getInput("MinorBits"));
    let patchBits = parseInt(tl.getInput("PatchBits"));
    let preReleaseTagBits = parseInt(tl.getInput("PreReleaseTagBits"));
    let preReleaseTagMap = JSON.parse(tl.getInput("PreReleaseTagMap"));
    let preReleaseNumberBits = parseInt(tl.getInput("PreReleaseNumberBits"));
    let outputVariable = tl.getInput("OutputVariable");

    let varRegex = /\$\((.*?)\)/g;
    sourceSemVer = sourceSemVer.replace(varRegex, (match, varName, offset, s) => tl.getVariable(varName));

    console.log("SourceSemVer : " + sourceSemVer);

    let encoder = new Encoder(sourceSemVer);
    let code = encoder.encode(minorBits, patchBits, preReleaseTagBits, preReleaseTagMap, preReleaseNumberBits);

    console.log("computed versioncode : " + code.toString());
    tl.setVariable(outputVariable, code.toString());

    tl.setResult(tl.TaskResult.Succeeded, "Code encoded");

} catch (err) {
    console.error(String(err));
    tl.setResult(tl.TaskResult.Failed, String(err));
}
