let Jasmine = require("jasmine");
let reporters = require("jasmine-reporters");

let jasmineExec = new Jasmine();

jasmineExec.loadConfigFile("./Tests/jasmine.json");
jasmineExec.configureDefaultReporter({
    showColors: false
});

let xunitReporter = new reporters.NUnitXmlReporter({
    savePath: __dirname,
    consolidateAll: false
});

jasmineExec.addReporter(xunitReporter);

jasmineExec.execute();