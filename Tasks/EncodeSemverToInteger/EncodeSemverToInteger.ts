import path = require('path');
import fs = require('fs-extra');
import tl = require('vsts-task-lib/task');
import semver = require('semver');

try {
    var sourceSemVer = tl.getInput("SourceSemver");
    var minorBits = parseInt(tl.getInput("MinorBits"));
    var patchBits = parseInt(tl.getInput("PatchBits"));
    var preReleaseTagBits = parseInt(tl.getInput("PreReleaseTagBits"));
    var preReleaseTagMap = JSON.parse(tl.getInput("PreReleaseTagMap"));
    var preReleaseNumberBits = parseInt(tl.getInput("PreReleaseNumberBits"));
    var outputVariable = tl.getInput("OutputVariable");

    var varRegex = /\$\((.*?)\)/g;
    sourceSemVer = sourceSemVer.replace(varRegex, (match, varName, offset, string) => tl.getVariable(varName));

    console.log("SourceSemVer : " + sourceSemVer);

    var checkBounds = (value: number, bits: number, name: string) => {
        if (value >= (Math.pow(2, bits))) {
            throw new Error(name + " will overflow allocated bits. " + value.toString() + " >= " + (Math.pow(2, bits)).toString());
        }
    };

    var majorBits = 32 - minorBits - patchBits - preReleaseNumberBits - preReleaseTagBits;

    var parsedSemver = new semver.SemVer(sourceSemVer, false);

    var code: number = 0;

    checkBounds(parsedSemver.major, majorBits, "major");
    code += parsedSemver.major;

    checkBounds(parsedSemver.minor, minorBits, "minor");
    code = code << minorBits;
    code += parsedSemver.minor;

    checkBounds(parsedSemver.patch, patchBits, "patch");
    code = code << patchBits;
    code += parsedSemver.patch;

    var preReleaseTagCode: number = (2 ^ preReleaseTagBits) - 1;
    var preReleaseNumber: number = 0;
    if (parsedSemver.prerelease && parsedSemver.prerelease.length) {
        var mapResult = preReleaseTagMap[parsedSemver.prerelease[0]];
        if (mapResult) {
            preReleaseTagCode = mapResult;
        } else {
            preReleaseTagCode = 0;
        }
        if (parsedSemver.prerelease.length > 1){
            preReleaseNumber = parseInt(parsedSemver.prerelease[1]);
        }
    }

    checkBounds(preReleaseTagCode, preReleaseTagBits, "preReleaseTagBits");
    code = code << preReleaseTagBits;
    code += preReleaseTagCode;

    checkBounds(preReleaseNumber, preReleaseNumberBits, "preReleaseNumberBits");
    code = code << preReleaseNumberBits;
    code += preReleaseNumber;

    console.log("computed versioncode : " + code.toString());
    tl.setVariable(outputVariable, code.toString());

    tl.setResult(tl.TaskResult.Succeeded, "Code encoded");

} catch (err) {
    console.error(String(err));
    tl.setResult(tl.TaskResult.Failed, String(err));
}
