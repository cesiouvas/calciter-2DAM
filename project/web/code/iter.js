import { selectPaises, auth, usersRef, iterRef, paisRef } from './firebase2.js'
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js"

import { getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"

let info = document.getElementById('iter-info')
let paises = document.getElementById('select-paises')
let cad = ``
let actualUser

onAuthStateChanged(auth, async (user) => {
    //Está logueado
    if (user) {
        //Query para obtener el nombre de usuario
        let q = query(usersRef, where("email", "==", auth.currentUser.email))
        let querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
            actualUser = doc.data().name
        })

        //Comprueba que el usuario tenga un viaje creado
        q = query(iterRef, where("users", "array-contains", actualUser))
        querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
            cad += `<p>${doc.data().name}</p>`
        })

        //bBotón para crear viajes
        cad += `<button id="newIter" data-bs-toggle="modal"
            data-bs-target="#newIterModal" type="button" class="btn btn-secondary">Nuevo viaje</button>`

        info.innerHTML = cad

        //Llama al método que rellena el select
        paises.innerHTML = fillPaises()

        console.log(auth.currentUser.email)
    } else { //No lo está
        cad = ``
        info.innerHTML = cad
    }
})

//Rellena el select con los paises de la base de datos
async function fillPaises() {
    let cad2 = `<label class="mt-2" for="paises">País de destino</label>
                <select class="form-select" name="paises" id="paises">
                    <option value="selecciona">--- Selecciona un país</option>`
    console.log(paisRef)
    let qPaises = query(paisRef)
    let querySnapshot = await getDocs(qPaises)

    console.log(selectPaises)

    querySnapshot.forEach((doc) => {
        cad2 += `<option value="${doc.data().value}">${doc.data().name}</option>`
    })
    cad2 += `</select>`

    console.log(cad2)
    paises.innerHTML = cad2
}

