const dotenv = require("dotenv");
const path = require("path");
const env = dotenv.config(path.resolve(__dirname,"../",".env")).parsed
const loadEnv = function(path){
    return dotenv.config(path).parsed
}
module.exports = {
    env,
    loadEnv
};