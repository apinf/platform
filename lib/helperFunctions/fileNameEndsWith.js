/*
    Check file name for provided extensions
    @param {string} filename - File name with extension
    @param {array} suffixList - Array of file extension names e.g ['json', 'txt', 'yaml']
    */
export function fileNameEndsWith (filename, suffixList) {

  // variable that keeps state of is this filename contains provided extensions - false by default
  var state = false;

  // iterating through extensions passed into suffixList array
  for (var i=0; i <suffixList.length; i++){

    // parses line to check if filename contains current suffix
    var endsWith = filename.indexOf(suffixList[i], filename.length - suffixList[i].length) !== -1;

    // if current extension found in filename then change the state variable
    if (endsWith) state = true;

  }

  return state;
}
