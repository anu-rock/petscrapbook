var observableModule = require("data/observable");
var application = require("application");

var page;
var closeCallback;
var model;

exports.onLoaded = function(args) {
    page = args.object;
};

exports.onShownModally = function(args) {
    closeCallback = args.closeCallback;
    model = new observableModule.fromObject({
        genders: application.getResources().genders,
        gender: args.context.gender
    });
    page.bindingContext = model;
};

exports.onDoneTap = function(args) {
    closeCallback(model.gender);
};