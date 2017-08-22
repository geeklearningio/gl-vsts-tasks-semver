import { Encoder, EncodingConfiguration, IPrereleaseTagMap } from "./encoder";
import tl = require("vsts-task-lib/task");
import semver = require("semver");

try {

    let checkNaN = (numberToCheck: number, numberName: string): number => {
        if (isNaN(numberToCheck)) {
            throw new Error(numberName + " is not a valid number.");
        }

        return numberToCheck;
    };

    let getNumberInput = (inputName: string): number => {
        return checkNaN(parseInt(tl.getInput(inputName)), inputName);
    };

    let sourceSemVer = tl.getInput("SourceSemver");
    let minorBits = getNumberInput("MinorBits");
    let patchBits = getNumberInput("PatchBits");
    let preReleaseTagBits = getNumberInput("PreReleaseTagBits");
    let preReleaseTagMap: IPrereleaseTagMap = JSON.parse(tl.getInput("PreReleaseTagMap"));
    let preReleaseNumberBits = getNumberInput("PreReleaseNumberBits");
    let outputVariable = tl.getInput("OutputVariable");
    let disableZeroBitAllocation = tl.getBoolInput("DisableZeroBitAllocation");
    let totalBits = getNumberInput("TotalBits");

    let varRegex = /\$\((.*?)\)/g;
    sourceSemVer = sourceSemVer.replace(varRegex, (match, varName, offset, s) => tl.getVariable(varName));

    console.log("Source Semver: " + sourceSemVer);

    let encoder = new Encoder(new EncodingConfiguration(totalBits, disableZeroBitAllocation, minorBits, patchBits, preReleaseTagBits, preReleaseTagMap, preReleaseNumberBits));
    let code = checkNaN(encoder.encode(sourceSemVer), "Computed Version Code");

    console.log("Computed Version Code: " + code.toString());
    tl.setVariable(outputVariable, code.toString());

    tl.setResult(tl.TaskResult.Succeeded, "Code encoded");

} catch (err) {
    console.error(String(err));
    tl.setResult(tl.TaskResult.Failed, String(err));
}
