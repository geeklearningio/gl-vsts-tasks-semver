import semver = require("semver");

export interface IPrereleaseTagMap {
    [key: string]: number;
}

export class EncodingConfiguration {
    readonly majorBits: number = 31 - this.minorBits - this.patchBits - this.prereleaseNumberBits - this.prereleaseTagBits;

    readonly maxPrereleaseTagCode = Math.pow(2, this.prereleaseTagBits) - 1;
    readonly maxPrereleaseNumberCode = Math.pow(2, this.prereleaseNumberBits) - 1;

    constructor(
        readonly allowZeroBitAllocation: boolean,
        readonly minorBits: number,
        readonly patchBits: number,
        readonly prereleaseTagBits: number,
        readonly prereleaseTagMap: IPrereleaseTagMap,
        readonly prereleaseNumberBits: number,
        readonly friendlyName: string = "Default") {
    }
}

export class Encoder {
    constructor(private configuration: EncodingConfiguration) {
    }

    private checkOverflow(value: number, bits: number, name: string) {
        if (this.configuration.allowZeroBitAllocation && bits === 0) {
            return;
        }
        let maxValue = Math.pow(2, bits);
        if (value >= maxValue) {
            throw new Error(name + " will overflow allocated bits (" + value.toString() + " >= " + maxValue.toString() + ").");
        }
    }

    encode(sourceSemver: string): number {
        let parsedSemver = new semver.SemVer(sourceSemver, false);

        let code: number = 0;

        this.checkOverflow(parsedSemver.major, this.configuration.majorBits, "Major");
        if (this.configuration.majorBits) {
            code += parsedSemver.major;
        }

        this.checkOverflow(parsedSemver.minor, this.configuration.minorBits, "Minor");
        code = code << this.configuration.minorBits;
        if (this.configuration.minorBits) {
            code += parsedSemver.minor;
        }

        this.checkOverflow(parsedSemver.patch, this.configuration.patchBits, "Patch");
        code = code << this.configuration.patchBits;
        if (this.configuration.patchBits) {
            code += parsedSemver.patch;
        }

        let prereleaseTagCode = this.configuration.maxPrereleaseTagCode;
        let prereleaseNumberCode = this.configuration.maxPrereleaseNumberCode;
        if (parsedSemver.prerelease && parsedSemver.prerelease.length) {
            prereleaseTagCode = 0;
            prereleaseNumberCode = 0;

            let mapResult = this.configuration.prereleaseTagMap[parsedSemver.prerelease[0]];
            if (mapResult) {
                if (mapResult === this.configuration.maxPrereleaseTagCode) {
                    throw new Error("The max allowed Prerelease Tag value (" + this.configuration.maxPrereleaseTagCode + ") should be kept for Semver without Prerelease Tag.");
                }

                prereleaseTagCode = mapResult;
            }

            if (parsedSemver.prerelease.length > 1) {
                prereleaseNumberCode = parseInt(parsedSemver.prerelease[1]);
            }
        }

        this.checkOverflow(prereleaseTagCode, this.configuration.prereleaseTagBits, "Prerelease Tag");
        code = code << this.configuration.prereleaseTagBits;
        if (this.configuration.prereleaseTagBits) {
            code += prereleaseTagCode;
        }

        this.checkOverflow(prereleaseNumberCode, this.configuration.prereleaseNumberBits, "Prerelease Number");
        code = code << this.configuration.prereleaseNumberBits;
        if (this.configuration.prereleaseNumberBits) {
            code += prereleaseNumberCode;
        }

        return code;
    }
}