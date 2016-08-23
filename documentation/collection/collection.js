import _ from 'lodash';

const DocumentationFiles = new FileCollection('DocumentationFiles', {
  resumable: true,
  resumableIndexName: 'documentation',
  http: [
    {
      method: 'get',
      path: '/id/:_id',
      lookup: function (params, query) {
        return {
          _id: params._id
        };
      }
    }
  ]
});

export { DocumentationFiles };

// The most part of list items can convert to user friendly name by standard method
// The method is to replace dash on space and to do the capital letter of each word
// Some language names can't be convert by standard method.
// Variable 'languageHashName' keeps specific names
const languageHashName = {
  'dynamic-html': 'Dynamic HTML',
  'csharp': 'C#',
  'CsharpDotNet2': 'C# .NET 2.0',
  'html': 'HTML',
  'objc': 'Objective-C',
  'php': 'PHP',
  'qt5cpp': 'Qt 5 C++',
  'swagger': 'Swagger JSON',
  'swagger-yaml': 'Swagger YAML'
};

// Codegen server url
const url = 'https://generator.swagger.io/api/gen/clients';

// Get list of an available languages from Codegen server
HTTP.get(url, {}, function (error, result) {
  // Get information from Swagger API response
  const response = JSON.parse(result.content);

  // Save response to use it like url parameter in POST request
  urlParameters = response;

  // Create list of friendly language names
  LanguageList = [];

  _.forEach(response, function (language) {
    // Check on specific name
    let newLanguageName = languageHashName[language];

    // Convert name by standard method if it isn't specific name
    if (_.isUndefined(newLanguageName)) {
      // Split the name into words, ex. 'akka-scala' -> 'akka','scala'
      let newLanguageList = language.split('-');
      // Do the capital letter for each word
      newLanguageList = _.map(newLanguageList, function (word) { return _.capitalize(word); });
      // Join this list to string using space
      newLanguageName = newLanguageList.join(' ');
    }
    
    // Add new name to list of languages which show to user
    LanguageList.push(newLanguageName);
  });
});
