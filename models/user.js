const mongoose=require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/authpractice')
.then(()=> console.log("DB connected ✅"))
.catch(err => console.log(err));

const userSchema=new mongoose.Schema({
    studentname:String,
    email:String,
    password:String,
})

module.exports=mongoose.model('student',userSchema);