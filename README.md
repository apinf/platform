# APInf API Management Framework

[![](https://nexus.lab.fiware.org/repository/raw/public/badges/chapters/api-management.svg)](https://www.fiware.org/developers/catalogue/)
[![License badge](https://img.shields.io/github/license/apinf/platform.svg)](https://opensource.org/licenses/EUPL-1.1)
[![Docker Pulls](https://img.shields.io/docker/pulls/apinf/platform.svg)](https://hub.docker.com/r/apinf/platform/)
[![](https://img.shields.io/badge/tag-fiware-orange.svg?logo=stackoverflow)](http://stackoverflow.com/questions/tagged/fiware)
<br>
[![Build Status](https://travis-ci.org/apinf/platform.svg?branch=feature%2F631-nightly-deployment)](https://travis-ci.org/apinf/platform)
![Status](https://nexus.lab.fiware.org/static/badges/statuses/apinf.svg)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Docker image](#docker-image)
- [Development status](#development-status)
- [Automated testing](#testing)
- [Nightly build](#nightly-build)
- [Contributing](#contributing)
- [Links](#links)


<!-- END doctoc generated TOC please keep comment here to allow auto update -->

[![Docs Status](https://img.shields.io/badge/docs-latest-brightgreen.svg?style=flat)](http://apinf.org/docs/)
[![Gitter](https://img.shields.io/badge/GITTER-JOIN_CHAT_%E2%86%92-1dce73.svg)](https://gitter.im/apinf/public)
[![Open Development Method badge](https://camo.githubusercontent.com/9065d5a7f38cb53b9934c0f1b15087e177360af6/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446576656c6f706d656e742532304d6574686f642d4f70656e2d626c75652e737667)](https://opendevelopmentmethod.org/)

## Docker image

[![](https://images.microbadger.com/badges/image/apinf/platform.svg)](http://microbadger.com/images/apinf/platform) [![](https://images.microbadger.com/badges/version/apinf/platform.svg)](http://microbadger.com/images/apinf/platform)

Docker images are hosted in Dockerhub: https://hub.docker.com/r/apinf/platform/tags

# APInf  API management
The APInf platform offers a comprehensive tool for API management. Building on [APInf Umbrella](https://github.com/apinf/api-umbrella), it provides enhanced user interface features for API managers and consumers alike.

For API consumers APInf provides simple key management, key usage analytics and API discovery along with API documentation. Managers have simplified workflow for common tasks, such as key management, rate limiting and viewing API usage analytics.

Why to use? If you have APIs and you are looking for additional control on API access, API documentation and analytics in one package, this is for you.  


|  :page_facing_up: [Site](https://apinf.io/)  | :mortar_board: [Academy](https://fiware-academy.readthedocs.io/en/latest/data-publication/apinf) | :whale: [Docker Hub](https://hub.docker.com/r/apinf/platform) |  :dart: [Roadmap](roadmap.md) |
|---|---|---|---|

# Development status
[![Community dashboard badge](https://img.shields.io/badge/Community-Dashboard-blue.svg)](https://dashboard.cauldron.io/goto/afe91edf4f1c66a3bcfd3717f12e43c5)
[![Stories in Ready](https://badge.waffle.io/apinf/platform.png?label=ready&title=Ready)](https://waffle.io/apinf/platform)

[![Throughput Graph](https://graphs.waffle.io/apinf/platform/throughput.svg)](https://waffle.io/apinf/platform/metrics)

# Testing

For automated testing we use [Sauce Labs](https://saucelabs.com).

# Nightly build
You can preview our latest version at [nightly.apinf.io](https://nightly.apinf.io). Feel free to register an account and test things out.

# Contributing
Please review our [Contributor Guide](https://github.com/apinf/platform/blob/develop/.github/CONTRIBUTING.md) for details on how to get involved with the project.

Please follow guidelines for community involvement in our [Code of Conduct](https://github.com/apinf/platform/blob/develop/CODE_OF_CONDUCT.md)

# Links

More about APInf: [apinf.com](https://apinf.com).

APInf saas service: [apinf.io](https://apinf.io).

## License

APInf is licensed under the [EUPL-1.1](LICENSE) License.

## FIWARE GE
APInf API Management Framework is a FIWARE Generic Enabler. Therefore, it can be integrated as part of any platform “Powered by FIWARE”. FIWARE is a curated framework of open source platform components which can be assembled together with other third-party platform components to accelerate the development of Smart Solutions.

You can find more info at the FIWARE developers website and the FIWARE website.

The complete list of FIWARE GEs and Incubated FIWARE GEs can be found at the [FIWARE Catalogue](https://www.fiware.org/developers/catalogue/)

## APInf API Management
This project is part of [FIWARE](http://fiware.org/) and has been rated as follows:

* **Version Tested:** ![ ](https://img.shields.io/badge/dynamic/json.svg?label=Version&url=https://fiware.github.io/Generic-Enablers/json/apinf.json&query=$.version&colorB=blue)
* **Documentation:** ![ ](https://img.shields.io/badge/dynamic/json.svg?label=Completeness&url=https://fiware.github.io/Generic-Enablers/json/apinf.json&query=$.docCompleteness&colorB=blue) ![ ](https://img.shields.io/badge/dynamic/json.svg?label=Usability&url=https://fiware.github.io/Generic-Enablers/json/apinf.json&query=$.docSoundness&colorB=blue)
* **Responsiveness:** ![ ](https://img.shields.io/badge/dynamic/json.svg?label=Time%20to%20Respond&url=https://fiware.github.io/Generic-Enablers/json/apinf.json&query=$.timeToCharge&colorB=blue) ![ ](https://img.shields.io/badge/dynamic/json.svg?label=Time%20to%20Fix&url=https://fiware.github.io/Generic-Enablers/json/apinf.json&query=$.timeToFix&colorB=blue)
* **FIWARE Testing:** ![ ](https://img.shields.io/badge/dynamic/json.svg?label=Tests%20Passed&url=https://fiware.github.io/Generic-Enablers/json/apinf.json&query=$.failureRate&colorB=blue)
![ ](https://img.shields.io/badge/dynamic/json.svg?label=Scalability&url=https://fiware.github.io/Generic-Enablers/json/apinf.json&query=$.scalability&colorB=blue)
![ ](https://img.shields.io/badge/dynamic/json.svg?label=Performance&url=https://fiware.github.io/Generic-Enablers/json/apinf.json&query=$.performance&colorB=blue)
![ ](https://img.shields.io/badge/dynamic/json.svg?label=Stability&url=https://fiware.github.io/Generic-Enablers/json/apinf.json&query=$.stability&colorB=blue)
© 2019 APInf Oy

