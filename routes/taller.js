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

router.post('/perfil',controll.insertperfil);

router.get('/prestamo',(req,res)=>[
    res.render('loans')
])

router.get('/buscarestudiante',controll.buscarEstudent_p)

router.get('/buscarHerra',controll.buscarTool)

router.post('/insertarPresta',controll.insertar_presta)

router.get('/returns',(req,res)=>{
    res.render('returns')

})

router.post('/devolver',controll.devolver)

router.get('/buscarprestamos',controll.buscarprestamos )


module.exports=router;