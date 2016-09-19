import { Template } from 'meteor/templating';
import { introJs } from 'intro.js';

Template.apiIntro.onRendered(() => {
  const intro = introJs();

  intro.setOptions({
    steps: [
      {
        intro: 'Welcome!',
      },
      {
        element: '#api-details-tab',
        intro: 'This is the API Details tab',
      },
      {
        element: '#api-documentation-tab',
        intro: 'This is the API Documentation tab',
      },
      {
        element: '#api-metadata-tab',
        intro: 'This is the API Metadata tab',
      },
      {
        element: '#api-feedback-tab',
        intro: 'This is the API Feedback tab',
      },
      {
        element: '#api-backlog-tab',
        intro: 'This is the API Details tab',
      },
      {
        element: '#api-export-tab',
        intro: 'This is the API Export tab',
      },
      {
        element: '#api-settings-tab',
        intro: 'This is the API Settings tab',
      },
    ],
  });

  intro.start();
});
