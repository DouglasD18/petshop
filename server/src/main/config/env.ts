export default {
  port: process.env.PORT || 3001,
  mongo_uri: process.env.MONGO_URL || "mongodb://localhost:27017/pets"
}
