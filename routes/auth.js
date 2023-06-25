const express = require('express')
const jwt = require('jsonwebtoken');
const route = express.Router()
const {users} = require('../models/index.js')
const authorization = require('../middlewares/index.js')
const nodemailer = require('nodemailer');
const secret = 'hidden'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'richardtuyishime43@gmail.com',
        pass: 'gptwgtlgjnzpbfyi'
    }
})

route.get('/', async( req, res) => {
    const allusers = await users.findAll()
    res.json(allusers);
})

route.post('/add',async(req, res) => {
    const {username, email, password } = req.body
    const adduser =  await users.create({username, email, password })
    if (adduser) {
        const secret = 'hidden'
        const token = jwt.sign({ id: adduser.id }, secret, {expiresIn: '1h'})
        mailOptions = {
            from: "richardtuyishime43@gmail.com",
            to: email,
            subject: "Confirm Your Email",
            html: `Please confirm this <a href="http://localhost:3300/auth/confirmation/${token}">Click Here To Confirm Your Email</a>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Failed to send:" + error) 
            }else{
                 console.log("Mail sent successfully" + info.response)
            }
        })

        res.json({status: '201', message: "User added successfully"})
    } else {
        
    }
})

route.get('/protected', authorization, async(req,res) => {
    res.json({status: '200', message: "User protected"});
})

route.get('/confirmation/:token', authorization, async (req, res) => {
    try {
      const token = req.params.token;
      const decoded = jwt.verify(token, secret);
      const userid = decoded.id;
      const updateuser = await users.update({ confirmed: 'true' }, { where: { id: userid } });
      if (updateuser) {
       res.json({status: '200', message: "User Confirmed successfully"})
      } else {
        res.json({ message: "Failed to confirm user" });
      }
    } catch (error) {
      console.log(error);
    }
    
  });
  

route.get('/:id', async(req,res) => {
    // const id = req.params.id
    const user = await users.findByPk(req.params.id)
    res.json(user);
    
})

route.post('/login', async(req,res) => {
    const  {email, password} = req.body
    const userlog = await users.findOne({where : {email: email, password:password}})
    if (userlog) {
        const secret = "hidden"
        const payload = {
                    id: userlog.id,
                    email: userlog.email
                }
        const token = jwt.sign(payload, secret, {expiresIn: '2h'})
        res.json({status: '200', token: token, message: "User logged in"})
    } else {
        res.json({status: '203', message:'User not logged in'
    })
    }
})




module.exports  = route