export function githubConfigurationValid (settings) {

  if (settings.githubConfiguration) {

    if (settings.githubConfiguration.clientId && settings.githubConfiguration.secret) {

      return true;
    }
  }

  return false;
}
