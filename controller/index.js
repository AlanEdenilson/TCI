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
    insertperfil: async function (req,res) {
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
        
    },
    buscarEstudent_p: async function(req,res){
        var {id} = req.cookies.username

        try {
            const query = 'SELECT * FROM perfil_estudiante WHERE id = ? ';
            const [rows] = await pool.query(query, [id]);
            console.log(rows[0]);
          if (rows[0]){
            res.send(rows[0])
          }
          else{
            res.send('no se encontro al estudiante')
          }
            // Retorna el primer resultado o undefined
        } catch (error) {
            throw new Error(`Error al buscar estudiante: ${error}`);
        }

        
    },
    buscarTool:async function(req,res) {
        console.log(req.query.toolName)
       

        try {
            const query = `
                SELECT 
                    h.id,
                    h.nombre AS nombre_herramienta,
                    h.estado,
                    t.nombre AS nombre_tipo,
                    t.cantidad
                FROM herramientas h
                INNER JOIN tipo t ON h.id_tipo = t.id_tipo
                WHERE h.nombre = ?`;
            
            const [rows] = await pool.query(query,[req.query.toolName]);
            console.log(rows[0]);
          if (rows[0]){
            res.send(rows[0])
          }
          else{
            res.send('no se encontro al estudiante')
          }
            // Retorna el primer resultado o undefined
        } catch (error) {
            throw new Error(`Error al buscar estudiante: ${error}`);
        }

        
    },
    insertar_presta: async function (req,res) {
        console.log(req.body)
        var {id} = req.cookies.username
        console.log('id del estudiante : '+id)

        try {
          const query =`SELECT id FROM herramientas WHERE nombre = ?`
          const [rows] = await pool.query(query,[req.body.toolName]);
            console.log(rows[0].id);

          const query1= `INSERT INTO prestamos (perfil_estudiante_id, herramienta_id, estado) 
          VALUES (${id},${rows[0].id},'${req.body.toolStatus}')`
          const result = await pool.query(query1);
            console.log(result[0]);

          const query2 =`INSERT INTO devolucion (prestamo_id,estado_entrega) 
          VALUES (?,?)`
          const result2 = await pool.query(query2,[result[0].insertId,'pendiente']);
          console.log(result2[0]);

          res.redirect('/taller/principal')
        } catch (error) {
          
          console.error(error)
        }
    },
    devolver:async function(req,res) {
        console.log(req.body)
   
        
    }

}