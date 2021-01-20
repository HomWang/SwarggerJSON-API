const path = require("path");
const fs = require("fs-extra");

module.exports = function(options){
  const {SourcePath, OutputPath} = options
  //Read the swagger JSON file and accept the result as an object
  fs.readJson(path.resolve(__dirname, SourcePath), async (err, packageObj) => {
    if (err) console.error(err);
    let indexPath = '/index.js'
    let mkdirsArr = []
    if(OutputPath.includes('/') && OutputPath.split('/').length > 2){
      indexPath = OutputPath.replace(OutputPath.split('/')[OutputPath.split('/').length - 1], 'index.js')
      mkdirsArr = OutputPath.split('/')
      mkdirsArr.splice(mkdirsArr.length - 1, mkdirsArr.length - 2)
      mkdirsArr = mkdirsArr.join('/')
      mkdirsSync(mkdirsArr,() => {
        console.log(`Directory created successfully: ${mkdirsArr}`);
      })
    }
    const swarggerJSON = packageObj;
    const clientMethods = generateClientAPIMethods(swarggerJSON);
    const clientMethodsIndex = generateClientIndexMethods();
    const apiClientPath = path.resolve(
      __dirname,
      path.join(
        path.resolve(__dirname, OutputPath)
      )
    );
    const indexClientPath = path.resolve(
      __dirname,
      path.join(
        path.resolve(__dirname, indexPath)
      )
    );
    await fs.writeFile(apiClientPath, clientMethods);
    await fs.writeFile(indexClientPath, clientMethodsIndex);
  });

  // Creating directory synchronization method recursively
  function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }

  // Generate index.js
  function generateClientIndexMethods(){
    return (
      `
import getClientAPI from './api'

export default (ctx, inject) => {
  const axiosConfig = {
    baseURL: process.env.baseUrl
  }
  Object.assign(ctx.$axios.defaults, axiosConfig);
  ctx.$api = getClientAPI(ctx.$axios)
  inject('api', ctx.$api)
}
      `
    )
  }

  //Converted JS file
  function generateClientAPIMethods(methods) {
    const body = generateClientAPIMethodsBody(methods, "");
    return (
      "// https://www.npmjs.com/package/nuxt-swaggerjsonapi\n" +
      `export default client => ({\n${body}})`
    );
  }

  function isObject(val) {
    return val !== null && typeof val === "object" && !Array.isArray(val);
  }

  //Object resolution operation
  function generateClientAPIMethodsBody(
    methods,
    loadedMethods = "",
  ) {
    if (isObject(methods.paths)) {
      if(process.env.NODE_ENV !== 'production'){
        let oldVal = "";
        let i = 0;
        for (const prop of Object.keys(methods.paths)) {
          let propArray = prop.split("/");
          let propLength = propArray.length;
          if (propLength) {
            let funName = propArray[propLength - 1];
            let methodName = Object.keys(methods.paths[prop])[0];
            if (oldVal !== methods.paths[prop][methodName].tags[0] && i) {
              loadedMethods += `  },\n`;
            }
            if (oldVal !== methods.paths[prop][methodName].tags[0]) {
              loadedMethods += `  ${methods.paths[prop][methodName].tags[0]}: {\n`;
            }
            if (methods.paths[prop][methodName].summary && funName && methodName) {
              loadedMethods += `    /* \n`;
              loadedMethods += `    ** Interface name: ${methods.paths[prop][
                methodName
              ].summary.replace(/\n/, "    // ")}\n`;
              loadedMethods += `    ** Parameter structure: \n`;
              if (methods.paths[prop][methodName]["parameters"].length) {
                methods.paths[prop][methodName]["parameters"].map((item) => {
                  loadedMethods += `    **    ${JSON.stringify(item)}\n`;
                });
              }
              loadedMethods += `    ** methods: The entire API call (Directly copy, paste, remove the notes can be used directly): \n`;
              if (methods.paths[prop][methodName]["parameters"].length) {
                loadedMethods += `        ${
                  prop.split("/")[prop.split("/").length - 1]
                }(){ \n`;
                loadedMethods += `          let params = { \n`;
                methods.paths[prop][methodName]["parameters"].map((item) => {
                  if (item.name !== "AuthToken") {
                    loadedMethods += `            ${JSON.stringify(
                      item.name
                    )}: "",// ${JSON.stringify(item.description)}\n`;
                  }
                });
                loadedMethods += `          } \n`;
                loadedMethods += `          this.$api.${
                  prop.split("/")[prop.split("/").length - 2]
                }.${
                  prop.split("/")[prop.split("/").length - 1]
                }(params).then(res => { \n`;
                loadedMethods += `          }) \n`;
                loadedMethods += `        }, \n`;
              }
              loadedMethods += `    ** data(Vue use): \n`;
              if (methods.paths[prop][methodName]["parameters"].length) {
                loadedMethods += `        ${
                  prop.split("/")[prop.split("/").length - 1]
                }Params: { \n`;
                methods.paths[prop][methodName]["parameters"].map((item) => {
                  if (item.name !== "AuthToken") {
                    loadedMethods += `          ${JSON.stringify(
                      item.name
                    )}: "",// ${JSON.stringify(item.description)}\n`;
                  }
                });
                loadedMethods += `        } \n`;
              }
              loadedMethods += `    */ \n`;
            }
            loadedMethods += `    ${funName} (params) {\n`;
            loadedMethods += `      return client.${methodName}('${prop}', ${
              methodName == "get" ? "{" : ""
            }\n`;
            loadedMethods += `        params\n`;
            loadedMethods += `      ${methodName == "get" ? "}" : ""})\n`;
            loadedMethods += `    },\n`;
            oldVal = methods.paths[prop][methodName].tags[0];
            i++;
          }
        }
        loadedMethods += `  },\n`;
      }else {
        let oldVal = ""
        let i = 0
        for (const prop of Object.keys(methods.paths)) {
          let propArray = prop.split('/')
          let propLength = propArray.length
          if (propLength) {
            let funName = propArray[propLength - 1]
            let methodName = Object.keys(methods.paths[prop])[0]
            if (oldVal !== methods.paths[prop][methodName].tags[0] && i) {
              loadedMethods += `  },\n`
            }
            if (oldVal !== methods.paths[prop][methodName].tags[0]) {
              loadedMethods += `  ${methods.paths[prop][methodName].tags[0]}: {\n`
            }
            if (methods.paths[prop][methodName].summary && funName && methodName) {
              loadedMethods += `    // ${methods.paths[prop][methodName].summary.replace(/\n/, '    // ')}\n`
            }
            loadedMethods += `    ${funName} (params) {\n`
            loadedMethods += `      return client.${methodName}('${prop}', ${methodName == "get" ? '{' : ""}\n`
            loadedMethods += `        params\n`
            loadedMethods += `      ${methodName == "get" ? '}' : ""})\n`
            loadedMethods += `    },\n`
            oldVal = methods.paths[prop][methodName].tags[0]
            i++
          }
        }
        loadedMethods += `  },\n`
      }
    }
    return loadedMethods;
  }
}

