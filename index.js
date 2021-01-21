const path = require('path')
const SwaggerJsonApi = require('./SwaggerJsonApi.js')
let nuxtOptions = {}

module.exports = function nuxtSwaggerJsonApi (moduleOptions) {
  const { register, ...swaggerJsonApiOptions } = Object.assign({}, this.options.swaggerJsonApi, moduleOptions)
  nuxtOptions = Object.assign({}, this.options.swaggerJsonApi, moduleOptions)
  
  if(process.env.NODE_ENV !== 'production'){
    SwaggerJsonApi(this.options.swaggerJsonApi)
  }
  
  // Register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    ssr: true,
    fileName: 'nuxt-swaggerjsonppi.js',
    options: {
      register,
      swaggerJsonApiOptions
    }
  })
}

module.exports.nuxtOptions = nuxtOptions

module.exports.meta = require('./package.json')
