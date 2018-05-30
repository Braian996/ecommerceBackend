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

app.listen(4000);

///////////////////////////////////////////////////////
// obtengo la lista de categorias
// url. http://localhost:4000/categorias
///////////////////////////////////////////////////////

app.get('/categorias', (req, res) => {
    fs.readFile('data.json', (error, data) => {
        let dataRetrieved = JSON.parse(data);
        res.send(dataRetrieved.categoria)
    })
 });

///////////////////////////////////////////////////////
// obtengo la lista de productos 
// url. http://localhost:4000/productos
///////////////////////////////////////////////////////

 app.get('/productos', (req, res) => {
    fs.readFile('data.json', (error, data) => {
        let dataRetrieved = JSON.parse(data);
        res.send(dataRetrieved.productos)
    })
 });

 ///////////////////////////////////////////////////////
// obtengo la lista de clientes
// http://localhost:4000
///////////////////////////////////////////////////////

app.get('/', (req, res) => {
   fs.readFile('data.json', (error, data) => {
       let dataRetrieved = JSON.parse(data);
       res.send(dataRetrieved.clientes)
   })
});


///////////////////////////////////////////////////////
// obtengo un cliente en particular
// url. http://localhost:4000/clientes/1
///////////////////////////////////////////////////////
app.get("/clientes/:id", (req, res) => {
    fs.readFile("data.json", (error, data) => {
        let datosRecuperados = JSON.parse(data)
        // console.log(req.params);
        let clientes = datosRecuperados.clientes.filter(cliente => cliente.id === req.params.id)

        res.send(clientes)
    })
})

///////////////////////////////////////////////////////
// obtengo un categoria en particular
// url. http://localhost:4000/categorias/1
///////////////////////////////////////////////////////
app.get("/categorias/:id", (req, res) => {
    fs.readFile("data.json", (error, data) => {
        let datosRecuperados = JSON.parse(data)
        // console.log(req.params);
        let categorias = datosRecuperados.categorias.filter(categoria => categoria.id === req.params.id)

        res.send(categorias)
    })
})

///////////////////////////////////////////////////////
// obtengo un producto en particular
// url. http://localhost:4000/productos/1
///////////////////////////////////////////////////////
app.get("/productos/:id", (req, res) => {
    fs.readFile("data.json", (error, data) => {
        let datosRecuperados = JSON.parse(data)
        // console.log(req.params);
        let productos = datosRecuperados.productos.filter(producto => producto.id === req.params.id)

        res.send(productos)
    })
})


///////////////////////////////////////////////////////
// obtengo todos los productos de un cliente en particular
// url. http://localhost:4000/cliente_producto/?clienteId=2
// O http://localhost:4000/cliente_producto
///////////////////////////////////////////////////////

app.get("/cliente_producto", (req, res) => {

    fs.readFile("db.json", (error, data) => {

        let clienteId = req.query.clienteId;

        let datosRecuperados = JSON.parse(data)
        console.log(clienteId);

        let clientesProductos = datosRecuperados.cliente_producto        
            .filter(cliente_producto => clienteId ? cliente_producto.clienteId == clienteId : true)

        res.send(clientesProductos)
    })
})

