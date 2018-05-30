const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

const replaceData = (datas, id_item, nombre) => {
    let newData = datas.map(data => {
        if (data.id === id_item) {
            data.nombre = nombre;
        }
        return data;
    });

    return newData;
};

const deleteElement = (dataRetrieved, id) => {
    let newData = dataRetrieved.filter(data => id !== data.id);

    return newData;
};

app.put('/clientes/:id', (req, res) => {
    fs.readFile('db.json', (error, data) => {
        let id = req.params.id;
        let nombre = req.body.nombre;

        console.log(nombre);

        let categoria = JSON.parse(data).categoria;
        let productos = JSON.parse(data).productos;
        let clientes = JSON.parse(data).clientes;
        let cliente_producto = JSON.parse(data).cliente_producto;

        let clienteUpdate = replaceData(clientes, id, nombre);

        let newData = {
            categoria: [...categoria],
            productos: [...productos],
            clientes: clienteUpdate,
            cliente_producto: [...cliente_producto]
        };


        fs.writeFile('db.json',JSON.stringify(newData,null,4));
        res.send(clienteUpdate);

    })
});

app.put('/categorias/:id', (req, res) => {

    fs.readFile('db.json', (error, data) => {
        var idCategoria = req.params.id;
        var nombre = req.body.nombre;
        
        let categoria = JSON.parse(data).categoria;
        let productos = JSON.parse(data).productos;
        let clientes = JSON.parse(data).clientes;
        let cliente_producto = JSON.parse(data).cliente_producto;
        var array = replaceData(categoria, idCategoria, nombre);
        
        let newCategoria = {
            categoria: array,
            productos: [...productos],
            clientes: [...clientes],
            cliente_producto: [...cliente_producto]
        };

        
        fs.writeFile('db.json',JSON.stringify(newCategoria,null,4));
        res.send(array)
        
    })
});

// DELETE

app.delete('/producto/:id', (req, res) => {

    fs.readFile('db.json', (error, data) => {
        let idProducto = req.params.id;
        
        let categoria = JSON.parse(data).categoria;
        let productos = JSON.parse(data).productos;
        let clientes = JSON.parse(data).clientes;
        let cliente_producto = JSON.parse(data).cliente_producto;
        let array = deleteElement(productos, idProducto);
        console.log(array)
        
        let newProducto = {
            categoria: [...categoria],
            productos: array,
            clientes: [...clientes],
            cliente_producto: [...cliente_producto]
        };

        
        fs.writeFile('db.json',JSON.stringify(newProducto,null,4))
        res.send(array)
        
    })
});

app.delete('/clientes/:id', (req, res) => {

    fs.readFile('db.json', (error, data) => {
        let id = req.params.id;
        
        let categoria = JSON.parse(data).categoria;
        let productos = JSON.parse(data).productos;
        let clientes = JSON.parse(data).clientes;
        let cliente_producto = JSON.parse(data).cliente_producto;
        let updateClient = deleteElement(clientes, id);
        
        let newProducto = {
            categoria: [...categoria],
            productos: [...productos],
            clientes: updateClient,
            cliente_producto: [...cliente_producto]
        };

        
        fs.writeFile('db.json',JSON.stringify(newProducto,null,4))
        res.send(updateClient)
        
    })
});

app.listen(4000);


