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
    ],
  });

  intro.start();
});
