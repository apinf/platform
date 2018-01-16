/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

const descriptionBranding = {
  // --------------------------------------------
  general: `
  ## APInf Branding REST API

  APInf Branding REST API enables branding APInf site via a simple API.
  With this API you can list, add, update and remove (CRUD) the APInf Branding settings.
  - site title, slogan, footer, colors, social media links, etc.

  In order to be able to manage Branding settings, you have to have an account
  to APInf with admin priviledges.

  ### Authentication

  Authentication is implemented according to functionality in [Restivus Swagger](https://github.com/apinf/restivus-swagger).
  All GET, POST, PUT and DELETE methods require valid authentication.


  #### Steps in authentication

  1. The user must have a valid user account.
  2. The user logs in via API.
  * The username and password are given as parameters in login request.
  * The login credentials (a **user ID** and a **auth token**) are returned in response.
  3. The login credentials are included as parameters in header of request message
  * in fields **X-User-Id** and **X-Auth-Token**.


  ### API keys

  * We require API key in all GET methods. You can get it by creating an account to Apinf system.
    * Create it now here https://apinf.io/sign-up


  ----

  ### Examples for each method to get you started


  Example call:

      GET /branding

  Result: returns branding settings of APInf API management site.
  More examples can be found within each method.

  ----

  Responses contain approriate HTTP code and in message payload extended infomation
  depending on case.

  Successful case:
  * HTTP code 2xx
  * the payload contains fields (except in HTTP 204 case)
    * status: value "success"
    * data: data of object(s)
      * Note! Only fields, which have a value are returned in response message.
        E.g. When site has no logo, no field "siteLogoUrl" is included in response message.


  Unsuccessful case:
  * HTTP code 3xx/4xx/5xx
  * the payload contains fields
    * status: value "fail"
    * message: extended information about reason of failure

  `,
  // --------------------------------------------
  get: `
  ### Lists Branding settings ###

  Returns the site's Branding setting parameter values, if they are given.
  - site id
  - site title
  - sote slogan
  - site footer
  - social media links
  - colors
    - primary color
    - primary text color
    - cover photo overlay
    - overlay transparency
  - addresses of site logo and cover image
  - list of featured APIs ids
  - privacy policy
  - terms of use
  - custom HTML Block
  - analytic code
  - the ids of featured APIs

  Example call:

      GET /branding
  `,
  // --------------------------------------------
  post: `
  ### Adds Branding settings ###

  Admin can add Branding settings of a site.
  On success, returns the Branding settings object.


  Parameters
  * siteTitle: Title of site
  * siteSlogan: Site slogan
  * siteFooter: Site footer
  * primary: primary color of site
  * primaryText: primary text color for site
  * coverPhotoOverlay: overlay for cover photo (RGB, e.g. #996633)
  * overlayTransparency: in percent, 100 = no transparency
  * featuredApis: list of featured APIs ids, max 8
  * facebook: link to Facebook
  * twitter: link to Twitter
  * github: link to GitHub

  In case a parameter validation fails, an error response is returned.
  `,
  // --------------------------------------------
  put: `
  ### Updates Branding settings ###

  Admin can update Branding settings of a site.
  On success, returns the updated Branding settings object.

  Parameters
  * siteTitle: Title of site
  * siteSlogan: Site slogan
  * siteFooter: Site footer
  * primary: primary color of site
  * primaryText: primary text color for site
  * coverPhotoOverlay: overlay for cover photo (RGB, e.g. #996633)
  * overlayTransparency: in percent, 100 = no transparency
  * featuredApis: list of featured APIs ids, max 8
  * facebook: link to Facebook
  * twitter: link to Twitter
  * github: link to GitHub

  In case a parameter validation fails, an error response is returned.
  `,
  // --------------------------------------------
  delete: `
  ### Deletes Branding settings ###

  Admin user can delete site Branding settings.

  Example call:

    DELETE /branding

  Result: deletes the Branding settings of site and responds with HTTP code 204.

  If match is not found, the operation is considered as failed.
  `,
};

export default descriptionBranding;
