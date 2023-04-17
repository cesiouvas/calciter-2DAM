import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js"
import { auth } from './firebase2.js'
import './register.js'

const loggedIn = document.querySelectorAll('.logged-in')
const loggedOut = document.querySelectorAll('.logged-out')

const logout = document.querySelector('#logout')
let info = document.getElementById('iter-info')
let cad = ``

onAuthStateChanged(auth, async (user) => {
    //Está logueado
    if (user) {
        //Llama al método que comprueba si existe
        loginCheck(user)
    } else { //No lo está
        loginCheck(user)
    }
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

//Cerrar sesión con el usuario actual
logout.addEventListener('click', async () => {
    await signOut(auth)
    info.innerHTML = cad
    console.log('El usuario ha cerrado sesión')
})
