// const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const express = require('express');
const { stringify } = require('nodemon/lib/utils');
const { ListIndexesCursor } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;
const studentNameId={};

const uri = "mongodb+srv://admin:123@attendancemanagement.qdqgmkv.mongodb.net/?retryWrites=true&w=majority";
const UserSchema = mongoose.model('Users',{userId: String, password: String, personName: String, designation: String},);
const CourseSchema = new mongoose.Schema(
  { courseCode: String, courseName: String, faculty: [String], students: [String]}
) 
const addAttendanceSchema = new mongoose.Schema(
  { courseCode: String, faculty: String, date:String, students: [String], remarks: String}
) 
const courseTable = mongoose.model('Courses', CourseSchema);
const addAttendanceTable = mongoose.model('Attendance', addAttendanceSchema);

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
  var user = await UserSchema.find({userId:userData.userId , password:userData.password})
  if(user.length)
    return true;
     return false;
}  
app.post('/register', async (req,res)=> {
  let newData = new UserSchema({userId:req.body.userId,password:req.body.password,personName:req.body.personName,designation:req.body.designation});
  await newData.save().then((result)=> {
    res.json({status:"Successful"})
  }).catch((err)=> {
    res.json({status:"Error"})
  })
  console.log(newData );
}); 
app.get('/students',async(req,res)=> {
  const List= await UserSchema.find({designation:"Student"},'personName userId');
  res.json({List:List});
  // console.log(List);
}) ;
app.get('/faculties',async(req,res)=> {
  const facultyData= await UserSchema.find({designation:"Faculty"},'personName userId');
  res.json({facultyData:facultyData});
  // console.log(List);
});
app.post('/getCourses',async(req,res)=> {
  const List= await courseTable.find({faculty:req.body.fac},'courseCode courseName');
  res.json({List:List});
  // for(let i=0;i<List.length;i++)
  // console.log(List[i].students);
});
app.post('/createCourse', async (req,res)=> {
  let newData = new courseTable({courseCode:req.body.courseCode,courseName:req.body.courseName,faculty:req.body.faculty,students:req.body.students});
  await newData.save().then((result)=> {
    res.json({status:"Success"})
  }).catch((err)=> {
    res.json({status:"Failed"})
  })
  // console.log(newData);
}); 
app.post('/getRegisteredStudents', async(req,res)=> {
  const studentData= await courseTable.find({courseCode:req.body.courseCode},'students');
  const sIds = studentData[0].students;
  const sData= await UserSchema.find({designation:"Student"},'personName userId');
  const returnData=[];
  sData.forEach(details => {
     studentNameId[details.userId]=details.personName;
  }); 
  sIds.forEach(sId => {
    returnData.push({"userId":sId,"personName":studentNameId[sId]});
  }); 
  res.json({returnData:returnData});
}) 

app.post('/addAttendance',async(req,res)=> {
 let newData= new addAttendanceTable({courseCode:req.body.cid,faculty:req.body.facId,date:req.body.date,students:req.body.stuId,remarks:req.body.remarks})
  await newData.save().then((result)=> {
  res.json({status:"Success"})
}).catch((err)=> {
  res.json({status:"Failed"})
})
})
