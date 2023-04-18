import { selectPaises, auth, usersRef, iterRef, paisRef, insertIter } from './firebase2.js'
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js"

import { getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"

let info = document.getElementById('iter-info')
let paises = document.getElementById('select-paises')
let dates = document.getElementById('dates')
let actualUser

//Campos del viaje
let name = document.getElementById('itername')
let desc = document.getElementById('iterdesc')
let pais = document.getElementById('paises')
let ciudad = document.getElementById('ciudad')
let startdate = document.getElementById('startdate')
let enddate = document.getElementById('enddate')

const inputs = document.querySelectorAll("#new-iter-form input")

const camposValidados = {
    itername: false,
    iterdesc: false,
}

function validateForm(e) {
    if (e.target.value != "" || e.target.value != null) {
        camposValidados[e.target.name] = true
        console.log(camposValidados)
    }
}

//Asignar un evento por cada input
inputs.forEach((input) => {
    input.addEventListener('keyup', validateForm)
    input.addEventListener('blur', validateForm)
})

//Comprueba que haya un usuario iniciado
onAuthStateChanged(auth, async (user) => {
    let cad = ``
    //Está logueado
    if (user) {
        //Enseña los viajes que tiene el usuario actual
        console.log(info)
        showIter()

        //Llama al método que rellena el select
        fillPaises()

        //Seleción de fechas
        dates.innerHTML = selectDates()

        console.log(auth.currentUser.email)
    } else { //No lo está
        cad = ``
        info.innerHTML = cad
    }
})

//Función que enseña los viajes del usuario actual
async function showIter() {
    let cad
    let q = query(iterRef, where("participants", "array-contains", auth.currentUser.email))
    let querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        cad += `<p>${doc.data().description}</p>`
    })

    //Botón para crear viajes
    cad += `<button id="newIter" data-bs-toggle="modal"
                data-bs-target="#newIterModal" type="button" class="btn btn-secondary mt-2">Nuevo viaje</button>`
    
    info.innerHTML = cad
}

//Rellena el select con los paises de la base de datos
async function fillPaises() {
    let cad
    let qPaises = query(paisRef)
    let querySnapshot = await getDocs(qPaises)

    cad += `<option value="0">--- Selecciona un pais</option>`

    querySnapshot.forEach((doc) => {
        cad += `<option value="${doc.data().name}">${doc.data().name}</option>`
    })

    pais.innerHTML = cad
}

//Método que crea los inputs para la fecha en los viajes
function selectDates() {
    let cad = ``
    let startDate
    let endDate
    const fecha = new Date()
    const day = fecha.getDate()
    const month = fecha.getMonth() + 1
    const year = fecha.getFullYear()

    //Arregla las fechas para que el formato sea el correcto
    switch (month) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            //startDate es la fecha actual
            startDate = year + "-0" + month + "-" + day
            //endDate es la fecha actual + 1
            endDate = year + "-0" + month + "-" + (day + 1)
            cad = `<input class="date-form" type="date" id="startdate" name="startdate" value="${startDate}" min="${startDate}" required>
                    <input class="date-form" type="date" id="enddate" name="enddate" min="${endDate}" required>`
            break;
        default:
            startDate = year + "-" + month + "-" + day
            endDate = year + "-" + month + "-" + (day + 1)
            cad = `<input class="date-form" type="date" id="startdate" name="startdate" value="${startDate}" min="${startDate}" required>
                    <input class="date-form" type="date" id="enddate" name="enddate" min="${endDate}" required>`
            break;
    }
    return cad
}

//Se crea un nuevo viaje
newIter.addEventListener('click', async (e) => {
    try {
        if (camposValidados.iterdesc && camposValidados.itername) {
            e.preventDefault()

            //Guardar viaje
            saveIter()

            //Reiniciar los valores de los campos
            name.value = ""
            desc.value = ""
            ciudad.value = ""
            pais.value = ""

            camposValidados['itername'] = false
            camposValidados['iterdesc'] = false

            //Mensaje que confirma que se ha creado el usuario
            document.getElementById('iter-enviado').classList.add('form-enviado-activo')
            //El mensaje se eliminará después de 5 segundos
            setTimeout(() => {
                document.getElementById('iter-enviado').classList.remove('form-enviado-activo')
            }, 5000)

            showIter()
        } else {
            //Si no está completo sale un error
            document.getElementById('iter-vacio').classList.add('formulario-error-activo')
            setTimeout(() => {
                document.getElementById('iter-vacio').classList.remove('formulario-error-activo')
            }, 5000)
        }
    } catch (error) {
        console.log(error)
    }
})

//Guarda viajes en la db
function saveIter() {
    const iterdesc = document.getElementById('iterdesc').value
    const ciudad = document.getElementById('ciudad').value
    const pais = document.getElementById('paises').value
    const startdate = document.getElementById('startdate').value
    const enddate = document.getElementById('enddate').value

    console.log(iterdesc)
    console.log(ciudad)
    console.log(pais)
    console.log(startdate)
    console.log(enddate)

    insertIter(auth.currentUser.email, iterdesc, pais, ciudad, startdate, enddate, 1)
}

