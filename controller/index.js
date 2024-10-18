var {pool, testConnection} = require ('../config/db.js')


module.exports={

    inicio:async function (req,res) {
        console.log(req.body)
        var { Email, Contraseña}=req.body
        try {
            const query = 'SELECT id FROM perfil_estudiante WHERE correo = ? AND contraseña = ?';
            const [rows] = await pool.query(query, [Email,Contraseña]);
            console.log(rows[0]);
          if (rows[0]){
            res.cookie('username',rows[0], {
                // Duración de la cookie en milisegundos (15 minutos)
              httpOnly: true // La cookie solo se puede acceder desde el servidor
            });
            res.redirect('/taller/principal') 
          }
          else{
            res.send('ususario o contraseña no valido')
          }
            // Retorna el primer resultado o undefined
        } catch (error) {
            throw new Error(`Error al buscar estudiante: ${error}`);
        }

    },
    registararse: async  function(req,res) {
        console.log(req.body)
        var {Nombre, Email, Contraseña}=req.body
        try {
            const query = 'INSERT INTO perfil_estudiante (nombre, correo, contraseña) VALUES (?, ?, ?)';
            const [result] = await pool.query(query, [Nombre, Email, Contraseña]);
            console.log('Usuario insertado', result);
            res.cookie('username',{id:result.insertId}, {
                  // Duración de la cookie en milisegundos (15 minutos)
                httpOnly: true // La cookie solo se puede acceder desde el servidor
              });
            res.redirect('/taller/principal')
        } catch (error) {
            throw new Error(`Error al insertar: ${error}`);
        }
        
    },
    insertperfil:async function (req,res) {
         var {id} = req.cookies.username
         console.log(id)


        console.log(req.body)
        var {apellido,nie, especialidad,ano}=req.body

        var especial = `${ano}° ${especialidad}`
        console.log(especial)

        try {
            const query = `UPDATE perfil_estudiante SET nie = ?, apellido = ?,
            especialidad = ?                
            WHERE id = ?`;

            const [result] = await pool.query(query,[nie,apellido,especial,id]);
            if (result.affectedRows === 0) {
                res.send('No se encontró el perfil con el ID proporcionado');
            }else{
                res.redirect('/taller/principal')
            }
            
        } catch (error) {
            throw new Error(`Error al actualizar perfil: ${error.message}`);
        }
        
    }


}