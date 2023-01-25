'use strict';

var app = require('./app'),
    server = app.listen(app.get('port'), () => {
        console.log(`Iniciando express en el puerto ${app.get('port')}`)
    })