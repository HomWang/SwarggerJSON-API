const path = require('path')
const SwaggerJsonApi = require('./SwaggerJsonApi.js')
let option = {
  FileUrl: "http://192.168.1.88:5000/swagger/v1/swagger.json",
  OutputPath: path.resolve(__dirname, './plugins/api/api.js'),
  Model: 'details'
}
SwaggerJsonApi(option)