"use strict";

import { Encoder, EncodingConfiguration, IPrereleaseTagMap } from "../../Tasks/EncodeSemverToInteger/encoder";

interface ISemverToExpectedCodesMap {
    [key: string]: number;
}

interface IConfigurationWithExpectedBounds {
    configuration: EncodingConfiguration;
    expectedBounds: IExpectedBounds;
}

interface IExpectedBounds {
    min: string[];
    maxPrereleaseNumber: string;
    max: string[];
}

interface IConfigurationWithExpectedErrors {
    configuration: EncodingConfiguration;
    expectedErrors: IExpectedErrors;
}

interface IExpectedErrors {
    [key: string]: string;
}

let defaultConfiguration = new EncodingConfiguration(5, 4, 2, { "rc": 2, "beta": 1, "alpha": 0, "unstable": 0 }, 9);
let balancedConfiguration = new EncodingConfiguration(6, 5, 2, { "rc": 2, "beta": 1, "alpha": 0 }, 9, "Balanced");
let distributedConfiguration = new EncodingConfiguration(7, 7, 2, { "rc": 2, "beta": 1, "alpha": 0 }, 7, "Distributed");

describe("Simple encoding", () => {
    let defaultConfigurationEncoder = new Encoder(defaultConfiguration);
    let traits: ISemverToExpectedCodesMap = {
        "0.0.0-alpha.0": 0,
        "0.0.0-alpha.1": 1,
        "0.0.0-alpha.511": 511,
        "0.0.0-beta.0": 512,
        "0.0.0-beta.511": 1023,
        "0.0.0-rc.0": 1024,
        "0.0.0": 2047,
        "0.0.1": 4095,
        "0.0.15": 32767,
        "0.1.15": 65535,
        "0.31.15": 1048575,
        "1.31.15": 2097151,
        "2047.31.15": 2147483647
    };

    for (let semver in traits) {
        if (traits.hasOwnProperty(semver)) {
            let expectedCode = traits[semver];
            it("should encode '" + semver + "' to '" + expectedCode.toString() + "'", () => {
                let code = defaultConfigurationEncoder.encode(semver);
                expect(code).toEqual(expectedCode);
            });
        }
    }
});

describe("Bound values", () => {

    let minBound: number = 0;
    let maxBound: number = Math.pow(2, 31) - 1;

    let traits: IConfigurationWithExpectedBounds[] = [
        {
            configuration: defaultConfiguration,
            expectedBounds: {
                min: ["0.0.0-alpha.0", "0.0.0-unstable.0", "0.0.0-unstable", "0.0.0-0"],
                maxPrereleaseNumber: "0.0.0-alpha.511",
                max: ["2047.31.15"]
            },
        },
        {
            configuration: balancedConfiguration,
            expectedBounds: {
                min: ["0.0.0-alpha.0", "0.0.0-alpha", "0.0.0-anothertag", "0.0.0-0"],
                maxPrereleaseNumber: "0.0.0-alpha.511",
                max: ["511.63.31"]
            },
        },
        {
            configuration: distributedConfiguration,
            expectedBounds: {
                min: ["0.0.0-alpha.0", "0.0.0-alpha", "0.0.0-anothertag", "0.0.0-0"],
                maxPrereleaseNumber: "0.0.0-alpha.127",
                max: ["255.127.127"]
            },
        }
    ];

    for (let i = 0; i < traits.length; i++) {
        let trait = traits[i];
        let encoder = new Encoder(trait.configuration);

        for (let j = 0; j < trait.expectedBounds.min.length; j++) {
            let semver = trait.expectedBounds.min[j];
            it("should encode '" + semver + "' to minimal integer value with configuration '" + trait.configuration.friendlyName + "'", () => {
                let code = encoder.encode(semver);
                expect(code).toEqual(minBound);
            });
        }

        let semver = trait.expectedBounds.maxPrereleaseNumber;
        it("should encode '" + semver + "' to maximal prerelease value with configuration '" + trait.configuration.friendlyName + "'", () => {
            let code = encoder.encode(semver);
            expect(code).toEqual(trait.configuration.maxPrereleaseNumberCode);
        });

        for (let j = 0; j < trait.expectedBounds.max.length; j++) {
            let semver = trait.expectedBounds.max[j];
            it("should encode '" + semver + "' to maximal integer value with configuration '" + trait.configuration.friendlyName + "'", () => {
                let code = encoder.encode(semver);
                expect(code).toEqual(maxBound);
            });
        }
    }
});

describe("Overflows", () => {

    let traits: IConfigurationWithExpectedErrors[] = [
        {
            configuration: defaultConfiguration,
            expectedErrors: {
                "0.0.0-alpha.512": "Prerelease Number will overflow allocated bits (512 >= 512).",
                "0.0.16": "Patch will overflow allocated bits (16 >= 16).",
                "0.32.0": "Minor will overflow allocated bits (32 >= 32).",
                "2048.0.0": "Major will overflow allocated bits (2048 >= 2048).",
            },
        },
        {
            configuration: balancedConfiguration,
            expectedErrors: {
                "0.0.0-alpha.512": "Prerelease Number will overflow allocated bits (512 >= 512).",
                "0.0.32": "Patch will overflow allocated bits (32 >= 32).",
                "0.64.0": "Minor will overflow allocated bits (64 >= 64).",
                "512.0.0": "Major will overflow allocated bits (512 >= 512).",
            },
        },
        {
            configuration: distributedConfiguration,
            expectedErrors: {
                "0.0.0-alpha.128": "Prerelease Number will overflow allocated bits (128 >= 128).",
                "0.0.128": "Patch will overflow allocated bits (128 >= 128).",
                "0.128.0": "Minor will overflow allocated bits (128 >= 128).",
                "256.0.0": "Major will overflow allocated bits (256 >= 256).",
            },
        },
        {
            configuration: new EncodingConfiguration(5, 4, 2, { "prod": 4, "preprod": 3, "rc": 2, "beta": 1, "alpha": 0 }, 9),
            expectedErrors: {
                "0.0.0-prod.1": "Prerelease Tag will overflow allocated bits (4 >= 4).",
                "0.0.0-preprod.1": "The max allowed Prerelease Tag value (3) should be kept for Semver without Prerelease Tag.",
            },
        },
    ];

    for (let i = 0; i < traits.length; i++) {
        let trait = traits[i];
        let encoder = new Encoder(trait.configuration);

        for (let semver in trait.expectedErrors) {
            if (trait.expectedErrors.hasOwnProperty(semver)) {
                let errorMessage = trait.expectedErrors[semver];
                it("shouldn't be allowed when encoding '" + semver + "' with configuration '" + trait.configuration.friendlyName + "' (" + errorMessage + ")", () => {
                    let run = () => {
                        encoder.encode(semver);
                    };

                    expect(run).toThrowError(errorMessage);
                });

            }
        }
    }
});

describe("Precedence", () => {

    let traits: string[] = [
        "1.0.0-alpha",
        "1.0.0-alpha.1",
        "1.0.0-alpha.127",
        "1.0.0-beta",
        "1.0.0-beta.2",
        "1.0.0-beta.11",
        "1.0.0-beta.94",
        "1.0.0-rc.1",
        "1.0.0",
        "1.0.1",
        "2.0.0-alpha.18",
        "2.0.0-beta.4",
        "2.0.0",
        "2.2.0-alpha.9",
    ];

    it("should be preserved with configuration '" + defaultConfiguration.friendlyName + "'", () => {
        let lastCode = -1;
        let defaultConfigurationEncoder = new Encoder(defaultConfiguration);
        for (let i = 0; i < traits.length; i++) {
            let code = defaultConfigurationEncoder.encode(traits[i]);
            expect(code).toBeGreaterThan(lastCode);
            lastCode = code;
        }
    });

    it("should be preserved with configuration '" + balancedConfiguration.friendlyName + "'", () => {
        let lastCode = -1;
        let balancedConfigurationEncoder = new Encoder(balancedConfiguration);
        for (let i = 0; i < traits.length; i++) {
            let code = balancedConfigurationEncoder.encode(traits[i]);
            expect(code).toBeGreaterThan(lastCode);
            lastCode = code;
        }
    });

    it("should be preserved with configuration '" + distributedConfiguration.friendlyName + "'", () => {
        let lastCode = -1;
        let distributedConfigurationEncoder = new Encoder(distributedConfiguration);
        for (let i = 0; i < traits.length; i++) {
            let code = distributedConfigurationEncoder.encode(traits[i]);
            expect(code).toBeGreaterThan(lastCode);
            lastCode = code;
        }
    });
});
