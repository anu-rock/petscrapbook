var observableModule = require("data/observable");
var frame = require("ui/frame");

exports.onLoaded = function(args) {
    var page = args.object;
    var home = new observableModule.fromObject({
        header: "Pet Scrapbook",
        footer: "Brosteins ©2016"
    });
    page.bindingContext = home;
};

exports.onContinueTap = function(args) {
    frame.topmost().navigate({
        moduleName: "views/scrapbook-page"
    });
};