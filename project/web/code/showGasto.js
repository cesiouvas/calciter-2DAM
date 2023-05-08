import { gastosRef } from './firebase2.js'
import { getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"


let showInfo = document.getElementById('showGastos')
let info = document.getElementById('iter-info')

export async function showGastos(data) {
    let q = query(gastosRef, where("iterId", "==", data.iterId))
    let querySnapshot = await getDocs(q)
    let cad = ``

    cad += `<div class="container" id="showGastos">`

    querySnapshot.forEach((doc) => {
        console.log(doc.data().iterId)
        console.log(data.iterId)
        if (doc.data().iterId == data.iterId) {
            cad += `<div>
                    <p>${doc.data().name}</p>
                    <p>${doc.data().price}</p>
                </div>`
        }
        console.log(cad)
    })


    cad += `</div>
        <button id="createGasto" data-bs-toggle="modal" data-bs-target="#newGastoModal" type="button" class="btn btn-secondary newGasto"><i class="fa-solid fa-plus"></i></button>`
    info.innerHTML = cad
    console.log(cad)

    console.log(info)

}