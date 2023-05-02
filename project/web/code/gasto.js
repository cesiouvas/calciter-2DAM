import { getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"
import { auth, iterRef, selectUsuarios, usersRef } from './firebase2.js'

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

    checkParts.addEventListener('change', () => {
        if (checkParts.checked) {
            cad = `<p>Selecciona la canidad de dinero que va a pagar cada uno</p>`
            infoPago.innerHTML = cad
            console.log(infoPago)
        }
    })

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
    console.log(noPayers)
}

async function nombreAEmail(pagadores) {
    let pagador
    let aux = []
    let allPagadores = []
    let noPagadoresArray = []
    let q = query(usersRef)
    let querySnapshot = await getDocs(q)

    //Recoge todos los participantes del viaje
    allPagadores = datosViaje.participants
    aux = allPagadores

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
    console.log(allPagadores)

    if (allPagadores.length == 0) {
        allPagadores = aux
        //Si no está completo sale un error
        document.getElementById('participantsNull').classList.add('formulario-error-activo')
        setTimeout(() => {
            document.getElementById('participantsNull').classList.remove('formulario-error-activo')
        }, 5000)
        
    }

}

function savePago() {
    //Datos del formulario
    let name = nameGasto.value
    let tipo = selectTipo.value
    let price = priceGasto.value
    let paidBy = pagadoPor.value

    if (cantidad == 2) {
        nombreAEmail(noPayers)
    }





}

prueba.addEventListener('click', () => {
    savePago()
})

