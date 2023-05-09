import { getDocs, query, where, collection } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"
import { auth, iterRef, usersRef, gastosRef, db } from './firebase2.js'
import { divisionPago } from './gasto.js'
//import { showGastos } from './showGasto.js'

let info = document.getElementById('iter-info')
let newIterButtons = document.getElementById('newIterButtons')
let prueba = 1
let dataIter

//Función que enseña los viajes del usuario actual
export async function showIter() {
    let cad = ``
    let cont = 1
    let q = query(iterRef, where("participants", "array-contains", auth.currentUser.email))
    let querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
        cad += `<div id="iter${cont}" class="rounded border border-dark mt-3 bg-iter">
                    <p class="mt-2">${doc.data().description}</p>
                    <p style="right: 50%; top: 11.5%">${doc.data().startDate}</p>
                </div>`
        cont++
    })

    //Mostrar los viajes por pantalla
    info.innerHTML = cad

    //Reseteo el contador para crear los eventos click
    cont = 1

    querySnapshot.forEach((doc) => {
        document.getElementById('iter' + cont).addEventListener('click', () => { getIter(doc.data()) })
        cont++
    })
}

datos.addEventListener('click', () => {
    gastos.classList.remove('bordeBotones')
    datos.classList.add('bordeBotones')
    getIter(dataIter)
    divisionPago(dataIter)

})

function getGasto() {
    let gastosViaje = document.getElementById('gastosViaje')
    let datosViaje = document.getElementById('datosViaje')
    gastos.classList.add('bordeBotones')
    datos.classList.remove('bordeBotones')
    gastosViaje.style.display = 'block'
    datosViaje.style.display = 'none'

    datos.addEventListener('click', () => {
        getIter(dataIter)
    })
}

//Enseña los datos del viaje
async function getIter(iter) {
    datos.classList.add('bordeBotones')
    gastos.classList.remove('bordeBotones')
    let cad = ``
    
    //Enseñar el menu de gastos y datos
    let botoneraPadre = document.getElementById('botoneraPadre')
    botoneraPadre.style.display = 'block'
    newIterButtons.style.display = 'none'

    cad += `<br>
            <div id="datosViaje">
                <p>estoy dentro del viaje ${iter.iterId}</p>
                <p>${iter.participants}<p>
            </div>`


    let qGastos = query(gastosRef)
    let querySnapshot = await getDocs(qGastos)

    cad += `<div id="gastosViaje">`

    //Muestra los gastos por pantalla
    querySnapshot.forEach((doc) => {
        if (doc.data().iterId == iter.iterId) {
            cad += `<div id="${doc.data().gastoId}" class="rounded border border-dark mt-3 bg-iter" style="padding: 10px">
                        <img src="../img/${doc.data().type}.png" class="gastoImg">
                        <p>${doc.data().name}</p>
                        <p>${doc.data().price}€</p>
                        <p>${doc.data().paidBy}</p>
                    </div>`
        }
    })

    cad += `<button id="deudas" data-bs-toggle="modal" data-bs-target="#deudasModal" type="button" class="btn btn-secondary deudas">Deudas</button>
            <button id="createGasto" data-bs-toggle="modal" data-bs-target="#newGastoModal" type="button" class="btn btn-secondary newGasto"><i class="fa-solid fa-plus"></i></button></div>`

    info.innerHTML = cad

    let gastosViaje = document.getElementById('gastosViaje')
    gastosViaje.style.display = 'none'
    pagadorGasto(iter)

    dataIter = iter

    gastos.addEventListener('click', () => {
        divisionPago(dataIter)
        getGasto()
    })
}


//Nos devuelve a la pestaña donde se enseña la lista de viajes
allIter.addEventListener('click', () => {
    let botoneraPadre = document.getElementById('botoneraPadre')
    botoneraPadre.style.display = 'none'
    newIterButtons.style.display = 'block '
    showIter()
})

//Enseña los gastos que se van haciendo en el viaje
/* 
gastos.addEventListener('click', () => {
    gastos.classList.add('bordeBotones')
    datos.classList.remove('bordeBotones')
    let cad = `<div class="container" id="showGastos">
                </div>
                <button id="createGasto" data-bs-toggle="modal" data-bs-target="#newGastoModal" type="button" class="btn btn-secondary newGasto"><i class="fa-solid fa-plus"></i></button>`
    info.innerHTML = cad
    showGastos(data)
})
*/

//Rellena el select para seleccionar quien paga el gasto
async function pagadorGasto(datos) {
    let selectPagador = document.getElementById('pagadoPor')
    let participants = datos.participants
    let q = query(usersRef)
    let querySnapshot = await getDocs(q)
    let cad = ``

    cad += `<option value="0">---Selecciona pagador</option>`

    querySnapshot.forEach((doc) => {
        for (let i = 0; i < participants.length; i++) {
            if (doc.data().email == participants[i]) {
                cad += `<option value="${participants[i]}">${doc.data().name} ${doc.data().surname}</option>`

            }
        }
    })

    selectPagador.innerHTML = cad
}

