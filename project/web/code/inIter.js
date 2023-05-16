import { getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"
import { auth, iterRef, usersRef, gastosRef } from './firebase2.js'
import { divisionPago } from './gasto.js'
//import { showGastos } from './showGasto.js'

let info = document.getElementById('iter-info')
let newIterButtons = document.getElementById('newIterButtons')
let dataIter

//Función que enseña los viajes del usuario actual
export async function showIter() {
    let cad = ``
    let cont = 1
    let q = query(iterRef, where("participants", "array-contains", auth.currentUser.email), orderBy("startDate"))
    let querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
        cad += `<div id="iter${cont}" class="rounded border border-dark mt-3 bg-iter" style="height: 70px">
                    <table style="height: 70px">
                        <td style="width: 25%">${doc.data().description}</td>
                        <td style="width: 35%; padding-left: 8px" class="text-decoration-underline">${doc.data().startDate} - ${doc.data().endDate}</td>
                        <td style="width: 30%; padding-left: 10px">${doc.data().country}, ${doc.data().city}</td>
                        <td style="width: 10px;"><button id="deleteButton" class="deleteButton"><img src="../img/delete.png" style="width: 17px; height: 20px"></button></td>
                     </table>     
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

//Click para ver los datos del
datos.addEventListener('click', () => {
    divisionPago(dataIter)
    getDatos()
})

//Enseña los datos del viaje cuando hacemos click
export function getDatos() {
    let gastosViaje = document.getElementById('gastosViaje')
    let datosViaje = document.getElementById('datosViaje')
    let gastosButtons = document.getElementById('gastosButtons')
    gastosButtons.style.display = 'none'
    datos.classList.add('bordeBotones')
    gastos.classList.remove('bordeBotones')
    datosViaje.style.display = 'block'
    gastosViaje.style.display = 'none'

    gastos.addEventListener('click', () => {
        getIter(dataIter)
    })
}

//Calcula los gastos 
async function calcGastos(dataIter) {
    let deudas = document.getElementById('deudasGroup')
    let cad = ``
    let gasto = 0

    //Recorre los participantes para hacer la suma de cada uno
    for (let i = 0; i < dataIter.participants.length; i++) {

        //Enseñar el nombre y apellido del usuario
        let qUsers = query(usersRef, where("email", "==", dataIter.participants[i]))
        let querySnapUsers = await getDocs(qUsers)

        //Saber quien ha pagado y a quien hay que devolverle el dinero
        let q = query(gastosRef, where("paidBy", "==", dataIter.participants[i]), where("iterId", "==", dataIter.iterId))
        let querySnapt = await getDocs(q)

        querySnapUsers.forEach((docUser) => {
            cad += `<p>${docUser.data().name} ${docUser.data().surname}:`
            querySnapt.forEach((docPaid) => {
                if (docPaid.data().payers.includes(auth.currentUser.email)) {
                    if (docPaid.data().paidBy == auth.currentUser.email) {
                    } else {
                       gasto += docPaid.data().price / docPaid.data().payers.length 
                    }
                }
            });
            cad += ` ${gasto}</p>`
            gasto = 0
            deudas.innerHTML = cad
        })
    }
}

//Enseña los datos del viaje
export async function getIter(iter) {
    let gastosButtons = document.getElementById('gastosButtons')
    gastosButtons.style.display = 'block'
    gastos.classList.add('bordeBotones')
    datos.classList.remove('bordeBotones')
    let cad = ``

    divisionPago(iter)

    //Enseñar el menu de gastos y datos
    let botoneraPadre = document.getElementById('botoneraPadre')
    botoneraPadre.style.display = 'block'
    newIterButtons.style.display = 'none'

    cad += `<br>
            <div id="datosViaje">
            <br>
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

    cad += `</div>`

    info.innerHTML = cad

    let datosViajeDiv = document.getElementById('datosViaje')
    datosViajeDiv.style.display = 'none'
    pagadorGasto(iter)

    dataIter = iter

    calcGastos(dataIter)

    datos.addEventListener('click', () => {
        divisionPago(dataIter)
        getDatos()
    })
}

//Nos devuelve a la pestaña donde se enseña la lista de viajes
allIter.addEventListener('click', () => {
    let botoneraPadre = document.getElementById('botoneraPadre')
    let gastosButtons = document.getElementById('gastosButtons')
    gastosButtons.style.display = 'none'
    botoneraPadre.style.display = 'none'
    newIterButtons.style.display = 'block'
    showIter()
})

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

