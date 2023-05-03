import { getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"
import { auth, iterRef, selectUsuarios, usersRef } from './firebase2.js'
<<<<<<< HEAD
import { dataIter } from "./inIter.js"
=======
>>>>>>> 6e20a4828695e9b3dd7fb84b07ce51bddc0eb0a0

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

let prueba = document.getElementById('prueba')

let noPayers = []
let cantidad
let datosViaje

export async function divisionPago(datos) {
    let cad = ``
    let part = datos.participants
    datosViaje = datos

    checkAll.addEventListener('change', () => {
        if (checkAll.checked) {
            cad = `<p>El gasto se dividirá entre todos los participantes del viaje equitativamente</p>`
            infoPago.innerHTML = cad
            console.log(infoPago)
        }
    })

<<<<<<< HEAD
    /* 
=======
>>>>>>> 6e20a4828695e9b3dd7fb84b07ce51bddc0eb0a0
    checkParts.addEventListener('change', () => {
        if (checkParts.checked) {
            cad = `<p>Selecciona la canidad de dinero que va a pagar cada uno</p>`
            infoPago.innerHTML = cad
            console.log(infoPago)
        }
    })
<<<<<<< HEAD
    */
=======
>>>>>>> 6e20a4828695e9b3dd7fb84b07ce51bddc0eb0a0

    //No pagan todos, selecciona aquellos que no vayan a pagar
    checkSome.addEventListener('change', async () => {
        let q = query(usersRef)
        let querySnapshot = await getDocs(q)
        let cont = 1

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

            //Crea evento listenner para cada checkbox
            for (let i = 1; i < cont; i++) {
                document.getElementById('check' + i).addEventListener('click', () => {
                    divideSome('check' + i)
                })
            }
            cantidad = 2
        }
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
<<<<<<< HEAD
}

//Convierte los nombres del array en el identificador (correo electrónico)
async function nombreAEmail(pagadores) {
    let pagador
    let allPagadoresConfirm = false
=======
    console.log(noPayers)
}

async function nombreAEmail(pagadores) {
    let pagador
>>>>>>> 6e20a4828695e9b3dd7fb84b07ce51bddc0eb0a0
    let aux = []
    let allPagadores = []
    let noPagadoresArray = []
    let q = query(usersRef)
    let querySnapshot = await getDocs(q)

    //Recoge todos los participantes del viaje
    allPagadores = datosViaje.participants
<<<<<<< HEAD

    //Guardo los participantes en un auxiliar por si acaso da error
    for (let i = 0; i < allPagadores.length; i++) {
        aux.push(allPagadores[i])
    }
=======
    aux = allPagadores
>>>>>>> 6e20a4828695e9b3dd7fb84b07ce51bddc0eb0a0

    //Cambia el nombre y el apellido de los participantes por el correo electrónico
    for (let i = 0; i < pagadores.length; i++) {
        pagador = pagadores[i]
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
<<<<<<< HEAD

    //Si los participantes que van a pagar son 0 no se puede pagar
    if (allPagadores.length == 0) {
        for (let i = 0; i < aux.length; i++) {
            allPagadores.push(aux[i])
        }

=======
    console.log(allPagadores)

    if (allPagadores.length == 0) {
        allPagadores = aux
>>>>>>> 6e20a4828695e9b3dd7fb84b07ce51bddc0eb0a0
        //Si no está completo sale un error
        document.getElementById('participantsNull').classList.add('formulario-error-activo')
        setTimeout(() => {
            document.getElementById('participantsNull').classList.remove('formulario-error-activo')
        }, 5000)
<<<<<<< HEAD
        allPagadoresConfirm = false
    } else {
        allPagadoresConfirm = true
    }
    return allPagadoresConfirm
}

function savePago() {
    let allPagadoresConfirm = false
=======
        
    }

}

function savePago() {
>>>>>>> 6e20a4828695e9b3dd7fb84b07ce51bddc0eb0a0
    //Datos del formulario
    let name = nameGasto.value
    let tipo = selectTipo.value
    let price = priceGasto.value
    let paidBy = pagadoPor.value

    if (cantidad == 2) {
<<<<<<< HEAD
        allPagadoresConfirm = nombreAEmail(noPayers)
    }

    console.log(allPagadoresConfirm)
    if (allPagadoresConfirm.PromiseResult == true) {
        console.log("juan")
    } else if (allPagadoresConfirm.PromiseResult == false) {
        console.log("mano falso")
    }
=======
        nombreAEmail(noPayers)
    }


>>>>>>> 6e20a4828695e9b3dd7fb84b07ce51bddc0eb0a0



}

prueba.addEventListener('click', () => {
<<<<<<< HEAD

    document.getElementById('participantsNull').classList.remove('formulario-error-activo')
    savePago()

=======
    savePago()
>>>>>>> 6e20a4828695e9b3dd7fb84b07ce51bddc0eb0a0
})

