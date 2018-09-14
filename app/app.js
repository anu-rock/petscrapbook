/*
In NativeScript, the app.js file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/
const application = require("application");

var dateConverter = function(value, format) {
    if (value === null || value === undefined || value === '') return '';
    var parsedDate = new Date(value);
    var result = format;
    var day = parsedDate.getDate();
    result = result.replace("DD", day);
    var month = parsedDate.getMonth() + 1;
    result = result.replace("MM", month);
    result = result.replace("YYYY", parsedDate.getFullYear());
    return result;
};

var resources = application.getResources();
resources.dateConverter = dateConverter;
resources.dateFormat = "MM/DD/YYYY";

application.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
