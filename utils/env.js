const path = require("path");
const env = require("dotenv").config({path: path.resolve(__dirname,"../",".env")});
const loadEnv = function(path){
    return dotenv.config({path})
}
module.exports = {
    env: env.parsed,
    loadEnv
};