import { getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"
import { auth, iterRef } from './firebase2.js'

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
    cad += `<button id="newIter" data-bs-toggle="modal" data-bs-target="#newIterModal" type="button" class="btn btn-secondary mt-4 new-iter-btn" style="width:16.5%; left:33%">Nuevo viaje</button>
            <button id="accessIter" data-bs-toggle="modal" data-bs-target="#accessIterModal" type="button" class="btn btn-secondary mt-4 new-iter-btn" style="width:16.5%; right:33%">Acceder a un viaje</button>`

    info.innerHTML = cad

    //Reseteo el contador para crear los eventos click
    cont = 1

    querySnapshot.forEach((doc) => {
        document.getElementById('iter' + cont).addEventListener('click', () => { getIter(doc.data()) })
        cont++
        //Botón datos enseña la información del viaje
        datos.addEventListener('click', () => {
            getIter(doc.data())
        })
    })
}

function getIter(iter) {
    let cad = ``
    //Enseñar el menu de gastos y datos
    let botoneraPadre = document.getElementById('botoneraPadre')
    botoneraPadre.style.display = 'block'

    cad += `<br>
            <p>estoy dentro del viaje ${iter.iterId}</p>
            <p>${iter.participants}<p>`

    info.innerHTML = cad
}

//Nos devuelve a la pestaña donde se enseña la lista de viajes
allIter.addEventListener('click', () => {
    let botoneraPadre = document.getElementById('botoneraPadre')
    botoneraPadre.style.display = 'none'
    showIter()
})

//Enseña los gastos que se van haciendo en el viaje
gastos.addEventListener('click', () => {
    let cad = `<p>JUAN</p>`
    info.innerHTML = cad
})



