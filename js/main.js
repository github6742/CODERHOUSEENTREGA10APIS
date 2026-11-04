let listaPrecioArticulos = [];
let carritoCompras = [];
let articulosEncontrados = [];
//
const url = "./db/data.json";
class Articulo {
      constructor(id,
                  codigo, 
                  nombre, 
                  marca,
                  categoria,
                  precio){
        this.id = id,
        this.codigo = codigo;
        this.nombre = nombre;
        this.marca = marca;
        this.categoria = categoria;
        this.precio = precio;
      };
};
//
let carritoComprasStorage = (JSON.parse(localStorage.getItem("carritoCompras")) == null) ? ([]) : JSON.parse(localStorage.getItem("carritoCompras"));
if (carritoComprasStorage.length > 0) {
   localStorage.setItem("carritoCompras", JSON.stringify([...carritoComprasStorage]));
   carritoCompras = [...carritoComprasStorage];
}
//
carritoCompras.length > 0 && (localStorage.getItem("carritoComprasOculto") === "NO" || localStorage.getItem("carritoComprasOculto")===null ) && agregarListaArticulosHtml(carritoCompras);
//
let articulosEncontradosStorage = (JSON.parse(localStorage.getItem("articulosEncontrados")) == null) ? ([]) : JSON.parse(localStorage.getItem("articulosEncontrados"));
if (articulosEncontradosStorage.length > 0) {
  localStorage.setItem("articulosEncontrados",JSON.stringify([...articulosEncontradosStorage]));
  articulosEncontrados = [...articulosEncontradosStorage];
}
//
articulosEncontrados.length > 0 && buscarArticulosHtml(articulosEncontrados);
//
const articuloFormulario = JSON.parse(localStorage.getItem("articuloFormulario")) || {};
document.getElementById("idCrearArticuloCodigo").value = articuloFormulario.codigo || "";
document.getElementById("idCrearArticuloNombre").value = articuloFormulario.nombre || "";
document.getElementById("idCrearArticuloMarca").value = articuloFormulario.marca || "";
document.getElementById("idCrearArticuloCategoria").value = articuloFormulario.categoria || "";
document.getElementById("idCrearArticuloPrecio").value = articuloFormulario.precio || "";
document.getElementById("idBuscarArticuloCategoria").value = localStorage.getItem("idBuscarArticuloCategoria") || "";
//
function crearMensajeAvisoToast(texto){
//  
Toastify({
  text: texto,
  duration: 3000,
  destination: "#",
  newWindow: false,
  close:false,
  className: "toastLargoTop",
  gravity: "top", 
  position: "left", 
  stopOnFocus: true, 
  style: {
    background: "linear-gradient(to right, #00b09b, #96c93d)",
  }
}).showToast();
//
}
function crearMensajeTransaccionToast(texto){
//  
Toastify({
  text: texto,
  duration: 3000,
  destination: "#",
  newWindow: false,
  close:false,
  className: "toastTransaccionTop",
  gravity: "top", 
  position: "left", 
  stopOnFocus: true, 
  style: {
    background: "linear-gradient(to right, #00b09b, #96c93d)",
  }
}).showToast();
//
}

function cargarArticulo(e){
  //
  e.preventDefault();
  //
  const codigo = document.getElementById("idCrearArticuloCodigo").value;
  const nombre = document.getElementById("idCrearArticuloNombre").value;
  const marca = document.getElementById("idCrearArticuloMarca").value;
  const categoria = document.getElementById("idCrearArticuloCategoria").value;
  const precio = document.getElementById("idCrearArticuloPrecio").value;
  //
  if (listaPrecioArticulos.some(articulo => articulo.codigo.toUpperCase() == codigo.toUpperCase() )){
     crearMensajeTransaccionToast("Ya existe un articulo con ese codigo");
  } else if (listaPrecioArticulos.some(articulo => articulo.nombre.toUpperCase() == nombre.toUpperCase() )){
     crearMensajeTransaccionToast("Ya existe un articulo con ese nombre");
  } else {
     //
     const id = listaPrecioArticulos.length + 1;  
     //
     const articuloNuevo = new Articulo(id, 
                                        codigo.toUpperCase(), 
                                        nombre.toUpperCase(), 
                                        marca.toUpperCase(), 
                                        categoria.toUpperCase(), 
                                        parseFloat(precio));
     //
     const elementoNuevo = {
           id: articuloNuevo.id, 
           codigo: articuloNuevo.codigo,
           nombre: articuloNuevo.nombre,
           marca: articuloNuevo.marca,
           categoria: articuloNuevo.categoria,
           precio: articuloNuevo.precio
     };
     //
     listaPrecioArticulos.push(elementoNuevo);
     //
     localStorage.setItem("listaPrecioArticulos", JSON.stringify(listaPrecioArticulos));
     //
     localStorage.removeItem("articuloFormulario");
     //
     document.getElementById("idCrearArticuloCodigo").value = "";
     document.getElementById("idCrearArticuloNombre").value = "";
     document.getElementById("idCrearArticuloMarca").value = "";
     document.getElementById("idCrearArticuloCategoria").value = "";
     document.getElementById("idCrearArticuloPrecio").value = "";
     //
     crearMensajeTransaccionToast("El articulo se creo satisfactoriamente");
     //
  }
  //
}

function eliminarDelCarritoDatos(articuloId){
  //
  carritoCompras = carritoCompras.filter((articulo) => articulo.id != articuloId);
  localStorage.setItem("carritoCompras", JSON.stringify(carritoCompras));
  //
}

function eliminarDelCarritoHtml(articuloId){
  //
  const tagIdMainCarritoCompras = document.getElementById("idMainCarritoCompras");
  const tagIdCarritoComprasArticulo = document.getElementById("idCarritoComprasArticulo"+articuloId);
  const tagIdTotalCarrito = document.getElementById("idTotalCarrito");
  //
  (tagIdMainCarritoCompras && tagIdCarritoComprasArticulo) && tagIdMainCarritoCompras.removeChild(tagIdCarritoComprasArticulo);
  // 
  if (tagIdTotalCarrito) {
     let totalCarrito = carritoCompras.reduce((sumador,articulo)  => sumador + (parseInt(articulo.precio)*parseInt(articulo.cantidad)),0);
     tagIdTotalCarrito.innerText = `Total del Carrito de Compras: $${parseInt(totalCarrito)}`;
  }
  //
  crearMensajeTransaccionToast("El articulo fue eliminado");
  //   
}

function eliminarDelCarrito(e, articuloId){
  //
  e.preventDefault();
  eliminarDelCarritoDatos(articuloId);
  eliminarDelCarritoHtml(articuloId);
  //
}

function agregarListaArticulosHtml(lista){
  //
  lista.forEach(articulo => {agregarArticuloHtml(articulo.id)});
  //
}
         
function agregarArticuloHtml(articuloId){
  //
  let totalCarrito;
  let contenidoHtml;
  const tagMainCarritoCompras = document.getElementById("idMainCarritoCompras");
  const articulo = carritoCompras.find(articulo => articulo.id == articuloId);
  //
  if (tagMainCarritoCompras) {
     //
     const tagDivArticulo = document.createElement("div");
     tagDivArticulo.id = "idCarritoComprasArticulo"+articulo.id;
     tagDivArticulo.className = "carritoComprasArticulo";
     tagMainCarritoCompras.appendChild(tagDivArticulo); 
     //
     contenidoHtml = ` <div class="contenedorCard">
              <div class="contenedorCardDatos"> 
              
                <div class="contenedorCardDatosFila">
                     <p class="cardDatosFilaEtiqueta">Id:</p><p class="cardDatosFilaValor">${articulo.id}</p>
                </div>
                <div class="contenedorCardDatosFila">
                     <p class="cardDatosFilaEtiqueta">Codigo:</p><p class="cardDatosFilaValor">${articulo.codigo.toUpperCase()}</p>
                </div>
                <div class="contenedorCardDatosFila">
                     <p class="cardDatosFilaEtiqueta">Nombre:</p><p class="cardDatosFilaValor">${articulo.nombre.toUpperCase()}</p>
                </div>
                <div class="contenedorCardDatosFila">
                     <p class="cardDatosFilaEtiqueta">Marca:</p><p class="cardDatosFilaValor">${articulo.marca.toUpperCase()}</p>
                </div>
                <div class="contenedorCardDatosFila">
                     <p class="cardDatosFilaEtiqueta">Precio:</p><p class="cardDatosFilaValor">$${articulo.precio}</p>  
                </div>
              </div>
              <div id="idCarritoComprasCantidadDiv${articulo.id}" class="carritoComprasCantidadDiv">
                  <label class="labelCard" for="idCarritoComprasCantidadInput${articulo.id}" >Cantidad: </label>            
                  <input id="idCarritoComprasCantidadInput${articulo.id}" class="inputCard" type="number" min=1 max=1000 value=${articulo.cantidad} required>
              </div> 
              <div class="contenedorCardDatosFila">
                   <p id="idTotalArticuloComprado${articulo.id}" class="labelCard">Importe Total: $${articulo.precio*articulo.cantidad}</p>
              </div>
              <div class="contenedorCardDatosBoton">
                <button id="idCarritoComprasBotonEliminar${articulo.id}" class="buttonCard">ELIMINAR</button>                
              </div>  
            </div>
            </div>
            `;
     //       
     tagDivArticulo.innerHTML = contenidoHtml;     
     //
  }
  //
  const tagIdTotalCarrito = document.getElementById("idTotalCarrito");
  //
  if (tagIdTotalCarrito) {
     totalCarrito = carritoCompras.reduce((sumador,articulocc)  => sumador + (parseInt(articulocc.precio)*parseInt(articulocc.cantidad)),0);  
     tagIdTotalCarrito.innerText="Importe Total Carrito: $"+(totalCarrito);
  }     
  //
  const tagBotonEliminar = document.getElementById("idCarritoComprasBotonEliminar"+articulo.id);
  //
  (tagBotonEliminar) && (tagBotonEliminar.addEventListener("click", (e) => eliminarDelCarrito(e,articulo.id)));
  //
  const tagInputCantidad = document.getElementById("idCarritoComprasCantidadInput"+articulo.id);
  //
  if (tagInputCantidad) {
     //
     tagInputCantidad.addEventListener("input",(e) => {
            //
            e.preventDefault();
            articulo.cantidad = parseInt(tagInputCantidad.value);
            articulo.totalArticulo = parseInt(tagInputCantidad.value)*parseInt(articulo.precio);
            //
            const tagIdTotalArticuloComprado = document.getElementById("idTotalArticuloComprado"+articulo.id);
            //
            (tagIdTotalArticuloComprado) && (tagIdTotalArticuloComprado.innerText="Importe Total: $"+(parseInt(tagInputCantidad.value)*parseInt(articulo.precio)));
            //
            const tagIdTotalCarrito = document.getElementById("idTotalCarrito");
            //
            if (tagIdTotalCarrito) {
               //
               totalCarrito = carritoCompras.reduce((sumador,articulocc)  => sumador + (parseInt(articulocc.precio)*parseInt(articulocc.cantidad)),0);  
               tagIdTotalCarrito.innerText="Importe Total Carrito: $"+(parseInt(totalCarrito));
               //
            }
            //
     });
  }
  //
  localStorage.setItem("carritoCompras", JSON.stringify(carritoCompras));
  //
}

function agregarAlCarritoDatos(articuloId){
  //
  const articulo = listaPrecioArticulos.find(articulo => parseInt(articulo.id) === parseInt(articuloId));
  //
  const tagIdResultadoCantidadInput = document.getElementById("idResultadoCantidadInput"+articuloId);
  //
  if (tagIdResultadoCantidadInput) {
    //
    let cantidad = tagIdResultadoCantidadInput.value;
    //
    articulo.cantidad = parseInt(cantidad);
    articulo.totalArticulo = parseInt(articulo.precio)*parseInt(cantidad);
    //
    carritoCompras.push(articulo);
    localStorage.setItem("carritoCompras", JSON.stringify(carritoCompras));
    //
  };
  //
}

function agregarAlCarritoHtml(articuloId){
  //
  agregarArticuloHtml(articuloId);
  //
}

function agregarAlCarrito(e,articuloId){
  //
  e.preventDefault();
  // 
  if (carritoCompras.some(articulo => parseInt(articulo.id) === parseInt(articuloId))) {
     crearMensajeTransaccionToast("El articulo ya existe en el carrito de compras");
  } else {
    crearMensajeTransaccionToast("Agregando articulo al carrito..."); 
    agregarAlCarritoDatos(articuloId);
    setTimeout(() => {
                      agregarAlCarritoHtml(articuloId);
                     },5000);
    //
  }    
  //
}

function buscarArticulosHtml(lista){
  //
  let contenidoHtml;
  let tagDivArticuloEncontrado;
  const tagMainResultados = document.getElementById("idMainResultados");
  //
  if (tagMainResultados) {
    //
    tagMainResultados.innerHTML = ``;
    //
    lista.forEach(lista => {
        //
        tagDivArticuloEncontrado = document.createElement('div')
        tagDivArticuloEncontrado.id = "idArticuloEncontrado"+lista.id;
        tagDivArticuloEncontrado.className ="articuloEncontrado";
        tagMainResultados.appendChild(tagDivArticuloEncontrado);
        //                    
        let cantidadArticulo; 
        //
        if (lista.cantidad == undefined) {
            cantidadArticulo = 1;
            precioArticuloTotal = parseInt(lista.precio)*parseInt(cantidadArticulo);
        } else {
            cantidadArticulo = parseInt(lista.cantidad);
            precioArticuloTotal = parseInt(lista.totalArticulo);
        }
        //
        contenidoHtml = ` <div class="contenedorCard">
                          <div class="contenedorCardDatos">
                            <div class="contenedorCardDatosFila">
                                <p class="cardDatosFilaEtiqueta">Id:</p><p class="cardDatosFilaValor">${lista.id}</p>
                            </div>
                            <div class="contenedorCardDatosFila">
                                <p class="cardDatosFilaEtiqueta">Codigo:</p><p class="cardDatosFilaValor">${lista.codigo.toUpperCase()}</p>
                            </div>
                            <div class="contenedorCardDatosFila">
                                <p class="cardDatosFilaEtiqueta">Nombre:</p><p class="cardDatosFilaValor">${lista.nombre.toUpperCase()}</p>
                            </div>
                            <div class="contenedorCardDatosFila">
                                <p class="cardDatosFilaEtiqueta">Marca:</p><p class="cardDatosFilaValor">${lista.marca.toUpperCase()}</p>
                            </div>
                            <div class="contenedorCardDatosFila">
                                <p class="cardDatosFilaEtiqueta">Precio:</p><p class="cardDatosFilaValor">$${parseInt(lista.precio)}</p>  
                            </div>
                          </div>
                          <div id="idResultadoCantidadDiv${lista.id}" class="resultadoCantidadDiv">
                              <label class="labelCard" for="idResultadoCantidadInput${lista.id}" >Cantidad: </label>            
                              <input id="idResultadoCantidadInput${lista.id}" class="inputCard" type="number" min=1 max=1000 value=${parseInt(cantidadArticulo)} required>
                          </div> 
                          <div class="contenedorCardDatosFila">
                              <p id="idTotalArticuloBuscado${lista.id}" class="labelCard">Importe Total: $${parseInt(precioArticuloTotal)}</p>
                          </div>
                          <div class="contenedorCardDatosBoton">
                            <button id="idResultadosBotonAgregar${lista.id}" class="buttonCard">AGREGAR</button>
                          </div>  
                        </div>
                        `;
        //
        tagDivArticuloEncontrado.innerHTML = contenidoHtml;
        //        
    });
  };
  //
  lista.forEach(articulo => {
      //  
      const tagBotonAgregar = document.getElementById("idResultadosBotonAgregar"+articulo.id);
      //
      (tagBotonAgregar) && (tagBotonAgregar.addEventListener("click", (e) => agregarAlCarrito(e,articulo.id)));
      //
      const tagInputCantidad = document.getElementById("idResultadoCantidadInput"+articulo.id);
      //
      if (tagInputCantidad) {

         tagInputCantidad.addEventListener("input",(e) => {
            e.preventDefault();
            articulo.cantidad = parseInt(tagInputCantidad.value)||1;
            articulo.totalArticulo = parseInt(tagInputCantidad.value) * parseInt(articulo.precio);
            //
            const tagIdTotalArticuloBuscado = document.getElementById("idTotalArticuloBuscado"+articulo.id);
            //
            (tagIdTotalArticuloBuscado) && (tagIdTotalArticuloBuscado.innerText="Importe Total: $"+(parseInt(tagInputCantidad.value)*parseInt(articulo.precio)));
            //
            localStorage.setItem("articulosEncontrados", JSON.stringify(lista));
         });
         //
      }   
      //
  });
};

function buscarArticulo(e){
  //
  e.preventDefault();
  //
  const tagIdBuscarArticuloCategoria = document.getElementById("idBuscarArticuloCategoria");
  //
  if (tagIdBuscarArticuloCategoria) {
     //
     const categoria = tagIdBuscarArticuloCategoria.value.toUpperCase();
     //
     articulosEncontrados = (categoria.length == 0) ? [...listaPrecioArticulos] :
                            listaPrecioArticulos.filter(articulo => articulo.categoria.toUpperCase().includes(categoria.toUpperCase()));
     //
     localStorage.setItem("articulosEncontrados",JSON.stringify(articulosEncontrados));
     //
     buscarArticulosHtml(articulosEncontrados);
    //
   } 
}

function verCarritoCompras(e){
  //
  e.preventDefault();
  //
  localStorage.setItem("carritoComprasOculto","NO")
  let totalCarrito; 
  //
  if ((carritoCompras.length === 0) ) {
     //   
     crearMensajeTransaccionToast("El carrito de compras esta vacio")
     //
  } else {
    //
    const tagIdMainCarritoCompras = document.getElementById("idMainCarritoCompras");
    //
    if (tagIdMainCarritoCompras.childElementCount === 0) {
       //
       let contenidoHtml;
       let tagDivArticuloEncontrado;
       tagIdMainCarritoCompras.innerHTML = ``;
       //
       if (tagIdMainCarritoCompras) {
          //
          carritoCompras.forEach(lista => {
             //
             tagDivArticuloEncontrado = document.createElement('div')
             tagDivArticuloEncontrado.id = "idCarritoComprasArticulo"+lista.id;
             tagDivArticuloEncontrado.className ="articuloEncontrado";
             tagIdMainCarritoCompras.appendChild(tagDivArticuloEncontrado);
             //
             contenidoHtml = ` <div class="contenedorCard">
              <div class="contenedorCardDatos">
                <div class="contenedorCardDatosFila">
                     <p class="cardDatosFilaEtiqueta">Id:</p><p class="cardDatosFilaValor">${lista.id}</p>
                </div>
                <div class="contenedorCardDatosFila">
                     <p class="cardDatosFilaEtiqueta">Codigo:</p><p class="cardDatosFilaValor">${lista.codigo.toUpperCase()}</p>
                </div>
                <div class="contenedorCardDatosFila">
                     <p class="cardDatosFilaEtiqueta">Nombre:</p><p class="cardDatosFilaValor">${lista.nombre.toUpperCase()}</p>
                </div>
                <div class="contenedorCardDatosFila">
                     <p class="cardDatosFilaEtiqueta">Marca:</p><p class="cardDatosFilaValor">${lista.marca.toUpperCase()}</p>
                </div>
                <div class="contenedorCardDatosFila">
                     <p class="cardDatosFilaEtiqueta">Precio:</p><p class="cardDatosFilaValor">$${lista.precio}</p>  
                </div>
              </div>
              <div id="idCarritoComprasCantidadDiv${lista.id}" class="carritoComprasCantidadDiv">
                  <label class="labelCard" for="idCarritoComprasCantidadInput${lista.id}" >Cantidad: </label>            
                  <input id="idCarritoComprasCantidadInput${lista.id}" class="inputCard" type="number" min=1 max=1000 value=${lista.cantidad} required>
              </div> 
              <div class="contenedorCardDatosFila">
                   <p id="idTotalArticuloComprado${lista.id}" class="labelCard">Importe Total: $${lista.precio*lista.cantidad}</p>
              </div>
              <div class="contenedorCardDatosBoton">
                <button id="idCarritoComprasBotonEliminar${lista.id}" class="buttonCard">ELIMINAR</button>                
              </div>  
            </div>
            `;
             tagDivArticuloEncontrado.innerHTML = contenidoHtml;
          });
       };
       //
      carritoCompras.forEach(articulo => {          
          //
          const tagBotonEliminar = document.getElementById("idCarritoComprasBotonEliminar"+articulo.id);
          //
          (tagBotonEliminar) && (tagBotonEliminar.addEventListener("click", (e) => eliminarDelCarrito(e,articulo.id)));
          //
          const tagInputCantidad = document.getElementById("idCarritoComprasCantidadInput"+articulo.id);
          //
          if (tagInputCantidad) {
             tagInputCantidad.addEventListener("input",(e) => {
                //
                articulo.cantidad = parseInt(tagInputCantidad.value);
                articulo.totalArticulo = parseInt(tagInputCantidad.value)*parseInt(articulo.precio);
                //
                localStorage.setItem("carritoCompras",JSON.stringify(carritoCompras))
                document.getElementById("idTotalArticuloComprado"+articulo.id).innerText="Importe Total: $"+(parseInt(tagInputCantidad.value)*parseInt(articulo.precio));
                //
                totalCarrito = carritoCompras.reduce((sumador,articulocc)  => sumador + (parseInt(articulocc.precio)*parseInt(articulocc.cantidad)),0);  
                document.getElementById("idTotalCarrito").innerText="Importe Total Carrito: $"+(totalCarrito);
               //                                                          
             });
          }
        });
        //
        totalCarrito = carritoCompras.reduce((sumador,articulocc)  => sumador + (parseInt(articulocc.precio)*parseInt(articulocc.cantidad)),0); 
        document.getElementById("idTotalCarrito").innerText="Importe Total Carrito: $"+(parseInt(totalCarrito));
    }
  localStorage.setItem("carritoCompras", JSON.stringify(carritoCompras));
  }
} 

function ocultarCarritoCompras(e){
  //
  e.preventDefault();
  //
  localStorage.setItem("carritoComprasOculto","SI");
  const tagIdMainCarritoCompras = document.getElementById("idMainCarritoCompras");
  //
  if ((tagIdMainCarritoCompras.childElementCount === 0) && (carritoCompras.length > 0)){
    crearMensajeTransaccionToast("El carrito ya esta oculto")
  } else if ((tagIdMainCarritoCompras.childElementCount > 0) && (carritoCompras.length > 0)){
     //
     carritoCompras.forEach(articulo => {
          const tagInputCantidad = document.getElementById("idCarritoComprasCantidadInput"+articulo.id);
          if(tagInputCantidad){
            articulo.cantidad = parseInt(tagInputCantidad.value);
            articulo.totalArticulo = parseInt(tagInputCantidad.value)*parseInt(articulo.precio);
          }
        });
     tagIdMainCarritoCompras.innerHTML=``;
     const tagIdTotalCarrito = document.getElementById("idTotalCarrito");
     //
     (tagIdTotalCarrito) && (tagIdTotalCarrito.innerHTML=``);
     //
  } else {
    crearMensajeTransaccionToast("El carrito de compras esta vacio")
 }
}   

function vaciarCarritoCompras(e){
  e.preventDefault();
  localStorage.setItem("carritoComprasOculto","SI")
  //
  if (carritoCompras.length > 0) {
     //
     const tagIdMainCarritoCompras = document.getElementById("idMainCarritoCompras");
     //
     (tagIdMainCarritoCompras) && (tagIdMainCarritoCompras.innerHTML=``);
     //
     const tagIdTotalCarrito = document.getElementById("idTotalCarrito");
     //
     (tagIdTotalCarrito) && (tagIdTotalCarrito.innerHTML=``);
     //
     carritoCompras.splice(0,carritoCompras.length);
     //
     crearMensajeTransaccionToast("Se eliminaron los articulos del carrito")
  }else{ 
     //
     crearMensajeTransaccionToast("El carrito de compras esta vacio")
  };
  localStorage.setItem("carritoCompras", JSON.stringify(carritoCompras));
}   

function confirmarCarritoCompras(e){
  //
  e.preventDefault();
  //
  (carritoCompras.length > 0) ? crearMensajeTransaccionToast("Se comfirmo la compra") 
                              : crearMensajeTransaccionToast("El carrito de compras esta vacio");
}  
//
const tagFormCrearArticulo = document.getElementById("idMainFormularioCrear");
tagFormCrearArticulo.addEventListener("submit", cargarArticulo);
//
const tagFormBuscarArticulo = document.getElementById("idMainFormularioBuscar");
tagFormBuscarArticulo.addEventListener("submit", buscarArticulo);
//
const tagBotonVerCarrito = document.getElementById("idBotonVerCarritoCompras");
tagBotonVerCarrito.addEventListener("click", verCarritoCompras);
//
const tagBotonOcultarCarrito = document.getElementById("idBotonOcultarCarritoCompras");
tagBotonOcultarCarrito.addEventListener("click", ocultarCarritoCompras);
//
const tagBotonVaciarCarrito = document.getElementById("idBotonVaciarCarritoCompras");
tagBotonVaciarCarrito.addEventListener("click", vaciarCarritoCompras);
//
const tagBotonConfirmarCarrito = document.getElementById("idBotonConfirmarCarritoCompras");
tagBotonConfirmarCarrito.addEventListener("click", confirmarCarritoCompras);
//
function guardarDatosFormulario(){
  const valores = 
  {
    codigo: document.getElementById("idCrearArticuloCodigo").value,
    nombre: document.getElementById("idCrearArticuloNombre").value,
    marca: document.getElementById("idCrearArticuloMarca").value,
    categoria: document.getElementById("idCrearArticuloCategoria").value,
    precio: document.getElementById("idCrearArticuloPrecio").value
  }
  localStorage.setItem("articuloFormulario", JSON.stringify(valores));
}
const tagInputCrearArticuloCodigo = document.getElementById("idCrearArticuloCodigo");
tagInputCrearArticuloCodigo.addEventListener("input", guardarDatosFormulario);
//
const tagInputCrearArticuloNombre = document.getElementById("idCrearArticuloNombre");
tagInputCrearArticuloNombre.addEventListener("input",guardarDatosFormulario);
//
const tagInputCrearArticuloMarca = document.getElementById("idCrearArticuloMarca");
tagInputCrearArticuloMarca.addEventListener("input",guardarDatosFormulario);
//
const tagInputCrearArticuloCategoria = document.getElementById("idCrearArticuloCategoria");
tagInputCrearArticuloCategoria.addEventListener("input",guardarDatosFormulario);
//
const tagInputCrearArticuloPrecio = document.getElementById("idCrearArticuloPrecio");
tagInputCrearArticuloPrecio.addEventListener("input",guardarDatosFormulario);
//
const tagInputBuscarArticuloCategoria = document.getElementById("idBuscarArticuloCategoria");
tagInputBuscarArticuloCategoria.addEventListener("input",()=>localStorage.setItem("idBuscarArticuloCategoria",document.getElementById("idBuscarArticuloCategoria").value));
//

function peticion(texto){
  (texto.length>0) && crearMensajeAvisoToast(texto);  
  return new Promise((resolve) => {
     setTimeout(()=> {
        const conexion = true;
        (conexion) ? (resolve(true)) : (resolve(false));
     },5000)
  });
}

function renderizarLista(lista){
  crearMensajeAvisoToast("Cargando datos...");
  const tagContenedorElementos = document.getElementById("idCargaArticulosElementos");
  let contenidoHtml;
  lista.forEach(articulo => {
      const card = document.createElement("div");
      card.id = "idCargaArticulosCard"+articulo.id; 
      card.className = "cargaArticulosCard"; 
      contenidoHtml = `
                       <div class="cardFilaCampos">
                        <h4 class="cardLabel">Id:</h4><h4 class="cardValue">${articulo.id}</h4>
                       </div>
                       <div class="cardFilaCampos">
                        <h5 class="cardLabel">Codigo:</h4><h4 class="cardValue">${articulo.codigo}</h5>
                       </div>
                       <div class="cardFilaCampos">
                        <h5 class="cardLabel">Nombre:</h4><h4 class="cardValue">${articulo.nombre}</h5>
                       </div>
                       <div class="cardFilaCampos">
                        <h5 class="cardLabel">Marca:</h4><h4 class="cardValue">${articulo.marca}</h5>
                       </div>
                       <div class="cardFilaCampos">
                        <h5 class="cardLabel">Categoria:</h4><h4 class="cardValue">${articulo.categoria}</h5>
                       </div>
                       <div class="cardFilaCampos">
                        <h5 class="cardLabel">Precio:</h4><h4 class="cardValue">${articulo.precio}</h5>
                       </div>
      `;
      card.innerHTML = contenidoHtml;
      tagContenedorElementos.appendChild(card);
    }
  );
};

async function inicioModulo(){
  //
  try {
        const conectado = await peticion("Realizando conexion....");
        const tagSection = document.getElementById("idCargaArticulosContenedor");
        //
        if (conectado) {
           //
           fetch(url)
           .then(resp => resp.json()) 
           .then(lista => {
                            listaPrecioArticulos = [...lista]
                            renderizarLista(lista)
                          })
           .then(()=> {setTimeout(()=> {(tagSection) && (tagSection.classList.add("ocultarSection"));},7000);})
           .catch(err=>crearMensajeAvisoToast("No se logro cargar los articulos: " + err))
           //
           let listaPreciosArticulosStorage = (JSON.parse(localStorage.getItem("listaPrecioArticulos")) == null) ? ([]) : JSON.parse(localStorage.getItem("listaPrecioArticulos"));
           //
           if (listaPreciosArticulosStorage.length > 0) {
             localStorage.setItem("listaPrecioArticulos", JSON.stringify([...listaPreciosArticulosStorage]));
             listaPrecioArticulos = [...listaPreciosArticulosStorage];
           } else {
             localStorage.setItem("listaPrecioArticulos", JSON.stringify([...listaPrecioArticulos]));
           };
    }
      //
  } catch (error) {
    crearMensajeAvisoToast("No se logro cargar los articulos")
  } finally {    
    const conectado = await peticion("");
    crearMensajeAvisoToast("Bienvenidos al Modulo de Compras");
  }
};

inicioModulo();