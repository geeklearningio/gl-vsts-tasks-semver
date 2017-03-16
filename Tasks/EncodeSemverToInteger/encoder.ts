import semver = require("semver");

export class Encoder {
    constructor(private sourceSemVer: string) {
    }

    private checkBounds(value: number, bits: number, name: string) {
        if (value >= (Math.pow(2, bits))) {
            throw new Error(name + " will overflow allocated bits. " + value.toString() + " >= " + (Math.pow(2, bits)).toString());
        }
    }

    encode(minorBits: number, patchBits: number, preReleaseTagBits: number, preReleaseTagMap: any, preReleaseNumberBits: number): number {
        let majorBits = 32 - minorBits - patchBits - preReleaseNumberBits - preReleaseTagBits;

        let parsedSemver = new semver.SemVer(this.sourceSemVer, false);

        let code: number = 0;

        this.checkBounds(parsedSemver.major, majorBits, "major");
        code += parsedSemver.major;

        this.checkBounds(parsedSemver.minor, minorBits, "minor");
        code = code << minorBits;
        code += parsedSemver.minor;

        this.checkBounds(parsedSemver.patch, patchBits, "patch");
        code = code << patchBits;
        code += parsedSemver.patch;

        let preReleaseTagCode: number = Math.pow(2, preReleaseTagBits) - 1;
        let preReleaseNumber: number = Math.pow(2, preReleaseNumberBits) - 1;
        if (parsedSemver.prerelease && parsedSemver.prerelease.length) {
            let mapResult = preReleaseTagMap[parsedSemver.prerelease[0]];
            if (mapResult) {
                preReleaseTagCode = mapResult;
            } else {
                preReleaseTagCode = 0;
            }
            if (parsedSemver.prerelease.length > 1) {
                preReleaseNumber = parseInt(parsedSemver.prerelease[1]);
            }
        }

        this.checkBounds(preReleaseTagCode, preReleaseTagBits, "preReleaseTagBits");
        code = code << preReleaseTagBits;
        code += preReleaseTagCode;

        this.checkBounds(preReleaseNumber, preReleaseNumberBits, "preReleaseNumberBits");
        code = code << preReleaseNumberBits;
        code += preReleaseNumber;

        return code;
    }
}