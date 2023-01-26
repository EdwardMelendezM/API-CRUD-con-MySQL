'use strict';

var movies = require('../models/movies'),
    express = require('express'),
    router = express.Router();

function error404(req, res, next) {
    let error = new Error(),
        locals = {
            title: 'Error 404',
            description: 'Recurso no encontrado',
            error: error
        }
    error.status = 404;
    res.render('error', locals)
}

router
    .use(movies)
    .get('/', function (req, res, next) {
        req.getConnection((err, movies) => {

            /* Variable para hacer consulta  */
            movies.query('SELECT* FROM movie', function (err, rows) {

                /* Parametros a enviar a index */
                let locals = {
                    title: 'Lista de Peliculas',
                    data: rows
                }
                /* Renderizado de index  */
                res.render('index', locals);
            })
        })
    })
    .get('/agregar', (req, res, next) => {
        /* Ruta para ir a agregar pelicula */
        res.render('add-movie', { title: 'Agregar Película' })
    })
    /* Metodo pos para ejecutar el insertar pelicula */
    .post('/', (req, res, next) => {
        /* Obtengo y genero conexion */
        req.getConnection((err, movies) => {

            /* Recibo los valores enviador por el input */
            let movie = {
                movie_id: req.body.movie_id,
                title: req.body.title,
                release_year: req.body.release_year,
                rating: req.body.rating,
                image: req.body.image
            }
            /* Ejecutamos la consuta para insertar datos*/
            movies.query('INSERT INTO movie SET ?', movie, (err, rows) => {

                /* Manejamos los errores */
                return (err) ? next(new Error('Error al Insertar')) : res.redirect('/')
            })
        })
    })

    .get('/editar/:movie_id', (req, res, next) => {
        /* Recuperamos el id enviado para editar */
        let movie_id = req.params.movie_id

        req.getConnection((err, movies) => {
            /* Recuperamos todos los datos del id */
            movies.query('SELECT * FROM movie WHERE movie_id = ?', movie_id, (err, rows) => {
                if (err) {
                    next(new Error('Registro No Encontrado'))
                }
                else {
                    let locals = {
                        title: 'Editar Película',
                        data: rows
                    }
                    res.render('edit-movie', locals)
                }
            })
        })
    })
    .post('/actualizar/:movie_id', (req, res, next) => {
        req.getConnection((err, movies) => {
            let movie = {
                movie_id: req.body.movie_id,
                title: req.body.title,
                release_year: req.body.release_year,
                rating: req.body.rating,
                image: req.body.image
            }
            movies.query('UPDATE  movie SET ? WHERE movie_id=?', [movie, movie.movie_id], (err, rows) => {
                return (err) ? next(new Error('Error al actualizar registro')) : res.redirect('/')
            })
        });
    })
    .post('/eliminar/:movie_id', (req, res, next) => {
        let movie_id = req.params.movie_id
        req.getConnection((err, movies) => {
            movies.query('DELETE FROM movie WHERE movie_id = ?', movie_id, (err, rows) => {
                return (err) ? next(new Error('Registro no encontrado')) : res.redirect('/');
            })
        })
    })
    .use(error404)
module.exports = router;