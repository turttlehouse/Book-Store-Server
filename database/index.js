//modular approach
const mongoose = require('mongoose');
const connectionString = "mongodb+srv://buildandrun464:admin@cluster0.jnj9y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

//mongoose lai connect gar vannu paro
async function connectToDatabase(){
    await mongoose.connect(connectionString)
    console.log('connected to database successfully')
}

module.exports = connectToDatabase