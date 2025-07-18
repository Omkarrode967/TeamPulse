const express = require('express')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const userModel = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/task');
const dashboardRoutes = require('./routes/dashboard');
const authMiddleware = require('./middleware/authMiddleware');
const app = express()
const port = process.env.PORT || 3000;
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/teampulse';
console.log('MONGO_URI:', process.env.MONGO_URI);
mongoose.connect(mongoUri, {

}).then(() => {
  console.log("Connected to MongoDB:", mongoUri);
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});



app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080'
  ],
  credentials: true,
}));


app.use(bodyParser.json())

app.use("/api/projects", authMiddleware, projectRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);
app.use('/api',authMiddleware, dashboardRoutes);

app.get('/', (req, res) => {
  res.send("TeamPulse API is running!")
})

app.post('/SignUp',(req,res) => {
  let {username, email, password} = req.body;

  bcrypt.genSalt(10,(err,salt) => {
    bcrypt.hash(password,salt,async(err,hash)=>{
      try{
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ success: false, message: "Account already exists" });
        }
        let createdUser = await userModel.create({
        username: username,
        email,
        password: hash
      })
      let token = jwt.sign({ email }, process.env.JWT_SECRET || "defaultsecret");
      res.cookie("token",token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',          // true only in production with HTTPS
         sameSite: 'none',
         maxAge: 24 * 60 * 60 * 1000, 
      });
      res.json({ success: true, message: "Account created successfully", token: token })
      }catch (err) {
        res.status(500).json({ success: false, message: "Error creating account" });
      }
      
    })
  })
})

app.post('/SignIn', async function (req,res) {
  let user = await userModel.findOne({email:req.body.email});
  
  if(!user) res.json({ success: false, message: "something is wrong" })

  bcrypt.compare(req.body.password, user.password, function(err,result){
    if(result){
      let token = jwt.sign({email: user.email}, process.env.JWT_SECRET || "defaultsecret");
      res.cookie("token",token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',          // true only in production with HTTPS
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ success: true, message: "Signed in successfully", token: token })
    }
    else res.json({ success: false, message: "something is wrong" })
  })
})

app.post('/logout', (req, res)=> {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'none', // or 'None' if using cross-site requests with HTTPS
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
