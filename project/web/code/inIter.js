import { getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"
import { auth, iterRef } from './firebase2.js'
import { divisionPago } from './gasto.js'

let info = document.getElementById('iter-info')

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

    //Botón para crear viajes
    cad += `<button id="newIter" data-bs-toggle="modal" data-bs-target="#newIterModal" type="button" class="btn btn-secondary mt-4 new-iter-btn" style="width:30%; left:18%">Nuevo viaje</button>
            <button id="accessIter" data-bs-toggle="modal" data-bs-target="#accessIterModal" type="button" class="btn btn-secondary mt-4 new-iter-btn" style="width:30%; right:18%">Acceder a un viaje</button>`

    //Mostrar los viajes por pantalla
    info.innerHTML = cad

    //Reseteo el contador para crear los eventos click
    cont = 1

    querySnapshot.forEach((doc) => {
        document.getElementById('iter' + cont).addEventListener('click', () => { getIter(doc.data()) })
        cont++
        //Botón datos enseña la información del viaje

        datos.addEventListener('click', () => {
            gastos.classList.remove('bordeBotones')
            datos.classList.add('bordeBotones')
            getIter(doc.data())
        })
    })
}

function getIter(iter) {
    datos.classList.add('bordeBotones')
    gastos.classList.remove('bordeBotones')
    let cad = ``
    //Enseñar el menu de gastos y datos
    let botoneraPadre = document.getElementById('botoneraPadre')
    botoneraPadre.style.display = 'block'

    cad += `<br>
            <p>estoy dentro del viaje ${iter.iterId}</p>
            <p>${iter.participants}<p>`

    info.innerHTML = cad
    pagadorGasto(iter)
    divisionPago(iter)
}

//Nos devuelve a la pestaña donde se enseña la lista de viajes
allIter.addEventListener('click', () => {
    let botoneraPadre = document.getElementById('botoneraPadre')
    botoneraPadre.style.display = 'none'
    showIter()
})

//Enseña los gastos que se van haciendo en el viaje
gastos.addEventListener('click', () => {
    gastos.classList.add('bordeBotones')
    datos.classList.remove('bordeBotones')
    let cad = `<button id="createGasto" data-bs-toggle="modal" data-bs-target="#newGastoModal" type="button" class="btn btn-secondary newGasto"><i class="fa-solid fa-plus"></i></button>`
    info.innerHTML = cad
})

//Rellena el select para seleccionar quien paga el gasto
function pagadorGasto(datos) {
    let selectPagador = document.getElementById('pagadoPor')
    let participants = datos.participants
    let cad = ``

    cad += `<option value="0">---Selecciona pagador</option>`

    for (let i = 0; i < participants.length; i++) {
        cad += `<option value="${participants[i]}">${participants[i]}</option>`
    }

    selectPagador.innerHTML = cad
}

