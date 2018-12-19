/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// RegExp allows following characters (listed inside square brackets):
// escaped: \w                 allows  a-zA-Z0-9_
//          \?\.\$\*\+\)\'\(   allow   ?.$*+)'(
// unescaped:                          /:#@!&,;=
// eslint-disable-next-line no-useless-escape
export const proxyBasePathRegEx = new RegExp(/^\/[\w\-\.\?\$\*\+\'\)\(/:#@!&,;=]+\/$/);
// eslint-disable-next-line no-useless-escape
export const apiBasePathRegEx = new RegExp(/^\/[\w\-\?\.\$\*\+\)\'\(/:#@!&,;=]*$/);
// eslint-disable-next-line no-useless-escape
export const subSettingRequestHeaderRegEx = new RegExp(/^[^:]+:[^:]+$/);
// eslint-disable-next-line no-useless-escape
export const appendQueryStringRegEx = new RegExp(/^[(^=|\S)]+=[(^=|\S)]+$/);
