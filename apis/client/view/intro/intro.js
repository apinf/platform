import { Template } from 'meteor/templating';

// Library imports
import { introJs } from 'intro.js';

Template.apiIntro.onRendered(() => {
  // Intro.js instance, for introduction walkthrough
  const intro = introJs();

  // Steps array placeholder, used to append introduciton steps
  const steps = [];

  // Get each API navigation tab element, to check for existance later
  const detailsTab = document.getElementById('api-details-tab');
  const documentationTab = document.getElementById('api-documentation-tab');
  const metadataTab = document.getElementById('api-metadata-tab');
  const feedbackTab = document.getElementById('api-feedback-tab');
  const backlogTab = document.getElementById('api-backlog-tab');
  const exportTab = document.getElementById('api-export-tab');
  const settingsTab = document.getElementById('api-settings-tab');
  const proxyTab = document.getElementById('api-proxy-tab');

  // Add welcome step
  steps.push({
    intro: 'Welcome!',
  });

  // Check for each API tab
  // add introduction step/text if tab exists

  // Check for details tab
  if (detailsTab) {
    // Add details step to introduction tour
    steps.push({
      element: '#api-details-tab',
      intro: 'This is the API Details tab',
    });
  }

  // Check for documentation tab
  if (documentationTab) {
    // Add documentation step to introduction tour
    steps.push({
      element: '#api-documentation-tab',
      intro: 'This is the API Documentation tab',
    });
  }

  // Check for metadata tab
  if (metadataTab) {
    // Add metadata step to introduction tour
    steps.push({
      element: '#api-metadata-tab',
      intro: 'This is the API Metadata tab',
    });
  }

  // Check for feedback tab
  if (feedbackTab) {
    // Add feedback step to introduction tour
    steps.push({
      element: '#api-feedback-tab',
      intro: 'This is the API Feedback tab',
    });
  }

  // Check for backlog tab
  if (backlogTab) {
    // Add backlog step to introduction tour
    steps.push({
      element: '#api-backlog-tab',
      intro: 'This is the API Details tab',
    });
  }

  // Check for export tab
  if (exportTab) {
    // Add export step to introduction tour
    steps.push({
      element: '#api-export-tab',
      intro: 'This is the API Export tab',
    });
  }

  // Check for settings tab
  if (settingsTab) {
    // Add settings step to introduction tour
    steps.push({
      element: '#api-settings-tab',
      intro: 'This is the API Settings tab',
    });
  }

  // Check for proxy tab
  if (proxyTab) {
    // Add settings step to introduction tour
    steps.push({
      element: '#api-proxy-tab',
      intro: 'This is the API Proxy tab',
    });
  }

  // Add steps to introduction
  intro.setOptions({
    steps,
    showStepNumbers: false,
  });

  // Start the introduction tour
  intro.start();
});
