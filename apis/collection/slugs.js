// Collection imports
import Apis from './';

Apis.friendlySlugs({
  // Field is a base the slug form
  slugFrom: 'name',
  // Slug will be stored to field
  slugField: 'slug',
  // Create Slug if document is updated and the slug has not been created yet
  createOnUpdate: true,
  // Slug is unique
  distinct: true,
  // Don't change slug
  updateSlug: false,
  // Translates characters with accents to URL compatible characters
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
