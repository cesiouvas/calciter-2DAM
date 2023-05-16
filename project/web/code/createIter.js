import { auth, iterRef, paisRef, insertIter, newParticipant } from './firebase2.js'
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js"

import { showIter } from './inIter.js'

import { getDocs, query } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"

let info = document.getElementById('iter-info')
let dates = document.getElementById('dates')

//Campos del viaje
let name = document.getElementById('itername')
let desc = document.getElementById('iterdesc')
let pais = document.getElementById('paises')
let ciudad = document.getElementById('ciudad')
const inputs = document.querySelectorAll("#new-iter-form input")

//Acceder a un viaje
let accessId = document.getElementById('accessId')
let inviteButton = document.getElementById('inviteButton')
let newIter = document.getElementById('newIter')
let userInfo = document.getElementById('userInfo')

//Validar campos
const camposValidados = {
    itername: false,
    iterdesc: false,
}

//Validar campos del formulario
function validateForm(e) {
    if (e.target.value.length == 0) {
        camposValidados[e.target.name] = false
    } else {
        camposValidados[e.target.name] = true
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
        //Enseña los viajes que tiene el usuario actual (fichero inIter.js)
        showIter()

        //Llama al método que rellena el select
        fillPaises()

        //Seleción de fechas
        dates.innerHTML = selectDates()
        reponerFecha()

        userInfo.innerHTML = auth.currentUser.email

        //divisionPago()
    } else { //No lo está
        cad = ``
        info.innerHTML = cad
    }
})

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
            switch (day) {
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
                    startDate = year + "-0" + month + "-" + 0 + day
                    //endDate es la fecha actual + 1
                    endDate = year + "-0" + month + "-" + 0 + day
                    cad = `<input class="date-form" type="date" id="startdate" name="startdate" value="${startDate}" min="${startDate}" required>
                    <input class="date-form" type="date" id="enddate" name="enddate" min="${endDate}" required>`
                    break
                default:
                    //startDate es la fecha actual
                    startDate = year + "-0" + month + "-" + day
                    //endDate es la fecha actual + 1
                    endDate = year + "-0" + month + "-" + day
                    cad = `<input class="date-form" type="date" id="startdate" name="startdate" value="${startDate}" min="${startDate}" required>
                        <input class="date-form" type="date" id="enddate" name="enddate" min="${endDate}" required>`
                    break
            }
            break

        default:
            startDate = year + "-" + month + "-" + day
            endDate = year + "-" + month + "-" + day
            cad = `<input class="date-form" type="date" id="startdate" name="startdate" value="${startDate}" min="${startDate}" required>
                    <input class="date-form" type="date" id="enddate" name="enddate" min="${endDate}" required>`
            break
    }
    return cad
}

function reponerFecha() {
    let startdate = document.getElementById('startdate')
    startdate.addEventListener('blur', () => {
        let endFecha = document.getElementById('enddate')

        endFecha.min = startdate.value
    })
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
            pais.value = 0
            selectDates()

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
async function saveIter() {
    let iterId

    //Sacar los valores del formulario
    const itername = document.getElementById('itername').value
    const iterdesc = document.getElementById('iterdesc').value
    const ciudad = document.getElementById('ciudad').value
    const pais = document.getElementById('paises').value
    const startdate = document.getElementById('startdate').value
    const enddate = document.getElementById('enddate').value

    //Query para sacar las IDs
    let qIter = query(iterRef)
    let querySnapshot = await getDocs(qIter)
    let cont = true

    do {
        //Crea un id aleatorio y compara si es igual que alguno de los viajes existentes
        iterId = Math.floor(Math.random() * 10000000)
        console.log(iterId)
        querySnapshot.forEach((doc) => {
            if (doc.data().iterId != iterId) {
                cont = false
            } else {
                cont = true
            }
        })
    } while (cont)

    insertIter(auth.currentUser.email, itername, iterdesc, pais, ciudad, startdate, enddate, iterId)
}

//Acceder a un viaje mediante código
inviteButton.addEventListener('click', async (e) => {
    e.preventDefault()
    let inviteId = accessId.value
    let email = auth.currentUser.email
    let idNoValid = false
    let access = false

    let qIter = query(iterRef)
    let querySnapshot = await getDocs(qIter)
    let a = []

    //Comprueba que la invitación sea válida y que el usuario no esté en el viaje
    querySnapshot.forEach((doc) => {
        if (doc.data().iterId == inviteId) {
            if (doc.data().participants.includes(email)) {
                idNoValid = true
            } else {
                a = doc.data().participants
                a.push(email)
                newParticipant(a, doc.id)
                access = true
            }
        } else {
            idNoValid = true
        }
    })

    //Si da error
    if (access) {
        document.getElementById('validId').classList.add('form-enviado-activo')
        //El mensaje se eliminará después de 5 segundos
        setTimeout(() => {
            document.getElementById('validId').classList.remove('form-enviado-activo')
        }, 5000)
    } else if (idNoValid) {
        //Si no está completo sale un error
        document.getElementById('invalidId').classList.add('formulario-error-activo')
        setTimeout(() => {
            document.getElementById('invalidId').classList.remove('formulario-error-activo')
        }, 5000)
    }

    //Temporizador para cargar los nuevos viajes después de un segundo
    setTimeout(() => {
        showIter()
    }, 1000)
})
