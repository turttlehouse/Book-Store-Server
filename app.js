//importing
const express = require('express')
const app =   express() //invoking  0r const app = require('express')()
const connectToDatabase = require('./database');
const Book = require('./model/bookModel');

//cors package
const cors = require('cors')

app.use(cors(
    {
        origin : '* '
    }
))

app.use(express.json())
//react ma frontend navako case ma yo halne ho
//node bata nai frontend vako case ma
app.use(express.urlencoded({extended:true}))

// req,res is convention but you can use any name
// app.get("/",(bye,hello)=>{
//     hello.send("Hello World")
// })


// / vanne path ma get request aayo vane hello world print garne
// app.get("/",(req,res)=>{
//     res.send("Hello World")
// })

//connnectin to Db
connectToDatabase();

//multer config imports
const {storage,multer} = require('./middleware/multerConfig')
const upload = multer({storage:storage})

//storage folder accessible banauna lai
app.use(express.static('./storage/'));

//fs module for file system
const fs = require('fs');
const User = require('./model/userModel');

//add book
app.post("/book",upload.single("image"),async(req,res)=>{
    //kasaile yo api hit hano vane req ma airako hunxa 
    // console.log(req.body);

    // if(req.file.size >10 * 1024 * 1024){
    //     return res.status(400).json({
    //         message : 'File size must be less than 10 mb'
    //     })
    // }    


    let fileName;

    if(!req.file){
        fileName = "https://www.google.com/imgres?q=java%20book&imgurl=https%3A%2F%2Fwww.buddhapublication.com%2Fbooks%2F1494498239.jpg&imgrefurl=https%3A%2F%2Fwww.buddhapublication.com%2Fsingle%2Fjava-programming-including-advanced-features-zYn3g&docid=lzDzI1eJR7Z1LM&tbnid=ymrjR3Zx9NGqjM&vet=12ahUKEwisuoPv3sWKAxUQUGwGHXH_DWkQM3oECFkQAA..i&w=1026&h=1464&hcb=2&ved=2ahUKEwisuoPv3sWKAxUQUGwGHXH_DWkQM3oECFkQAA"
    }
    else {
        fileName = "http://localhost:5000/" + req.file.filename
    }
    //body bata data extract garna destructure garne
    const {bookName,bookPrice,isbnNumber,authorName,publishedAt,publication} = req.body;

    const existingBook = await Book.findOne({bookName});
    // console.log(existingBook);

    if(existingBook){
        return res.status(400).json({
            message : "Book with same name already exists"
        })
    }

    await Book.create({
        bookName,
        bookPrice,
        isbnNumber,
        authorName,
        publishedAt,
        publication,
        imageUrl : fileName
    })

    res.status(201).json({
        message : "Book created successfully"
    })


})

//get all book
app.get('/books',async(req,res)=>{
    const books = await Book.find()
    return res.status(200).json({
        message : 'Books fetched successfully',
        data : books
    })
})

//get single book
app.get('/book/:id',async(req,res)=>{

    //try catch ma halo vane request ma error aayo vane catch ma janxa
    try{

        const id = req.params.id
        const book = await Book.findById(id)
        
        //book not found message pauna lai valid mongoose id pathaunu parne hunxa
        //random id ma check gardaina 5f8f8c44b54764421b7156c1

        if(!book){
            return res.status(404).json({
                message : 'Book not found'
            })
        }

        return res.status(200).json({
            message : 'Book fetched successfully',
            data : book
        })
    }
    catch(err){
        return res.status(500).json({
            message : 'Internal server error'
        })
    }
})

//delete book
app.delete('/book/:id',async(req,res)=>{
    const id = req.params.id
    const book = await Book.findByIdAndDelete(id)
    return res.status(200).json({
        message : 'Book deleted successfully'
    })
})

//update book
app.patch('/book/:id',upload.single('image'),async(req,res)=>{
    const id = req.params.id
    // console.log(id);
    // if(req.file.size > 1024 * 1024){
    //     return res.status(400).json({
    //         message : 'File size must be less than 1mb'
    //     })
    // }
    const oldImage = await Book.findById(id)

    let fileName;
    if(req.file)
    {
        const oldImagePath = oldImage.imageUrl
        const localhostUrlLength = "http://localhost:5000/".length
        const FinalImagePathAfterCut = oldImagePath.slice(localhostUrlLength)
        fs.unlink('./storage/' + FinalImagePathAfterCut,(err)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log('Image deleted successfully')
            }
        })

        fileName = "http://localhost:5000/" + req.file.filename
    }
    //else ko case ma old image path nai rakhne ho but mongo ko case ma by default basxa old image path
    //sql ma chai else case ni handle garnu parxa
    
    const {bookName,bookPrice,isbnNumber,authorName,publishedAt,publication} = req.body

    await Book.findByIdAndUpdate(id,{
        bookName,
        bookPrice,
        isbnNumber,
        authorName,
        publishedAt,
        publication,
        imageUrl : fileName
    })

    return res.status(200).json({
        message : 'Book updated successfully'
    })
})   

//add user
// 1. Create a new user (POST request)
app.post('/user', async (req, res) => {
    const { fullName, gender, imageUrl, skills } = req.body;
  
    try {
      await User.create({
        fullName,
        gender,
        imageUrl,
        skills,
        });
      return res.status(201).json({ 
        message: 'User created successfully!',
     });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  });

// 2. Get all users (GET request)
app.get('/user', async (req, res) => {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching users',
        data : users
    });
    }
  });

// 3. Get a user by ID (GET request)
app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ 
            message: 'User not found' 
        });
      }
      res.status(200).json({
        message: 'User fetched successfully',
        data: user,
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching user', 
    });
    }
  }); 

  // 4. Delete a user by ID (DELETE request)
app.delete('/user/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({
            message: 'User not found'
        });
      }
      return res.status(200).json({
        message: 'User deleted successfully!',
    });
    } catch (error) {
      res.status(500).json({
         message: 'Error deleting user',
        });
    }
  });

// 4. Update a user by ID (PUT request)
app.patch('/user/:id', async (req, res) => {
    const { id } = req.params;
    const { fullName, gender, imageUrl, skills } = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { fullName, gender, imageUrl, skills },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ 
        message: 'User updated successfully!',
    });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
    }
  });

app.get("/",(req,res)=>{
    res.send("Book Store Server is Running....")
})

//nodejs ko yo mero project 3000 port ma run garne vaneko ho
app.listen(5000,()=>{
    console.log('Server is running on port 5000')
})