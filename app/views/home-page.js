var observableModule = require("data/observable");

exports.onLoaded = function(args) {
    var page = args.object;
    var home = new observableModule.fromObject({
        header: "Pet Scrapbook",
        footer: "Brosteins ©2016"
    });
    page.bindingContext = home;
};