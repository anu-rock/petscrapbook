var frame = require("ui/frame");
var camera = require("nativescript-camera");
var image = require("image-source");
var geolocation = require("nativescript-geolocation");
var fileSystemService = require("~/data/fileSystemService");

var page;

exports.onLoaded = function(args) {
    page = args.object;
    var scrapbookPage = page.navigationContext.model
    page.bindingContext = scrapbookPage;
};

exports.onAddImageTap = function(args) {
    var page = args.object;
    var scrapbookPage = page.bindingContext;
    geolocation.isEnabled().then(function (enabled) {
        if (!enabled) {
            geolocation.enableLocationRequest();
        }
    });
    camera.requestPermissions();
    camera
        .takePicture({
            width: 100,
            height: 100,
            keepAspectRatio: true
        })
        .then(function (picture) {
            image.fromAsset(picture).then(function (imageSource) {
                scrapbookPage.set("image", imageSource);
            });
            geolocation.getCurrentLocation().then(function (location) {
                scrapbookPage.set("lat", location.latitude);
                scrapbookPage.set("long", location.longitude);
            });
        });
};

exports.onBirthDateTap = function(args) {
    var modalPageModule = "views/selectDate-page";
    var context = { dob: page.bindingContext.dob };
    var fullscreen = true;
    page.showModal(
        modalPageModule,
        context,
        function closeCallback(dob) {
            page.bindingContext.set("dob", dob);
        },
        fullscreen
    );
};

exports.onGenderTap = function(args) {
    var modalPageModule = "views/selectGender-page";
    var context = { gender: page.bindingContext.gender };
    var fullscreen = true;
    page.showModal(
        modalPageModule,
        context,
        function closeCallback(gender) {
            page.bindingContext.set("gender", gender);
        },
        fullscreen
    );
};

exports.onDoneTap = function(args) {
    var page = args.object;
    var scrapbookPage = page.bindingContext;
    fileSystemService.fileSystemService.savePage(scrapbookPage);
    frame.topmost().goBack();
};