var observableModule = require("data/observable");

var page;
var closeCallback;
var model;

exports.onLoaded = function(args) {
    page = args.object;
};

exports.onShownModally = function(args) {
    closeCallback = args.closeCallback;
    model = new observableModule.fromObject({
        date: new Date(args.context.dob)
    });
    page.bindingContext = model;
};

exports.onDoneTap = function(args) {
    closeCallback(model.date);
};