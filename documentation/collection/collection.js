const DocumentationFiles = new FileCollection('DocumentationFiles', {
  resumable: true,
  resumableIndexName: 'documentation',
  http: [
    {
      method: 'get',
      path: '/id/:_id',
      lookup: function(params, query) {
        return {
          _id: params._id
        };
      }
    }
  ]
});

// List of popular language for SDK Code Generator
const LanguageList = ['Akka Scala', 'Android', 'Async Scala',
                     'Clojure', 'Cpprest', 'C#', 'C# .NET 2.0', 'Cwiki', 
                     'Dart', 'Dynamic HTML', 'Flash', 'Go', 'Groovy',
                     'HTML', 'Html2', 'Java', 'Javascript', 'Javascript Closure Angular', 'Jmeter', 
                     'Objective-C', 'Perl', 'PHP', 'Python', 'Qt 5 C++', 'Ruby', 
                     'Scala', 'Swagger JSON', 'Swagger YAML', 'Swift',
                     'Tizen', 'Typescript Angular', 'Typescript Angular2', 'Typescript Fetch', 'Typescript Node'];

// Interpretation some languages to parameter for creating URL 
const LanguageParams = {
      "C#": "csharp",
      "C# .NET 2.0": "CsharpDotNet2",
      "Objective-C": "objc",
      "Qt 5 C++": "qt5cpp",
      "Swagger JSON": "swagger"
    }
export { DocumentationFiles, LanguageList, LanguageParams };
