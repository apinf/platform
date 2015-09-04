# Apinf API Design
This document contains the design overview for the Apinf Administrative API.

## URL Route
The Apinf Administrative API will be designated by the `/api/` URL route:

```
https://example.com/api/.../
```

## Versioning
The Apinf API will change over time. As such, we will use a numbered versioning scheme. Versions will be indicated by integers, starting with **1**. Version numbers will be located in the project URL, such as:

```
https://example.com/api/v1/.../
```

## API Documentation
Initially, the Apinf Administrative API will be documented in [Swagger format](http://swagger.io). Swagger is chosen as it is open-source, vender-neutral, and supported by the Apinf platform itself.

## System Model
The Apinf system model contains several related data collections. Each collection will be represented by an unique endpoint, with the ability to perform traversals to related data sets.

### Users
Apinf users will be available via the `/users/` endpoint.

#### Individual Users
Individual users will be available via `/users/<userId>`

### API Backends
API Backends will be available via the `/backends/` endpoint.


