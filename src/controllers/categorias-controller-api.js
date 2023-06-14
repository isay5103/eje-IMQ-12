// Desestructurar - pedir solo lo que requiero
const { request } = require('express');
const {miConexion} = require('../database/db')

const categoriasAPI = {};

categoriasAPI.getTodasCategorias = async (req, res, next)=>{
    try{
        const conexion =await miConexion();
        const [ rows ] = await conexion.query('SELECT * FROM categoria');
        if(rows.length>0){
            res.status(200).json({
                estado:1,
                mensaje:"Registros encontrados ", 
                categorias:rows
            })
        }else{
            res.status(404).json({
                estado:0,
                mensaje:"Registros no encontrados",
                categorias:[]
            })
        }
       
    }catch (error){
        next(error);
    }
}

categoriasAPI.getCategoriaPorId = async (req=request,res,next)=>{
    try {
        const {id} =req.params;
        const conexion = await miConexion();
        const [rows] = await conexion.query('SELECT * FROM categoria WHERE id =?', [id]);
        if(rows.length>0){
            res.status(200).json({
                estado:1,
                mensaje: "Categoria encontrada",
                categoria: rows[0]
            })
        }else{
            res.status(404).json({
                estado:0,
                mensaje: "Categoria no encontrada",
                categoria: rows
            })
        }
        res.json(resultado);
    } catch (error) {
        next(error)
        
    }
};
//Exportar el objeto

categoriasAPI.deleteCategoriaPorId = async(req=request,res,next)=>{
    try {
        const{id}= req.params;
        const conexion = await miConexion();
        const resultado =await conexion.query('DELETE FROM categoria WHERE id =?', [id]);
        if(resultado[0].affectedRows>0){
            res.status(200).json({
                estado:1,
                mensaje:"Categoria eliminada",
                
            })
        }else{
            res.status(404).json({
                estado:0,
                mensaje:"Categoria NO encontrada"
            })
        }
        res.json(resultado);
    } catch (error) {
        next(error)
    }
}

categoriasAPI.postCategoria = async(req=request,res,next)=>{
    try {
        const{descripcion,observaciones}=req.body;
        //validar que en el cuerpo de la solicitud exista descripcion y observaciones 
        if(descripcion == undefined || observaciones == undefined){
            //bad request (Solicitud incorrecta)
            res.status(400).json({
                estado:0,
                mensaje:"Solicitud incorrecta. Te faltan parametros"
            })
        } else{
            const conexion = await miConexion();
            const resultado = await conexion.query('INSERT INTO categoria(descripcion,observaciones) VALUES(?,?)',[descripcion, observaciones])
           if(resultado[0].affectedRows>0){
            res.status(201).json({
                estado:1,
                mensaje:"Categoria creada",
               categoria:{
                id             :    resultado[0].insertId,
                descripcion    :    descripcion,
                observaciones  :    observaciones
               }
            })
           }else{
            res.status(500).json({
                estado:0,
                mensaje: "Categoria NO registrada"
            })
           }
        }
    } catch (error) {
        next(error)
    }
}

categoriasAPI.putCategoriaPorId =async(req,res,next)=>{
    try {
        const {id} = req.params;
        const {descripcion,observaciones}= req.body;
        if(descripcion == undefined || observaciones == undefined){
            res.status(400).json({
                estado:0,
                mensaje:"Solicitud incorrecta. Faltan parametros"
            })
        }else{
            const conexion= await miConexion();
            const  resultado = await conexion.query('UPDATE categoria SET descripcion = ?, observaciones = ? WHERE id=?', [descripcion,observaciones,id]);
            if(resultado[0].affectedRows>0){
                if(resultado[0].changedRows>0){
                    res.status(200).json({
                        estado:1,
                        mensaje:"Categoria Actualizada",
                        categoria:{
                            id:id,
                            descripcion:descripcion,
                            observaciones:observaciones
                        }
                    })
                }else{
                    res.status(200).json({
                        estado:0,
                        mensaje:"Categoria sin cambios"
                    })
                }
            }else{
                res.status(404).json({
                    estado:0,
                    mensaje:"Categoria NO encontrada"
                })
            }
        }
    } catch (error) {
        next(error)
    }
}

module.exports=categoriasAPI;


// CRUD, 
//C = Función Crear                                         =POST
//R = Función Leer 1 por id o leer todas las categorias     =GET
//R = Función Leer todas las categorias                     =GET
//U = Función Actualizar por id                             =PUT
//D = Función Elimnar una categoria por id                  =DELETE
