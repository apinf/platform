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
- [API Umbrella Dashboard](#api-umbrella-dashboard)
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

# APInf  Dashboard
The APInf platform offers a comprehensive tool for API management. Building on [API Umbrella](http://nrel.github.io/api-umbrella/), it provides enhanced user interface features for API managers and consumers alike.

For API consumers APInf provides simple key management, key usage analytics and API discovery along with API documentation. Managers have simplified workflow for common tasks, such as key management, rate limiting and viewing API usage analytics.


|  :page_facing_up: [Site](https://apinf.io/)  | :mortar_board: [Academy](https://fiware-academy.readthedocs.io/en/latest/data-publication/apinf) | :whale: [Docker Hub](https://hub.docker.com/u/apinf/platform) |
|---|---|---|

# Development status
[![Community dashboard badge](https://img.shields.io/badge/Community-Dashboard-blue.svg)](https://dashboard.cauldron.io/goto/afe91edf4f1c66a3bcfd3717f12e43c5)
[![Stories in Ready](https://badge.waffle.io/apinf/platform.png?label=ready&title=Ready)](https://waffle.io/apinf/api-umbrella-dashboard)

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

# Roadmap
This section elaborates on proposed new features or tasks to which are expected to be added to the product in the  foreseeable future.  There should be  no assumption of a commitment to deliver these features on specific dates or in the order given. The development team will be doing their best to follow the proposed dates and priorities, but please bear in mind that plans to work on a given feature or task may be revised.  All information is provided for as a general guidelines only,  and this section may be revised to provide newer information at any time.

This product is an Incubated FIWARE Generic Enabler.  If you would like to learn about the overall Roadmap of FIWARE, please check section "Roadmap" on the FIWARE Catalogue.

**Short term (next release of the product)**
The following list of features are planned to be addressed in the short term, and incorporated in the next release of the product planned for February 2019:
- Meteor update to 1.6 or let's see how high we get
- Package updates related to Meteor update
- New "Next" UI. Redesigned more simplified user flow and UI. It's going to be great!
  
**Medium term (9 months following next release)**
The following list of features are planned to be addressed in the medium term, typically within the subsequent release(s) generated in the next 9 months after next planned release:
- Context broker tenant management integration and feature enrichment. Deepens our FIWARE co-operation and enriches APInf Cloud solution
- Wirecloud based analytics for right time data and historical data. This enables API users to see data analytics. Now we have operational dash, which shows API performance, but nothing about actual data. This is to be user controlled feature.
- Business API Ecosystem integration, basic features. Idea is to provide tool for API owners to do basic monetization.
- Proxy 42 basic integration, new proxy alternative for API umbrella
- Better mqtt broker integration. Now you *can* have a broker but real functionality is not there
- Process improvements and other technical requirement fullfillment to be a GE instead "incubated"

**Long term (some time in the future)**
The following list of features are proposals regarding the longer-term evolution of the product even though development of these features has not yet been scheduled for a release in the near future.  Please feel free to contact us if you wish to get involved in the implementation or influence the roadmap
- True data analytics
- Improved monetization
- Continue Proxy 42 integration

Long term goals can be a bit illusive, so we keep those high level.

If you have any questions about roadmap or other things here, do give us a ping here or email: info@apinf.io

---

## License

APInf is licensed under the [EUPL-1.1](LICENSE) License.

© 2018 APInf Oy

