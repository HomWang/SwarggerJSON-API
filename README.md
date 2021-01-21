---
title: "Introduction"
description: "The nuxt-swaggerjsonapi module for Nuxt"
position: 1
category: ""
menuTitle: "Introduction"
features:
  - Automatically add API to application
  - Quickly copy API method and data to page, component, layout, vuex and Middleware
  - Friendly @nuxtjs/axios integration
---

## Setup

### Add nuxt-swaggerjsonapi dependency to your project

```js
npm install nuxt-swaggerjsonapi
or
yarn add nuxt-swaggerjsonapi
```

#### Recommended use @nuxtjs/axios

```js
yarn add @nuxtjs/axios
```

### Then add it to the modules section in your nuxt.config.js

```js
export default {
  modules: ["@nuxtjs/axios", "nuxt-swaggerjsonapi"],
  plugins: ["~plugins/api"],
};
```

### Configure

```js
const path = require("path");
export default {
  modules: ["@nuxtjs/axios", "nuxt-swaggerjsonapi"],
  plugins: ["~plugins/api"],

  swaggerJsonApi: {
    SourcePath: path.resolve(__dirname, "swagger.json"),
    OutputPath: path.resolve(__dirname, "./plugins/api/api.js"),
    Model: "details",
  },
};
```

- Sourcepath: Swagger.json route
- OutputPath: Api.js route

## Development environment api.js And formal environment api.js The difference between

### Model: "" (default)

```js
// getUserInfo
```

### Model: "details"

```js
/* 
** Interface name: getUserInfo
** Parameter structure: 
**    {"name":"AuthToken","in":"header","description":"Token info"}
** methods: The entire API call (Directly copy, paste, remove the notes can be used directly): 
    GetUserCloudAccount(){ 
      let params = { 
      } 
      this.$api.Account.GetUserCloudAccount(params).then(res => { 
      }) 
    }, 
** data(Vue use): 
    GetUserCloudAccountParams: { 
    } 
*/
```

## Author

- [Hom Wang](https://github.com/516310460)

## LICENSE

[MIT](LICENSE)
