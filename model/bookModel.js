const mongoose = require('mongoose')
const Schema = mongoose.Schema

//new vanne bitikai kunai class lai instantiate gardai xu
//schema vaneko just skeleton ho jasle table/collection ko structure define garxa

//schema vanne class ma paramter pass gareko 
//column haruu kk hune ra tesko data type

//each column le kasto khalko data type hold garne
const bookSchema = new Schema({
    bookName : {
        type : String,
        //unique vaneko same data dubai enter hudaina
        // unique : true,
        // required : true
    },
    bookPrice : {
        type : Number
    },
    isbnNumber :{
        type : Number
    },
    authorName : {
        type : String
    },
    publishedAt : {
        type : String
    },
    publication :{
        type : String
    },
    imageUrl :{
        type : String
    }

})

//book name ko table banaidey jun ma chai yo yo name ko field ra type hunu paro vaneko
const Book = mongoose.model('Book',bookSchema)

//so aba db ma kei operation garnu paro vane Book lai vanne
module.exports = Book
