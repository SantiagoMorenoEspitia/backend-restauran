const express = require('express');
const User = require('../models/User');
const router = express.Router()
const passport = require('passport');
const { reset } = require('nodemon');
router.get('/users/signin',(req,res)=>{
    res.render('users/signin')
});
router.get('/users/singup',(req,res)=>{
    res.render('users/signup')
})
router.post('/users/signin',async(req,res)=>{
    const {email,password}= req.body;
    const user = await User.findOne({email:email})
    if(!user){
        res.send({message:'Usuario no encontrado'});
    }else{
        console.log(user)
        const match =  await user.matchPassword(password)
        if(match){
            res.send(user)
        }else{
            res.send({message:'Contrasena incorrecta'})
        }
    }
})

router.post('/users/signup',async(req,res)=>{
    const {name,email,password,confirm_password}= req.body;
    const errors = []
    if(password != confirm_password){
        errors.push({text:'Password do not match'})  
    }
    if(password.length<=4){
        errors.push({text:'Password must be at least 4 characters'})
    }
     if(errors.length === 0){
        const user = await User.findOne({email:email})
        if(user){
            errors.push({text:'El correo ya existe'})
        }else{
            const newUser = new User({name,email,password})
            newUser.password = await newUser.encryptPassword(password)
            await newUser.save()
        }
    }
    res.send(errors)
})




module.exports = router;