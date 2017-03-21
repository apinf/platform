/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// The most part of list items can convert to user friendly name by standard method
// The method is to replace dash on space and to do the capital letter of each word
// Some language names can't be convert by standard method.
// Variable 'specificLanguageNames' keeps specific names
const specificLanguageNames = {
  'dynamic-html': 'Dynamic HTML',
  csharp: 'C#',
  CsharpDotNet2: 'C# .NET 2.0',
  html: 'HTML',
  objc: 'Objective-C',
  php: 'PHP',
  qt5cpp: 'Qt 5 C++',
  swagger: 'Swagger JSON',
  'swagger-yaml': 'Swagger YAML',
};

export default specificLanguageNames;
