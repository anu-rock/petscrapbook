var observable = require("data/observable");
var observableArray = require("data/observable-array");
var fileSystemService = require("~/data/fileSystemService");
var viewModule = require("ui/core/view");
var camera = require("nativescript-camera");
var geolocation = require("nativescript-geolocation");
var image = require("image-source");

var page;
var updateStackLayout;

exports.onLoaded = function(args) {
    page = args.object;
    updateStackLayout = viewModule.getViewById(page, "updateStackLayout");

    var scrapbook = new observable.fromObject({
        pages: new observableArray.ObservableArray(),
        selectedPage: null
    });

    var pages = fileSystemService.fileSystemService.getPages();

    if (pages.length !== 0) {
        pages.forEach(function (item) {
            var model = scrapbookPageModel();
            model.id = item.id;
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

function resetActivePage() {
    var scrapbook = page.bindingContext;
    scrapbook.pages.forEach(function (item) {
        item.set("isActive", false);
    });
    if (scrapbook.selectedPage != null) {
        scrapbook.selectedPage.set("isActive", true);
    }
}

exports.onAddTap = function(args) {
    var page = args.object;
    var scrapbook = page.bindingContext;
    scrapbook.pages.push(new scrapbookPageModel(scrapbook.pages.length));
    scrapbook.set("selectedPage", scrapbook.pages.getItem(scrapbook.pages.length - 1));
    resetActivePage();
};

exports.onItemTap = function(args) {
    var scrapbook = page.bindingContext;
    scrapbook.set("selectedPage", scrapbook.pages.getItem(args.index));
    updateStackLayout.bindingContext = scrapbook.selectedPage;
    resetActivePage();
};

exports.onBirthDateTap = function(args) {
    var modalPageModule = "views/selectDate-page";
    var context = { dob: updateStackLayout.bindingContext.dob };
    var fullscreen = true;
    page.showModal(
        modalPageModule,
        context,
        function closeCallback(dob) {
            updateStackLayout.bindingContext.set("dob", dob);
        },
        fullscreen
    );
};

exports.onGenderTap = function(args) {
    var modalPageModule = "views/selectGender-page";
    var context = { gender: updateStackLayout.bindingContext.gender };
    var fullscreen = true;
    page.showModal(
        modalPageModule,
        context,
        function closeCallback(gender) {
            updateStackLayout.bindingContext.set("gender", gender);
        },
        fullscreen
    );
};

exports.onAddImageTap = function (args) {
    var page = args.object;
    var scrapbookPage = updateStackLayout.bindingContext;
    geolocation.isEnabled().then(function (enabled) {
        if (!enabled) {
            geolocation.enableLocationRequest();
        }
    });
    camera.requestPermissions();
    camera
        .takePicture({ width: 100, height: 100, keepAspectRatio: true })
        .then(function (picture) {
            image.fromAsset(picture).then(function (imageSource) {
                scrapbookPage.set("image", imageSource);
            });
        });
    geolocation.getCurrentLocation()
        .then(function (location) {
            scrapbookPage.set("lat", location.latitude);
            scrapbookPage.set("long", location.longitude);
        });
};

exports.onDoneTap = function(args) {
    var scrapbook = page.bindingContext;
    fileSystemService.fileSystemService.savePage(scrapbook.selectedPage);
    scrapbook.set("selectedPage", null);
    resetActivePage(); 
};

function scrapbookPageModel(id) {
    var model = new observable.Observable();
    model.id = id;
    model.isActive = false;
    model.calcAge = function (date) {
        var dob = Number(new Date(date));
        var now = Date.now();
        var diff = Math.abs(now - dpb) / 1000 / 31536000;
        return diff.toFixed(1);
    };
    return model;
}