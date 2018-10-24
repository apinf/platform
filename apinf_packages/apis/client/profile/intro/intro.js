/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';

// Npm packages imports
import { introJs } from 'intro.js';
import 'intro.js/introjs.css';

Template.apiIntro.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Function to show API introduction
  instance.showApiIntro = function () {
    // Intro.js instance, for introduction walkthrough
    const intro = introJs();

    // Steps array placeholder, used to append introduciton steps
    const steps = [];

    // Get each API navigation tab element, to check for existance later
    const detailsTab = document.getElementById('api-details-tab');
    const documentationTab = document.getElementById('api-documentation-tab');
    const metadataTab = document.getElementById('api-metadata-tab');
    const feedbackTab = document.getElementById('api-feedback-tab');
    const monitoringTab = document.getElementById('api-monitoring-tab');
    const backlogTab = document.getElementById('api-backlog-tab');
    const exportTab = document.getElementById('api-export-tab');
    const settingsTab = document.getElementById('api-settings-tab');
    const proxyTab = document.getElementById('api-proxy-tab');

    // Add welcome step
    steps.push({
      intro: TAPi18n.__('apiIntro_steps_welcome_intro'),
    });

    // Check for each API tab
    // add introduction step/text if tab exists

    // Check for details tab
    if (detailsTab) {
      // Add details step to introduction tour
      steps.push({
        element: '#api-details-tab',
        intro: TAPi18n.__('apiIntro_steps_details_intro'),
      });
    }

    // Check for documentation tab
    if (documentationTab) {
      // Add documentation step to introduction tour
      steps.push({
        element: '#api-documentation-tab',
        intro: TAPi18n.__('apiIntro_steps_documentation_intro'),
      });
    }

    // Check for metadata tab
    if (metadataTab) {
      // Add metadata step to introduction tour
      steps.push({
        element: '#api-metadata-tab',
        intro: TAPi18n.__('apiIntro_steps_metadata_intro'),
      });
    }

    // Check for feedback tab
    if (feedbackTab) {
      // Add feedback step to introduction tour
      steps.push({
        element: '#api-feedback-tab',
        intro: TAPi18n.__('apiIntro_steps_feedback_intro'),
      });
    }
    // Check for Monitoring Tab
    if (monitoringTab) {
      // Add export step to introduction tour
      steps.push({
        element: '#api-monitoring-tab',
        intro: TAPi18n.__('apiIntro_steps_monitoring_data'),
      });
    }

    // Check for backlog tab
    if (backlogTab) {
      // Add backlog step to introduction tour
      steps.push({
        element: '#api-backlog-tab',
        intro: TAPi18n.__('apiIntro_steps_backlog_intro'),
      });
    }

    // Check for export tab
    if (exportTab) {
      // Add export step to introduction tour
      steps.push({
        element: '#api-export-tab',
        intro: TAPi18n.__('apiIntro_steps_export_intro'),
      });
    }

    // Check for settings tab
    if (settingsTab) {
      // Add settings step to introduction tour
      steps.push({
        element: '#api-settings-tab',
        intro: TAPi18n.__('apiIntro_steps_settings_intro'),
      });
    }

    // Check for proxy tab
    if (proxyTab) {
      // Add settings step to introduction tour
      steps.push({
        element: '#api-proxy-tab',
        intro: TAPi18n.__('apiIntro_steps_proxy_intro'),
      });
    }

    // Get translation strings for introduction user interface elements
    const nextLabel = TAPi18n.__('apiIntro_nextLabel');
    const prevLabel = TAPi18n.__('apiIntro_previousLabel');
    const skipLabel = TAPi18n.__('apiIntro_skipLabel');
    const doneLabel = TAPi18n.__('apiIntro_doneLabel');

    // Configure introduction options
    intro.setOptions({
      steps,
      nextLabel,
      prevLabel,
      skipLabel,
      doneLabel,
      showStepNumbers: false,
    });

    // Start the introduction tour
    intro.start();
  };
});

Template.apiIntro.events({
  'click #api-intro': function (event, templateInstance) {
    // Update user tour status reactive variable
    templateInstance.showApiIntro();
  },
});
