import { Blaze } from 'meteor/blaze';
import { Template } from 'meteor/templating';

Template.registerHelper('isTemplate', (templateName) => Blaze.isTemplate(Template[templateName]));
