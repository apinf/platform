// RegExp allows following characters (listed inside square brackets):
// escaped: \w                 allows  a-zA-Z0-9_
//          \?\.\$\*\+\)\'\(   allow   ?.$*+)'(
// unescaped:                          /:#@!&,;=
// eslint-disable-next-line no-useless-escape
export const proxyBasePathRegEx = new RegExp(/^\/[\w\-\.\?\$\*\+\'\)\(/:#@!&,;=]+\/$/);
// eslint-disable-next-line no-useless-escape
export const apiBasePathRegEx = new RegExp(/^\/[\w\-\?\.\$\*\+\)\'\(/:#@!&,;=]*$/);
