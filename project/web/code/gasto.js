import { getDocs, query } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"
import { usersRef, gastosRef, insertGasto } from './firebase2.js'

//Datos gasto
let nameGasto = document.getElementById('nameGasto')
let selectTipo = document.getElementById('selectTipo')
let priceGasto = document.getElementById('priceGasto')
let pagadoPor = document.getElementById('pagadoPor')
let crearGasto = document.getElementById('createGasto')

//Division pago
let checkAll = document.getElementById('todos')
let checkParts = document.getElementById('partes')
let checkSome = document.getElementById('noTodos')
let infoPago = document.getElementById('infoPago')

let participantsPay = document.getElementById('participantsPay')

let acceptPayers = document.getElementById('acceptPayers')
const inputs = document.querySelectorAll("#newGastoForm input")

let noPayers = []
let opc = 0
let datosViaje
let allPagadoresConfirm = false
let payersToDB = []
let allPagadores = []
let resetCheck = 1

const camposValidados = {
    nameGasto: false,
    selectTipo: false,
    priceGasto: false,
    pagadoPor: false
}

participantsPay.addEventListener('click', (e) => {
    e.preventDefault()
})

//Validar campos del formulario
function validateForm(e) {
    if (e.target.value.length == 0) {
        camposValidados[e.target.name] = false
    } else {
        camposValidados[e.target.name] = true
    }
}

//Llama a la función validateForm por cada vez que se clicka
inputs.forEach((input) => {
    input.addEventListener('keyup', validateForm)
    input.addEventListener('blur', validateForm)
})

//Dependiendo de la selección que se haga se divide el pago entre los participantes
export async function divisionPago(datos) {
    let cad = ``
    let part = datos.participants
    datosViaje = datos
    let aux = []

    for (let i = 0; i < part.length; i++) {
        allPagadores.push(part[i])
    }
    console.log(allPagadores)

    //Todos pagan por igual
    checkAll.addEventListener('change', (e) => {
        e.preventDefault()
        console.log(allPagadores)
        noPayers = []
        if (checkAll.checked) {
            cad = `<p>El gasto se dividirá entre todos los participantes del viaje equitativamente</p>`
            infoPago.innerHTML = cad
            //Recoge todos los participantes del viaje

            //Guardo los participantes en un auxiliar por si acaso da error
            for (let i = 0; i < allPagadores.length; i++) {
                aux.push(allPagadores[i])
            }
            opc = 1
            console.log(allPagadores)
        }
    })

    /* 
    checkParts.addEventListener('change', () => {
        if (checkParts.checked) {
            cad = `<p>Selecciona la canidad de dinero que va a pagar cada uno</p>`
            infoPago.innerHTML = cad
            console.log(infoPago)
        }
    })
    */

    //No pagan todos, selecciona aquellos que no vayan a pagar
    checkSome.addEventListener('change', async (e) => {
        e.preventDefault()
        let q = query(usersRef)
        let querySnapshot = await getDocs(q)
        let cont = 1
        console.log(allPagadores)

        //Opción seleccionada
        if (checkSome.checked) {
            cad = `<div class="grupo-check">
                        <p>Selecciona quiénes no van a pagar:</p>`
            querySnapshot.forEach((doc) => {
                for (let i = 0; i < part.length; i++) {
                    if (doc.data().email == part[i]) {
                        cad += `<input type="checkbox" id="check${cont}">
                                <label for="check${cont}" id="label-check${cont}">${doc.data().name} ${doc.data().surname}</label><br>`
                        cont++
                    }
                }
            });
            cad += `</div>`
            infoPago.innerHTML = cad
            console.log(cad)

            //Crea evento listenner para cada checkbox
            for (let i = 1; i < cont; i++) {
                document.getElementById('check' + i).addEventListener('click', () => {
                    divideSome('check' + i)
                })
                resetCheck++
            }
            opc = 2

            //Cuando le demos al botón de aceptar y volvamos al modal del gasto comprobará si los participantes a pagar son correctos o no

        }
    })

    //Elimina el mensaje de error
    acceptPayers.addEventListener('click', () => {
        nameTransform()
        document.getElementById('participantsNull').classList.remove('formulario-error-activo')
    })
}

//Divide el dinero del gasto entre los participantes que vayan a pagar
function divideSome(value) {
    let pagador
    let box = document.getElementById(value)

    pagador = document.getElementById('label-' + value).innerHTML

    //Si el pagador no está en el array se guarda en este
    if (box.checked && noPayers.includes(pagador) == false) {
        noPayers.push(pagador)
    } else {
        //Si está en el array y se quita el check, el pagador se quitará del array
        for (let i = 0; i < noPayers.length; i++) {
            if (noPayers[i] == pagador) {
                noPayers.splice(i, 1)
            }
        }
    }
    console.log(noPayers)
}

//Convierte los nombres del array en el identificador (correo electrónico)
async function nameTransform() {
    let pagador
    let aux = []
    let allPagadores = []
    let noPagadoresArray = []
    let q = query(usersRef)
    let querySnapshot = await getDocs(q)

    //Recoge todos los participantes del viaje
    allPagadores = datosViaje.participants

    //Guardo los participantes en un auxiliar por si acaso da error
    for (let i = 0; i < allPagadores.length; i++) {
        aux.push(allPagadores[i])
    }
    console.log(noPayers)

    //Cambia el nombre y el apellido de los participantes por el correo electrónico
    for (let i = 0; i < noPayers.length; i++) {
        pagador = noPayers[i]
        pagador.split(" ")

        querySnapshot.forEach((doc) => {
            let nameSurname = doc.data().name + " " + doc.data().surname
            if (nameSurname == pagador) {
                noPagadoresArray.push(doc.data().email)
            }
        })
    }

    //Quita del array de pagadores aquellos que no van a pagar
    for (let i = 0; i < noPagadoresArray.length; i++) {
        for (let j = 0; j < allPagadores.length; j++) {
            if (noPagadoresArray[i] == allPagadores[j]) {
                allPagadores.splice(j, 1)
            }
        }
    }

    console.log(allPagadores)
    //Si los participantes que van a pagar son 0 no se puede pagar
    if (allPagadores.length == 0) {
        console.log(allPagadores)
        for (let i = 0; i < aux.length; i++) {
            allPagadores.push(aux[i])
        }

        //Si no está completo sale un error
        document.getElementById('participantsNull').classList.add('formulario-error-activo')
        setTimeout(() => {
            document.getElementById('participantsNull').classList.remove('formulario-error-activo')
        }, 5000)
        allPagadoresConfirm = false
    } else {
        //Guardamos los pagadores en un array esterno que enviaremos a la base de datos
        for (let i = 0; i < allPagadores.length; i++) {
            payersToDB.push(allPagadores[i])
        }
        allPagadoresConfirm = true
    }
}

//Comprueba que los datos son correctos si es la opción 2, sino inserta los valores directamente
function savePago(e) {
    try {
        if (opc == 2) {
            if (allPagadoresConfirm == true) {
                insertValues(e)
            } else if (allPagadoresConfirm == false) {
                //Se vuelve a llamar a la función que pasa de nombre y apellido a email, sino no se podrán guardar los datos
                nameTransform()
            }
        } else if (opc == 1) {
            insertValues(e)
        } else if (opc == 0) {
            //Si no está completo sale un error
            document.getElementById('selectParticipants').classList.add('formulario-error-activo')
            setTimeout(() => {
                document.getElementById('selectParticipants').classList.remove('formulario-error-activo')
            }, 5000)
        }
    } catch (eror) {
        console.log(eror)
    }

}

//Cuando se hace clic en el boton de nuevo gasto llamamos a la funcion savePago
crearGasto.addEventListener('click', (e) => {
    savePago(e)
})

//Inserta los valores del gasto en la db y resetea los valores para crear un gasto nuevo
function insertValues(e) {
    e.preventDefault()
    try {
        if (camposValidados.nameGasto && camposValidados.priceGasto) {

            //Crea el gasto
            createGasto()

            setTimeout(() => {
                //Reiniciar valores de los campos
                nameGasto.value = ""
                selectTipo.value = 0
                priceGasto.value = ""
                pagadoPor.value = 0
                allPagadores = datosViaje.participants
                console.log(allPagadores)
                payersToDB = []

                //Poner a false todos los campos
                for (let i = 0; i < camposValidados.length; i++) {
                    console.log(camposValidados[i])
                    camposValidados[i] = false
                }

                //Resetea las checkboxes
                for (let i = 1; i < resetCheck; i++) {
                    let checkToReset = document.getElementById('check' + i)
                    if (checkToReset.checked) {
                        checkToReset.checked = false
                    }
                }
                resetCheck = 0
            }, 1000)

            //Mensaje que confirma que se ha creado el usuario
            document.getElementById('gastoCreated').classList.add('form-enviado-activo')
            //El mensaje se eliminará después de 5 segundos
            setTimeout(() => {
                document.getElementById('gastoCreated').classList.remove('form-enviado-activo')
            }, 5000)

        } else {
            //Si no está completo sale un error
            document.getElementById('gastoNotCreated').classList.add('formulario-error-activo')
            setTimeout(() => {
                document.getElementById('gastoNotCreated').classList.remove('formulario-error-activo')
            }, 5000)
        }
    } catch (error) {
        console.log(error)
    }
}

//Crear gastos y añadirlos a la base de datos
async function createGasto() {
    //Datos del formulario
    let name = nameGasto.value
    let tipo = selectTipo.value
    let price = priceGasto.value
    let paidBy = pagadoPor.value
    let gastoId

    //Query para sacar las IDs
    let qGasto = query(gastosRef)
    let querySnapshot = await getDocs(qGasto)
    let cont = true
    console.log(datosViaje)

    do {
        //Crea un id aleatorio y compara si es igual que alguno de los viajes existentes
        gastoId = Math.floor(Math.random() * 10000000)
        querySnapshot.forEach((doc) => {
            if (doc.data().gastoId != gastoId) {
                cont = false
            } else {
                cont = true
            }
        })
    } while (cont)

    //Insertar gasto en la base de datos
    insertGasto(name, tipo, price, paidBy, payersToDB, datosViaje.iterId, gastoId)
}
