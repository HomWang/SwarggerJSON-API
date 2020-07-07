const path = require('path')
const fs = require('fs-extra')

const defaults = {
  tile: {
    Type: "Swargger",//类型 swargger YapiSwargger
    SourcePath: path.resolve(__dirname, path.join('api.js')),//json来源路径
    OutputPath: path.resolve(__dirname, path.join('swagger.json')),//api.js输出路径
  }
}

module.exports = function SwarggerToApi (options) {
  const register = Object.assign({}, defaults)
  //...暂时不做包发布和nuxt modul
}

module.exports.meta = require('./package.json')