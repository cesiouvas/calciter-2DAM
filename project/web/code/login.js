import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js"
import { auth } from './firebase2.js'

const loginForm = document.querySelector('#login-form')

loginForm.addEventListener('submit', async e => {
    e.preventDefault()

    const email = loginForm['login-email'].value
    const passwd = loginForm['login-passwd'].value

    try {
        const credentials = await signInWithEmailAndPassword(auth, email, passwd)

        //Ha iniciado sesión correctamente
        document.getElementById('form-iniciado').classList.add('form-enviado-activo')
        //El mensaje se eliminará después de 5 segundos
        setTimeout(() => {
            document.getElementById('form-iniciado').classList.remove('form-enviado-activo')
        }, 5000)

        //Cerrar el modal
        const modal = bootstrap.Modal.getInstance(loginForm.closest('.modal'));
        modal.hide();

        console.log(credentials)
    } catch (error) {
        if (error.code === "auth/user-not-found") {
            document.getElementById('juan').classList.add('formulario-error-activo')
            setTimeout(() => {
                document.getElementById('juan').classList.remove('formulario-error-activo')
            }, 5000)
        }

        if (error.code === "auth/wrong-password") {
            document.getElementById('error-passwd').classList.add('formulario-error-activo')
            setTimeout(() => {
                document.getElementById('error-passwd').classList.remove('formulario-error-activo')
            }, 5000)
        }
        console.log(error)
    }
})

//Google login
const googleButton = document.getElementById('googleLogin')
googleButton.addEventListener('click', async (e) => {
    e.preventDefault()

    const provider = new GoogleAuthProvider()

    try {
        const credentials = await signInWithPopup(auth, provider)
        console.log(credentials)

        const modalInstance = bootstrap.Modal.getInstance(googleButton.closest('.modal'));
        modalInstance.hide();
    } catch (error) {
        console.log(error)
    }
})

