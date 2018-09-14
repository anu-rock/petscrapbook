var observable = require("data/observable");
var observableArray = require("data/observable-array");
var frame = require("ui/frame");
var fileSystemService = require("~/data/fileSystemService");

function scrapbookPageModel(id) {
    var model = new observable.Observable();
    model.id = id;
    model.genders = ["Female", "Male", "Other"];
    model.calcAge = function(date) {
        var dob = Number(new Date(date));
        var now = Date.now();
        var diff = Math.abs(now - dob) / 1000 / 31536000;
        return diff.toFixed(1);
    };
    return model;
}

exports.onLoaded = function(args) {
    var page = args.object;
    var scrapbook = new observable.fromObject({
        pages: new observableArray.ObservableArray()
    });
    var pages = fileSystemService.fileSystemService.getPages();
    if (pages.length !== 0) {
        pages.forEach(function (item) {
            var model = new scrapbookPageModel(item.id);
            model.title = item.title;
            model.gender = item.gender;
            model.dob = item.dob;
            model.image = item.image;
            model.lat = item.lat;
            model.long = item.long;
            scrapbook.pages.push(model);
        });
    }
    page.bindingContext = scrapbook;
};

exports.onAddTap = function(args) {
    var page = args.object;
    var scrapbook = page.bindingContext;
    scrapbook.pages.push(new scrapbookPageModel());
    frame.topmost().navigate({
        moduleName: "views/scrapbookUpdate-page",
        context: { model: new scrapbookPageModel(scrapbook.pages.length) }
    });
};

exports.onItemTap = function(args) {
    var page = args.object;
    var scrapbook = page.bindingContext;
    frame.topmost().navigate({
        moduleName: "views/scrapbookUpdate-page",
        context: { model: scrapbook.pages.getItem(args.index) }
    });
};