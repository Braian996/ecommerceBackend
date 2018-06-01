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

const guid = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

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

    console.log(newData)

    return newData;
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

///////////////////////////////////////////////////////
// obtengo la lista de clientes
// http://localhost:4000/clientes
///////////////////////////////////////////////////////

app.get('/clientes', (req, res) => {
   fs.readFile('data.json', (error, data) => {
       let dataRetrieved = JSON.parse(data);
       res.send(dataRetrieved.clientes)

   })
});

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
});


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

    fs.readFile("data.json", (error, data) => {

        let clienteId = req.query.clienteId;

        let datosRecuperados = JSON.parse(data);
        console.log(clienteId);

        let clientesProductos = datosRecuperados.cliente_producto
            .filter(cliente_producto => clienteId ? cliente_producto.clienteId == clienteId : true);

        res.send(clientesProductos)
    })
});

app.get("/getClientByName/:name", (req, res) => {

    fs.readFile("data.json", (error, data) => {
        let dataRecovery = JSON.parse(data)
        let nameLowerCase = req.params.name.toLowerCase();
        let clients = dataRecovery.clientes.filter(client => client.nombre.toLowerCase().includes(nameLowerCase))
        res.send(clients)
    })

});


app.get("/getProductos", (req, res) => {



    fs.readFile("data.json", (error, data) => {

        let prod = req.query.nombre.toLowerCase();;
        let cat = req.query.categoria;
        let datosRecuperados = JSON.parse(data);
        let productos = datosRecuperados.productos.filter(producto =>
            (prod ? producto.nombre.toLowerCase().includes(prod) : true) && (cat ? producto.categoriaId == cat : true));
        res.send(productos)
    })
});

// POST
app.post('/categorias', (req, res) => {
    fs.readFile('data.json', (error, data) => {
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

        fs.writeFile('data.json', JSON.stringify(newCategoria));
        res.send(id);
    })
});

app.post('/clientes', (req, res) => {
    fs.readFile('data.json', (error, data) => {
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

        fs.writeFile('data.json', JSON.stringify(newCliente, null, 4));
        res.send(id);
    })
});

app.post('/productos', (req, res) => {
    fs.readFile('data.json', (error, data) => {
        let id = guid();
        let nombre = req.body.nombre;
        let categoriaId = req.body.categoriaId;
        let stock = parseInt(req.body.stock);


        let categoria = JSON.parse(data).categoria;
        let productos = JSON.parse(data).productos;
        let clientes = JSON.parse(data).clientes;
        let cliente_producto = JSON.parse(data).cliente_producto;
        let dataProduct = {id: id, nombre: nombre, categoriaId: categoriaId, stock: stock};

        let newData = {
            categoria: [...categoria],
            productos: [...productos, dataProduct],
            clientes: [...clientes],
            cliente_producto: [...cliente_producto]
        };

        fs.writeFile('data.json', JSON.stringify(newData, null, 4))
        res.send(id);
    })
});

app.post('/cliente_producto', (req, res) => {
    fs.readFile('data.json', (error, data) => {

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

            fs.writeFile('data.json', JSON.stringify(newCliente, null, 4))
            res.send(id);
        }




    })
});

// PUT

app.put('/clientes/:id', (req, res) => {
    fs.readFile('data.json', (error, data) => {
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


        fs.writeFile('data.json',JSON.stringify(newData,null,4));
        res.send(clienteUpdate);

    })
});

app.put('/categorias/:id', (req, res) => {

    fs.readFile('data.json', (error, data) => {
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


        fs.writeFile('data.json',JSON.stringify(newCategoria,null,4));
        res.send(array)

    })
});

// DELETE

app.delete('/producto/:id', (req, res) => {

    fs.readFile('data.json', (error, data) => {
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


        fs.writeFile('data.json',JSON.stringify(newProducto,null,4))
        res.send(array)

    })
});

app.delete('/clientes/:id', (req, res) => {

    fs.readFile('data.json', (error, data) => {
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


        fs.writeFile('data.json',JSON.stringify(newProducto,null,4))
        res.send(updateClient)

    })
});

app.delete('/categorias/:id', (req, res) => {

    fs.readFile('data.json', (error, data) => {
        let id = req.params.id;

        let categoria = JSON.parse(data).categoria;
        let productos = JSON.parse(data).productos;
        let clientes = JSON.parse(data).clientes;
        let cliente_producto = JSON.parse(data).cliente_producto;
        let updateClient = deleteElement(categoria, id);

        let newProducto = {
            categoria: updateClient,
            productos: [...productos],
            clientes: [...clientes],
            cliente_producto: [...cliente_producto]
        };


        fs.writeFile('data.json',JSON.stringify(newProducto,null,4));
        res.send(updateClient)

    })
});
