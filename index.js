// const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const express = require('express');
const { stringify } = require('nodemon/lib/utils');
const app = express();
const port = 3000;

const uri = "mongodb+srv://admin:123@attendancemanagement.qdqgmkv.mongodb.net/?retryWrites=true&w=majority";
const UserSchema = mongoose.model('Users',{userId: String, password: String, personName: String, designation: String},);
const CourseSchema = new mongoose.Schema(
  { courseCode: String, courseName: String, faculty: [String], students: [String]}
)
const User = mongoose.model('Courses', CourseSchema);
app.use(express.json());
app.post('/login', async (req, res) => {
  let exist = await verifyUser(req.body);
  res.json({isExist:exist});
});


app.listen(port, async () =>  {
  console.log(`Example app listening on port ${port}`);
  await mongoose.connect(uri);
  console.log('Connected to DB...');
});
const verifyUser = async (userData) =>  {
  //TODO: Change it to verify
  var user = await UserSchema.find({userId:userData.username , password:userData.password})
  if(user.length)
    return true;
     return false;
}  
app.post('/register', async (req,res)=> {
  let newData = new UserSchema({userId:req.body.username,password:req.body.password,personName:req.body.personName,designation:req.body.designation});
  await newData.save().then((result)=> {
    res.json({status:"Successful"})
  }).catch((err)=> {
    res.json({status:"Error"})
  })
  console.log(newData );
}); 
app.get('/students',async(req,res)=> {
  const List= await UserSchema.find({designation:"Student"});
  res.json({List:List});
  // console.log(List);
}) ;
app.get('/faculties',async(req,res)=> {
  const List= await UserSchema.find({designation:"Teacher"});
  res.json({List:List});
  // console.log(List);
});
app.post('/createCourse', async (req,res)=> {
  let newData = new UserSchema({userId:req.body.username,password:req.body.password,personName:req.body.personName,designation:req.body.designation});
  await newData.save().then((result)=> {
    res.json({status:"Successful"})
  }).catch((err)=> {
    res.json({status:"Error"})
  })
  console.log(newData );
}); 
