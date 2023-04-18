import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js"
import { auth, guardar } from './firebase2.js'

//Parametros de register.html
let btnRegister = document.getElementById("btnRegister")
let usuarioExiste = document.getElementById("usuario-existe")

//Campos de formulario
let name1 = document.getElementById('name')
let surname = document.getElementById('surname')
let username = document.getElementById('username')
let email = document.getElementById('email')
let passwd = document.getElementById('passwd')
let confpasswd = document.getElementById('confpasswd')

//Formulario e inputs
const registerForm = document.getElementById("register-form")
const inputs = document.querySelectorAll("#register-form input")

//Parametros de validación del formulario
const validation = {
    telefono: /^(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}/,
    passwd: /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/,
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z09-]+\.[a-zA-Z0-9-.]+$/,
}

const camposValidados = {
    telefono: false,
    name: false,
    surname: false,
    passwd: false,
    email: false
}

//El programa funciona
window.addEventListener('DOMContentLoaded', () => {
    console.log('working')
})

//Validar el formulario
function validateForm(e) {
    switch (e.target.name) {
        case "telefono":
            //Llamada a la función que valida el username
            validarCampo(validation.telefono, e.target, 'telefono')
            break
        case "passwd":
            //Llamada a la función que valida la contraseña
            validarCampo(validation.passwd, e.target, 'passwd')
            validarConfpasswd()
            break
        case "email":
            //Llamada a la función que valida el email
            validarCampo(validation.email, e.target, 'email')
            break
        case "confpasswd":
            //Comprueba que las contraseñas sean iguales
            validarConfpasswd()
            break
        case "name":
            //Comprueba que el campo no esté vacío
            validarNom(e.target, 'name')
            break
        case "surname":
            //Comprueba que el campo no esté vacío
            validarNom(e.target, 'surname')
            break
    }
}

//Función que valida los campos
const validarCampo = (expr, input, campo) => {
    if (expr.test(input.value)) {
        //Campo correcto
        document.getElementById(`input-${campo}`).classList.remove('incorrect')
        document.getElementById(`input-${campo}`).classList.add('correct')
        document.querySelector(`#input-${campo} i`).classList.add('fa-check-circle')
        document.querySelector(`#input-${campo} i`).classList.remove('fa-times-circle')
        camposValidados[campo] = true
    } else {
        //Campo incorrecto
        document.getElementById(`input-${campo}`).classList.add('incorrect')
        document.getElementById(`input-${campo}`).classList.remove('correct')
        document.querySelector(`#input-${campo} i`).classList.add('fa-times-circle')
        document.querySelector(`#input-${campo} i`).classList.remove('fa-check-circle')
        camposValidados[campo] = false
    }
}

const validarNom = (input, campo) => {
    if (input.value != "") {
        camposValidados[campo] = true
    } else {
        camposValidados[campo] = false
    }
}

//Las dos contraseñas coinciden
const validarConfpasswd = () => {
    console.log('metodo confpasswd')
    const inputPasswd1 = document.getElementById('passwd')
    const inputPasswd2 = document.getElementById('confpasswd')

    if (inputPasswd1.value !== inputPasswd2.value) {
        //No coinciden
        document.getElementById(`input-passwd2`).classList.add('incorrect')
        document.getElementById(`input-passwd2`).classList.remove('correct')
        document.querySelector(`#input-passwd2 i`).classList.add('fa-times-circle')
        document.querySelector(`#input-passwd2 i`).classList.remove('fa-check-circle')
        camposValidados['passwd'] = false
    } else {
        if (inputPasswd2.value != "") {
            //Son iguales y no son nulas
            document.getElementById(`input-passwd2`).classList.remove('incorrect')
            document.getElementById(`input-passwd2`).classList.add('correct')
            document.querySelector(`#input-passwd2 i`).classList.add('fa-check-circle')
            document.querySelector(`#input-passwd2 i`).classList.remove('fa-times-circle')
            camposValidados['passwd'] = true
        }
    }
}

//Asignar un evento por cada input
inputs.forEach((input) => {
    input.addEventListener('keyup', validateForm)
    input.addEventListener('blur', validateForm)
})

btnRegister.addEventListener('click', async (e) => {
    if (camposValidados.telefono && camposValidados.name && camposValidados.email && camposValidados.surname && camposValidados.passwd) {
        e.preventDefault()
        //Registra el usuario
        registrar()

        //Guarda el usuario en la db para iniciar sesión mediante email y passwd
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email.value, passwd.value)
        console.log(userCredentials)
        } catch (error) {
            console.log(error)
        }

        //Reinicia los valores del formulario
        name1.value = ""
        surname.value = ""
        telefono.value = ""
        email.value = ""
        passwd.value = ""
        confpasswd.value = ""

        camposValidados['telefono'] = false
        camposValidados['name'] = false
        camposValidados['surname'] = false
        camposValidados['email'] = false
        camposValidados['passwd'] = false

        //Mensaje que confirma que se ha creado el usuario
        document.getElementById('form-enviado').classList.add('form-enviado-activo')
        //El mensaje se eliminará después de 5 segundos
        setTimeout(() => {
            document.getElementById('form-enviado').classList.remove('form-enviado-activo')
        }, 5000)

        //Elimina los iconos que marcan que el campo está correcto
        document.querySelectorAll('.correct').forEach((icon) => {
            icon.classList.remove('correct')
        })

    } else {
        //Si no está completo sale un error
        document.getElementById('formulario-error').classList.add('formulario-error-activo')
        setTimeout(() => {
            document.getElementById('formulario-error').classList.remove('formulario-error-activo')
        }, 5000)
    }
})

//Función de registrar un usuario en la bd
const registrar = () => {
    const name = registerForm['name']
    const surname = registerForm['surname']
    const telefono = registerForm['telefono']
    const email = registerForm['email']
    const passwd = registerForm['passwd']

    guardar(name.value, surname.value, telefono.value, email.value, passwd.value, "usuario")


    //Crea una transacción para guardar los datos
    /* 
    let transaction = { name: name.value, surname: surname.value, username: username.value, email: email.value, passwd: passwd.value }
    let transactionJson = JSON.stringify(transaction)

    //Manda los datos al backend y se guardan ahí
    fetch('http://localhost:3000/transaction', {
        method: 'Post',
        body: transactionJson
    })
    */
}