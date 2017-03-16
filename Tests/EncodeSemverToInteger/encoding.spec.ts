"use strict";

import { Encoder } from "../../Tasks/EncodeSemverToInteger/encoder";

let minorBits = 5;
let patchBits = 4;
let preReleaseTagBits = 2;
let preReleaseTagMap = { "rc": 2, "beta": 1, "alpha": 0, "unstable": 0 };
let preReleaseNumberBits = 9;

describe("Simple encoding", () => {
    it(": '0.0.0-alpha.0' should be encoded to '0'.", () => {
        let encoder = new Encoder("0.0.0-alpha.0");
        let code = encoder.encode(minorBits, patchBits, preReleaseTagBits, preReleaseTagMap, preReleaseNumberBits);
        expect(code).toEqual(0);
    });

    it(": '0.0.0-alpha.1' should be encoded to '1'.", () => {
        let encoder = new Encoder("0.0.0-alpha.1");
        let code = encoder.encode(minorBits, patchBits, preReleaseTagBits, preReleaseTagMap, preReleaseNumberBits);
        expect(code).toEqual(1);
    });

    it(": '0.0.0-alpha.511' should be encoded to '511'.", () => {
        let encoder = new Encoder("0.0.0-alpha.511");
        let code = encoder.encode(minorBits, patchBits, preReleaseTagBits, preReleaseTagMap, preReleaseNumberBits);
        expect(code).toEqual(511);
    });

    it(": '0.0.0-beta.0' should be encoded to '512'.", () => {
        let encoder = new Encoder("0.0.0-beta.0");
        let code = encoder.encode(minorBits, patchBits, preReleaseTagBits, preReleaseTagMap, preReleaseNumberBits);
        expect(code).toEqual(512);
    });

    it(": '0.0.0-beta.511' should be encoded to '1023'.", () => {
        let encoder = new Encoder("0.0.0-beta.511");
        let code = encoder.encode(minorBits, patchBits, preReleaseTagBits, preReleaseTagMap, preReleaseNumberBits);
        expect(code).toEqual(1023);
    });

    it(": '0.0.0-rc.0' should be encoded to '1024'.", () => {
        let encoder = new Encoder("0.0.0-rc.0");
        let code = encoder.encode(minorBits, patchBits, preReleaseTagBits, preReleaseTagMap, preReleaseNumberBits);
        expect(code).toEqual(1024);
    });

    it(": '0.0.0' should be encoded to '2047'.", () => {
        let encoder = new Encoder("0.0.0");
        let code = encoder.encode(minorBits, patchBits, preReleaseTagBits, preReleaseTagMap, preReleaseNumberBits);
        expect(code).toEqual(2047);
    });

    it(": '0.0.1' should be encoded to '4095'.", () => {
        let encoder = new Encoder("0.0.1");
        let code = encoder.encode(minorBits, patchBits, preReleaseTagBits, preReleaseTagMap, preReleaseNumberBits);
        expect(code).toEqual(4095);
    });

    it(": '0.0.15' should be encoded to '32,767'.", () => {
        let encoder = new Encoder("0.0.15");
        let code = encoder.encode(minorBits, patchBits, preReleaseTagBits, preReleaseTagMap, preReleaseNumberBits);
        expect(code).toEqual(32767);
    });

    it(": '0.1.15' should be encoded to '65,535'.", () => {
        let encoder = new Encoder("0.1.15");
        let code = encoder.encode(minorBits, patchBits, preReleaseTagBits, preReleaseTagMap, preReleaseNumberBits);
        expect(code).toEqual(65535);
    });

    it(": '0.31.15' should be encoded to '1,048,575'.", () => {
        let encoder = new Encoder("0.31.15");
        let code = encoder.encode(minorBits, patchBits, preReleaseTagBits, preReleaseTagMap, preReleaseNumberBits);
        expect(code).toEqual(1048575);
    });

    it(": '1.31.15' should be encoded to '2,097,151'.", () => {
        let encoder = new Encoder("1.31.15");
        let code = encoder.encode(minorBits, patchBits, preReleaseTagBits, preReleaseTagMap, preReleaseNumberBits);
        expect(code).toEqual(2097151);
    });

    // it(": '4095.31.15' should be encoded to '2,147,483,648'.", () => {
    //     let encoder = new Encoder("4095.31.15");
    //     let code = encoder.encode(minorBits, patchBits, preReleaseTagBits, preReleaseTagMap, preReleaseNumberBits);
    //     expect(code).toEqual(2147483648);
    // });
});
