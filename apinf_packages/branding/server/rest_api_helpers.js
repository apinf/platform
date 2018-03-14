/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Collections import
import Apis from '/apinf_packages/apis/collection';

// Npm imports
import _ from 'lodash';

// Call from PUT method contains both parameters.
// Call from POST method contains only bodyParams.
export function convertBodyParametersToBrandingData (bodyParams, brandingData = {}) {
  let featuredApis;

  if (bodyParams.featuredApis) {
    // Split string items by ','
    const splittedIds = bodyParams.featuredApis.split(',');

    // Remove spaces around value
    // eslint-disable-next-line arrow-body-style
    featuredApis = splittedIds.map(id => id.trim());
  }

  // Get colors object or an empty object by default
  const brandingColorsData = _.get(brandingData, 'colors', {});

  // Get social media links object or an empty object by default
  const socialMediaLinksData = _.get(brandingData, 'socialMediaLinks', {});

  // PUT method: if bodyParams value is undefined, use old value (if exists)
  // POST method: undefined bodyParams values remain undefined, because there are no old values
  return {
    siteTitle: bodyParams.siteTitle || brandingData.siteTitle,
    siteSlogan: bodyParams.siteSlogan || brandingData.siteSlogan,
    siteFooter: bodyParams.siteFooter || brandingData.siteFooter,

    colors: {
      primary: bodyParams.primary || brandingColorsData.primary,
      primaryText: bodyParams.primaryText || brandingColorsData.primaryText,
      coverPhotoOverlay: bodyParams.coverPhotoOverlay || brandingColorsData.coverPhotoOverlay,
      overlayTransparency: bodyParams.overlayTransparency || brandingColorsData.overlayTransparency,
    },
    socialMediaLinks: {
      facebook: bodyParams.facebook || socialMediaLinksData.facebook,
      twitter: bodyParams.twitter || socialMediaLinksData.twitter,
      github: bodyParams.github || socialMediaLinksData.github,
    },
    featuredApis: featuredApis || brandingData.featuredApis,
  };
}

export function validateProvidedApisIds (featureApis) {
  if (!featureApis || featureApis.length === 0) {
    // Error message is message
    return '';
  }

  // If a user provide more than 8 featured APIs
  if (featureApis.length > 9) {
    return 'The max number of featured APIs is 8';
  }

  // Get count of the existing APIs in featured API list
  const apisCount = Apis.find({ _id: { $in: featureApis } }).count();

  // If any featured API doesn't exist
  if (featureApis.length !== apisCount) {
    // Get IDs of the existing featured APIs
    const validApisIds = Apis.find({ _id: { $in: featureApis } })
      .map(api => { return api._id; });

    // Filter provided featured APIs IDs with existing APIs IDs
    // Get IDs of non-exist APIs
    const invalidApisIds = featureApis.filter(id => {
      // Return ID if it isn't included in the list of APIs IDs
      return validApisIds.indexOf(id) === -1;
    });
    // Error message
    return `No APIs exists with provided IDs ${invalidApisIds}`;
  }

  // Get count of the public APIs in featured API list
  const publicApisCount = Apis.find({ _id: { $in: featureApis }, isPublic: true }).count();

  //  If any featured API is not public
  if (featureApis.length !== publicApisCount) {
    // Get IDs of provided private APIs
    const privateApisIds = Apis.find({ _id: { $in: featureApis }, isPublic: false })
      .map(api => { return api._id; });

    // Error message
    return `Provided APIs ${privateApisIds} are private. Featured APIs must be public`;
  }

  // Error message is empty
  return '';
}
