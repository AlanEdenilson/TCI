const express = require('express');
const controll = require('../controller/index')
const router = express.Router();


router.post('/',controll.inicio)

router.post('/registrar',controll.registararse)

router.get('/principal',(req,res)=>{
    res.render('dashboard')
})

router.get('/perfil',(req,res)=>[
    res.render('profile')
])

router.post('/perfil',controll.insertperfil)


module.exports=router;