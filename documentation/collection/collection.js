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

export { DocumentationFiles, languageHashName };

