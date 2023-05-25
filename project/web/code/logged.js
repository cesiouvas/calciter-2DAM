import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js"
import { auth, usersRef, updateUser } from './firebase2.js'
import './register.js'
import { getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"


const loggedIn = document.querySelectorAll('.logged-in')
const loggedOut = document.querySelectorAll('.logged-out')

const email = document.getElementById('login-email')
const passwd = document.getElementById('login-passwd')

//DataUser
let dataUser = document.getElementById('dataUser')
let editData = document.getElementById('editData')
let goToData = document.getElementById('goToData')
let userInfo = document.getElementById('userInfo')

//Inputs from dataUser
let dataName = document.getElementById('dataName')
let dataSurname = document.getElementById('dataSurname')
let dataTelefono = document.getElementById('dataTelefono')

let newIterButtons = document.getElementById('newIterButtons')
let logoDiv = document.getElementById('logoDiv')

const logout = document.querySelector('#logout')
let info = document.getElementById('iter-info')
let cad = ``
let idUser

//Validación de campos
const validation = {
    telefono: /^(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}/
}

const camposValidados = {
    telefono: true,
    name: true,
    surname: true
}

const inputs = document.querySelectorAll("#update-form input")

//Comprueba que el usuario ha iniciado sesión
onAuthStateChanged(auth, async (user) => {
    //Está logueado
    if (user) {
        //Llama al método que comprueba si existe
        loginCheck(user)
        showUserData()
        newIterButtons.style.display = 'block'
        logoDiv.style.display = 'none'
    } else { //No lo está
        loginCheck(user)
        newIterButtons.style.display = 'none'
        logoDiv.style.display = 'block'
    }
})

//Enseña un div y oculta otro
userInfo.addEventListener('click', () => {
    editData.style.display = 'none'
    dataUser.style.display = 'block'
})

//Esconde o enseña el menú para iniciar sesión o cerrarla
const loginCheck = user => {
    if (user) {
        //Cerrar sesión aparece
        loggedOut.forEach(link => link.style.display = 'none')
        loggedIn.forEach(link => link.style.display = 'block')
    } else {
        loggedOut.forEach(link => link.style.display = 'block')
        loggedIn.forEach(link => link.style.display = 'none')
    }
}

//Muestra por pantalla los datos del usuario
async function showUserData() {
    let q = query(usersRef, where("email", "==", auth.currentUser.email))
    let querySnapshot = await getDocs(q)
    let cad = ``

    editData.style.display = 'none'
    dataUser.style.display = 'block'

    cad += `<table>`

    querySnapshot.forEach((doc) => {
        cad += `<tr>
                    <td>
                        <label for="userName" class="fw-bold text-decoration-underline">Nombre</label>
                        <p id="userName">${doc.data().name}</p>
                    </td>
                    <td>
                        <label for="userSurname" class="fw-bold text-decoration-underline">Apellido</label>
                        <p id="userSurname">${doc.data().surname}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="userPhone" class="fw-bold text-decoration-underline">Teléfono</label>
                        <p id="userPhone">${doc.data().telefono}</p>
                    </td>
                    <td>
                        <label for="userEmail" class="fw-bold text-decoration-underline">Email</label>
                        <p id="userEmail">${doc.data().email}</p>
                    </td>
                </tr>`
    })
    cad += `</table>
            <button id="showEdit" type="button" class="btn bg-dark mt-4" style="width: 100%; color: white;">Editar datos</button>`

    dataUser.innerHTML = cad

    //Editar datos del usuario
    showEdit.addEventListener('click', () => {

        querySnapshot.forEach((doc) => {
            dataName.value = doc.data().name
            dataSurname.value = doc.data().surname
            dataTelefono.value = doc.data().telefono
            idUser = doc.id
        })
        editData.style.display = 'block'
        dataUser.style.display = 'none'
    })
}

//Abrir datos del usuario
goToData.addEventListener('click', async (e) => {
    e.preventDefault()
    showUserData()
})


//Cerrar sesión con el usuario actual
logout.addEventListener('click', async () => {
    newIterButtons.style.display = 'none'
    await signOut(auth)
    info.innerHTML = cad
    console.log('El usuario ha cerrado sesión')
    email.value = ""
    passwd.value = ""
})

//Validar el formulario
function validateForm(e) {
    switch (e.target.name) {
        case "dataTelefono":
            //Llamada a la función que valida el username
            validarCampo(validation.telefono, e.target, 'telefono')
            break
        case "dataName":
            //Comprueba que el campo no esté vacío
            validarNom(e.target, 'name')
            break
        case "dataSurname":
            //Comprueba que el campo no esté vacío
            validarNom(e.target, 'surname')
            break
    }
}

//Función que valida el campo de teléfono
const validarCampo = (expr, input, campo) => {
    if (expr.test(input.value)) {
        //Campo correcto
        document.getElementById(`update-${campo}`).classList.remove('incorrect')
        document.getElementById(`update-${campo}`).classList.add('correct')
        document.querySelector(`#update-${campo} i`).classList.add('fa-check-circle')
        document.querySelector(`#update-${campo} i`).classList.remove('fa-times-circle')
        camposValidados[campo] = true
    } else {
        //Campo incorrecto
        document.getElementById(`update-${campo}`).classList.add('incorrect')
        document.getElementById(`update-${campo}`).classList.remove('correct')
        document.querySelector(`#update-${campo} i`).classList.add('fa-times-circle')
        document.querySelector(`#update-${campo} i`).classList.remove('fa-check-circle')
        camposValidados[campo] = false
    }
}

//Valida los campos de nombre y apellido
const validarNom = (input, campo) => {
    if (input.value != "") {
        camposValidados[campo] = true
    } else {
        camposValidados[campo] = false
    }
}

//Actualizar datos del usuario
updateData.addEventListener('click', (e) => {
    if (camposValidados.telefono && camposValidados.name && camposValidados.surname) {
        e.preventDefault()

        //Llama a la función de actualizar usuarios de firebase2.js
        updateUser(idUser, dataName.value, dataSurname.value, dataTelefono.value)
    }
})

//Asignar un evento por cada input
inputs.forEach((input) => {
    input.addEventListener('keyup', validateForm)
    input.addEventListener('blur', validateForm)
})