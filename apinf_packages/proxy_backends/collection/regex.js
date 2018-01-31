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

/*
	Topic is a string of segments joined by /. A segment is either:
		a string of letters, numbers or literals - or _
		Or just the literal +
	In addition, the last segment can be a literal #.
*/
export const topicPrefixRegEx = new RegExp(/^\/[\w-]+\/$/);
// Topic must begin with alphanumeric. Allowed character is / and end with + or # delimited by /
export const topicRegEx = new RegExp(/^(([\w-]+|\+)\/)*([\w-]+|\+|#)$/);
