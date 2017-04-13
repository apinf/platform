/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Collection imports
import Organizations from './';

Organizations.friendlySlugs({
  slugFrom: 'name',
  slugField: 'slug',
  createOnUpdate: true,
  updateSlug: false,
  distinct: true,
  transliteration: [
    { from: 'àáâäåãа', to: 'a' },
    { from: 'б', to: 'b' },
    { from: 'ç', to: 'c' },
    { from: 'д', to: 'd' },
    { from: 'èéêëẽэе', to: 'e' },
    { from: 'ф', to: 'f' },
    { from: 'г', to: 'g' },
    { from: 'х', to: 'h' },
    { from: 'ìíîïи', to: 'i' },
    { from: 'к', to: 'k' },
    { from: 'л', to: 'l' },
    { from: 'м', to: 'm' },
    { from: 'ñн', to: 'n' },
    { from: 'òóôöõо', to: 'o' },
    { from: 'п', to: 'p' },
    { from: 'р', to: 'r' },
    { from: 'с', to: 's' },
    { from: 'т', to: 't' },
    { from: 'ùúûüу', to: 'u' },
    { from: 'в', to: 'v' },
    { from: 'йы', to: 'y' },
    { from: 'з', to: 'z' },
    { from: 'æ', to: 'ae' },
    { from: 'ч', to: 'ch' },
    { from: 'щ', to: 'sch' },
    { from: 'ш', to: 'sh' },
    { from: 'ц', to: 'ts' },
    { from: 'я', to: 'ya' },
    { from: 'ю', to: 'yu' },
    { from: 'ж', to: 'zh' },
    { from: 'ъь', to: '' },
  ],
});
