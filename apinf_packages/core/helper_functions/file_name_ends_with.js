/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/*
    Check file name for provided extensions
    @param {string} filename - File name with extension
    @param {array} suffixList - Array of file extension names e.g ['json', 'txt', 'yaml']
    */
export default function fileNameEndsWith (filename, suffixList) {
  // Low case the filename
  const filenameLowCase = filename.toLowerCase();

  // Iterating through extensions passed into suffixList array
  for (let i = 0; i < suffixList.length; i++) {
    // Calculate index to start search
    const fromIndex = filenameLowCase.length - suffixList[i].length;
    // parses line to check if filename contains current suffix
    const endsWith = filenameLowCase.indexOf(suffixList[i], fromIndex) !== -1;

    // if current extension found in filename then return true
    if (endsWith) return true;
  }

  // Otherwise the extension isn't allowed
  return false;
}
