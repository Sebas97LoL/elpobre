var http = require("http");
var fs = require("fs");
var url = require("url");

// Crea el servidor Web, que será atendido por la funcion fnServer
var server = http.createServer( fnServer );

// funcion que atiende las peticiones
function fnServer(req, res){

console.log( "Peticion recibida: " + req.url );

// Descompone la URL en sus componentes
var params = url.parse( req.url );
// convierte las partes del path en un array
//var folders = params.pathname.split("/");

var archivo = params.pathname;

	if(req.url == "/login"){
		verificarUsuario(req, res);
	}else if(req.url == "/nosoyunarchivo"){
		registrarUsuario(req, res);
	}else{
		paginaPorDefecto(req, res);	
	}
}

var users = [];

function traerArchivosJson(req, res){
	var file = "users.json";
	fs.readFile(file, 'utf8', (err, str) => {
	if (err) throw err;

	json = JSON.parse(str);
	usuarios = json.usuarios;
	console.log(usuarios);
	for (var i = 0; i < usuarios.length; i++) {
		users.push(usuarios[i]);
	}

	});
}

function registrarUsuario(req, res){
	req.on('data', function (content){
		var user = JSON.parse(content);
		console.log(user);

		var existe = false;
		for (var i = 0; i < users.length; i++) {
			var data = users[i];
			if(data.usuario == user.usuario){
				existe = true;
			}
		}
		console.log(existe);
		if(existe){
			console.log("El usuario ya existe");
			res.writeHead(403);
		}else{
			console.log("LOL");
			users.push(user);
		}
		res.end("___");
	});
}

function verificarUsuario(req, res){
	//cuando le llegan datos del request
	req.on('data',datosListos);

	function datosListos(content){
		// deserializa el objeto
		var usr = JSON.parse(content);
		console.log(usr);
		console.log(usr.usuario);
		console.log(usr.clave);
		// Buscar en la lista de users
		var existe = false;
		for (var i = 0; i < users.length; i++) {
			var data = users[i];
			if(data.usuario == usr.usuario && data.clave == usr.clave){
				existe = true;
			}
		}
		if(existe){
			console.log("bienvenido");
		}else{
			res.writeHead(401);
			console.log("usuario o contraseña incorrectos");
		}
		//respuesta
		res.end("____")
	}	
}

function paginaPorDefecto(req, res){
var archivo = req.url;
console.log("|"+archivo+"|");
if(archivo.localeCompare("/") == 0){
	// cambie el archivo home.html por el el desea mostrar
	var readStream = fs.createReadStream( "index.html", {} );

	// Espera a que comience la conversación para entregar el archivo
	readStream.on('open', function () {
	res.writeHead(200, { });
	readStream.pipe(res);
	});
}else{

	try{
	// cambie el archivo home.html por el el desea mostrar
	var readStream = fs.createReadStream( ".\\" + archivo, {} );

	// Espera a que comience la conversación para entregar el archivo
	readStream.on('open', function () {
	res.writeHead(200, { });
	readStream.pipe(res);
	});

	readStream.on( 'error', hayError );

	// Controla en caso de error en la lectura
	function hayError(error){
	console.log( "Ocurrió un error" );
	console.log( error );

	res.writeHead(404, { 'content-type': 'text/html' });

	res.write( '<h1>Archivo no encontrado</h1>' );
	res.write( 'verifique la URL por favor' );
	res.end();
	// Equivalen a: res.end( 'Archivo no encontrado' );
	}

	} catch ( error ) {
	console.log( "Ocurrió un error" );
	console.log( error );

	}
}
}

// Si no recibe un numero de puerto por parametro en la linea de comando, usa el 8080
var port = process.argv[2] || 8080 ;

// Ejecuta el servidor
server.listen( port );

console.log( "Servidor HTTP corriendo en el puerto " + port);
console.log( "Ctrl-c para terminar");
traerArchivosJson();