import { Meteor } from 'meteor/meteor';

const fs = require('fs');


Meteor.methods({
  getPlatformVersion () {
    // Retrieve the latest version number from package.json

    // Create string with current filesystem path and filename
    const filePath = `${process.env.PWD}/package.json`;

    // Read the contents of the package.json
    const fileContents = fs.readFileSynnc(filePath);

    // Parse package.json into an object
    const packageDetails = JSON.parse(fileContents);

    // Return the version number
    return packageDetails.version;
  },
});
