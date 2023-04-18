import { getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"
import { auth, iterRef } from './firebase2.js'

let info = document.getElementById('iter-info')

//Función que enseña los viajes del usuario actual
export async function showIter() {
    let cad = ``
    let q = query(iterRef, where("participants", "array-contains", auth.currentUser.email))
    let querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
        cad += `<div class="rounded border border-dark mt-3 bg-iter">
                    <p style="padding-top: 5px">${doc.data().description}</p>
                    <p>${doc.data().startDate}</p>
                </div>`
    })

    //Botón para crear viajes
    cad += `<button id="newIter" data-bs-toggle="modal"
                data-bs-target="#newIterModal" type="button" class="btn btn-secondary mt-4 new-iter-btn">Nuevo viaje</button>`
    
    info.innerHTML = cad
}