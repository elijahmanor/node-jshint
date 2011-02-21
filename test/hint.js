var sys = require('sys'),
    fs = require('fs'),
    jshint = require('./../packages/jshint/jshint.js');
    hint = require('./../lib/hint');

describe("hint", function () {

    it("collects files", function () {
        var targets = ["file1.js", "file2.js", ".hidden"];

        spyOn(sys, "puts");
        spyOn(jshint, "JSHINT").andReturn(true);
        spyOn(fs, "readFileSync").andReturn("data");

        spyOn(fs, "statSync").andReturn({
            isDirectory: jasmine.createSpy().andReturn(false)
        });
        
        hint.hint(targets);

        expect(fs.readFileSync.callCount).toEqual(2);
        expect(fs.readFileSync).not.toHaveBeenCalledWith(targets[2], "utf-8");
        // TODO: better
        expect(fs.readFileSync.argsForCall[0]).toContain(targets[0]);
        expect(fs.readFileSync.argsForCall[0]).toContain("utf-8");
        expect(fs.readFileSync.argsForCall[1]).toContain(targets[1]);
        expect(fs.readFileSync.argsForCall[1]).toContain("utf-8");
    });

    it("collects directory files", function () {
        var targets = ["dir", "file2.js"];

        spyOn(sys, "puts");
        spyOn(jshint, "JSHINT").andReturn(true);

        spyOn(fs, "readFileSync").andReturn("data");
        spyOn(fs, "readdirSync").andReturn(["file2.js"]);

        spyOn(fs, "statSync").andCallFake(function (path) {
            return {
                isDirectory: function () {
                    return path === targets[0] ? true : false;
                }
            };
        });
        
        hint.hint(targets);

        expect(fs.readFileSync.callCount).toEqual(2);

        expect(fs.readFileSync.argsForCall[0])
            .toContain(require('path').join(targets[0], "file2.js"));

        expect(fs.readFileSync.argsForCall[0]).toContain("utf-8");

        expect(fs.readFileSync.argsForCall[1]).toContain(targets[1]);
        expect(fs.readFileSync.argsForCall[1]).toContain("utf-8");
    });

    // TODO: collects directories
    // TODO: passes custom config
    // TODO: replace shebangs
    // TODO: reports something
    // TODO: custom reporter
    // TODO: handles jshint errors
    // TODO: handles file open error

});
