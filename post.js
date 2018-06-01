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

app.listen(4001);

const guid = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

const formattedDate = (d = new Date) => {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${day}/${month}/${year}`;
};

const menosStock = (datas, cant, productId) => {
    let newData = datas.map(data => {
        if (data.id === productId) {
            data.stock = data.stock - cant;
        }
        return data;
    });

    return newData;
};

app.post('/categorias', (req, res) => {
    fs.readFile('db.json', (error, data) => {
        let id = guid();
        let nombre = req.body.nombre;


        let categoria = JSON.parse(data).categoria;
        let productos = JSON.parse(data).productos;
        let clientes = JSON.parse(data).clientes;
        let cliente_producto = JSON.parse(data).cliente_producto;

        let newCategoria = {
            categoria: [...categoria, {id: id, nombre: nombre}],
            productos: [...productos],
            clientes: [...clientes],
            cliente_producto: [...cliente_producto]
        };

        fs.writeFile('db.json', JSON.stringify(newCategoria, null, 4))
        res.send('sucess!');
    })
});

app.post('/clientes', (req, res) => {
    fs.readFile('db.json', (error, data) => {
        let id = guid();
        let nombre = req.body.nombre;


        let categoria = JSON.parse(data).categoria;
        let productos = JSON.parse(data).productos;
        let clientes = JSON.parse(data).clientes;
        let cliente_producto = JSON.parse(data).cliente_producto;
        let dataClient = {id: id, nombre: nombre};

        let newCliente = {
            categoria: [...categoria],
            productos: [...productos],
            clientes: [...clientes, dataClient],
            cliente_producto: [...cliente_producto]
        };

        fs.writeFile('db.json', JSON.stringify(newCliente, null, 4))
        res.send(id);
    })
});

app.post('/productos', (req, res) => {
    fs.readFile('db.json', (error, data) => {
        let id = guid();
        let nombre = req.body.nombre;
        let categoriaId = req.body.categoriaId;


        let categoria = JSON.parse(data).categoria;
        let productos = JSON.parse(data).productos;
        let clientes = JSON.parse(data).clientes;
        let cliente_producto = JSON.parse(data).cliente_producto;
        let dataProduct = {id: id, nombre: nombre, categoriaId: categoriaId};

        let newCliente = {
            categoria: [...categoria],
            productos: [...productos, dataProduct],
            clientes: [...clientes],
            cliente_producto: [...cliente_producto]
        };

        fs.writeFile('db.json', JSON.stringify(newCliente, null, 4))
        res.send(id);
    })
});

app.post('/cliente_producto', (req, res) => {
    fs.readFile('db.json', (error, data) => {

        let cantSolicitada = parseInt(req.body.stock);
        let id = guid();
        let clienteId = req.body.clienteId;
        let productoId = req.body.productoId;
        let fecha = formattedDate();
        let toF = true;
        const product = JSON.parse(data).productos.filter(pro => pro.id === productoId);

        if (product.length === 0){
            res.send(null)
        }
        if ((product[0].stock === 0 || product[0].stock < cantSolicitada)) {
            res.send('No hay stock suficiente');
        } else {
            let categoria = JSON.parse(data).categoria;
            let productos = JSON.parse(data).productos;
            let clientes = JSON.parse(data).clientes;
            let cliente_producto = JSON.parse(data).cliente_producto;
            let productoMenosStock = menosStock(productos, cantSolicitada, productoId);
            let dataBuy = {id: id, clienteId: clienteId, productoId: productoId, stock: cantSolicitada, fecha: fecha};

            let newCliente = {
                categoria: [...categoria],
                productos: productoMenosStock,
                clientes: [...clientes],
                cliente_producto: [...cliente_producto, dataBuy]
            };

            fs.writeFile('db.json', JSON.stringify(newCliente, null, 4))
            res.send(id);
        }




    })
});