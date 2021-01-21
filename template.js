const path = require('path')
const SwaggerJsonApi = require('./SwaggerJsonApi.js')
let option = {
  // SourcePath: path.resolve(__dirname, 'swagger.json'), 
  FileUrl: "http://localhost:8080/swagger.json",
  OutputPath: path.resolve(__dirname, './plugins/api/api.js'),
  Model: 'details'
}
SwaggerJsonApi(option)