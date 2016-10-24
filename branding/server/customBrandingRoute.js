import { Router } from 'meteor/iron:router';
import { Branding } from '/branding/collection';

Router.route('customStyle', {
  where: 'server',
  path: '/custom.style.css',
  action () {
    const branding = Branding.findOne();
    let styleString;
    let primaryColor;
    let primaryColorText;


    if (branding && branding.colors && branding.colors.primary) {
      primaryColor = branding.colors.primary;
    }

    if (branding && branding.colors && branding.colors.primaryText) {
      primaryColorText = branding.colors.primaryText;
    }

    styleString = `
.main-navigation {
  background-color: ${primaryColor} !important;
  color: ${primaryColorText} !important;
}
`

    const headers = { 'Content-type': 'text/css' };
    this.response.writeHead(200, headers);
    this.response.end(styleString);
  },
});
