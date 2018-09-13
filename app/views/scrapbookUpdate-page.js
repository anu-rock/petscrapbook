var frame = require("ui/frame");
var camera = require("nativescript-camera");
var image = require("image-source");
var fileSystemService = require("~/data/fileSystemService");

exports.onLoaded = function(args) {
    var page = args.object;
    var scrapbookPage = page.navigationContext.model
    page.bindingContext = scrapbookPage;
};

exports.onAddImageTap = function(args) {
    var page = args.object;
    var scrapbookPage = page.bindingContext;
    camera.requestPermissions();
    camera
        .takePicture()
        .then(function (picture) {
            image.fromAsset(picture).then(function (imageSource) {
                scrapbookPage.set("image", imageSource);
            });
        });
};

exports.onDoneTap = function(args) {
    var page = args.object;
    var scrapbookPage = page.bindingContext;
    fileSystemService.fileSystemService.savePage(scrapbookPage);
    frame.topmost().navigate({
        moduleName: "views/scrapbook-page"
    });
};