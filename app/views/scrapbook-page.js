var observableModule = require("data/observable");

exports.onLoaded = function(args){
    var page = args.object;
    var scrapbook = new observableModule.fromObject({
        genders: ["Female", "Male", "Other"],
        gender: null,
        date: null,
        title: null
    });
    
    page.bindingContext = scrapbook;
}