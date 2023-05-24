import { getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"
import { iterRef, usersRef, updateParticipants } from './firebase2.js'
import { getIter } from './inIter.js'

//Validación correo
const validation = {
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z09-]+\.[a-zA-Z0-9-.]+$/
}

let emailValidado = false
let newUser = document.getElementById('input-newParticipant')



//Crea los botones de editar datos del viaje
export function createButtons(dataIter) {
    let inputs = document.querySelectorAll('.iterDataInput')
    let disableFalseButton = document.getElementById('disableFalseButton')

    //Enseña el botón que guarda los cambios en los datos del viaje
    disableFalseButton.addEventListener('click', () => {
        let confirmEdit = document.getElementById('confirmEdit')
        confirmEdit.style.display = 'block'
        disableFalseButton.style.display = 'none'

        //Quita el disabled a todos los inputs para poder validarlos
        inputs.forEach((input) => {
            input.disabled = false
        })
    })

    //Guarda los cambios hechos
    confirmEdit.addEventListener('click', (e) => {
        //Validar campos del formulario
        function validateForm(e) {
            if (e.target.value.length == 0) {
                camposValidados[e.target.id] = false
            } else {
                camposValidados[e.target.id] = true
            }
        }

        //Asignar un evento por cada input
        inputs.forEach((input) => {
            input.addEventListener('keyup', validateForm)
            input.addEventListener('blur', validateForm)
        })
        saveNewData(e)
    })

    //Rellena el select para eliminar un usuario
    deleteParticipant.addEventListener('click', async () => {
        let participantToDelete = document.getElementById('participantToDelete')
        let q = query(iterRef, where("iterId", "==", dataIter.iterId))
        let querySnapshot = await getDocs(q)

        //Query para obtener el nombre y apellido del usuario
        let qUser = query(usersRef)
        let querySnapshotUsers = await getDocs(qUser)

        let cad = ``
        let participants
        let aux = []

        //Rellena el select de los participantes que se van a eliminar
        querySnapshot.forEach((doc) => {
            participants = doc.data().participants
            cad += `<option value="0">---- Selecciona un usuario</option>`

            for (let i = 0; i < participants.length; i++) {
                querySnapshotUsers.forEach((docUser) => {
                    if (participants[i] == docUser.data().email)
                        cad += `<option value="${participants[i]}">${docUser.data().name} ${docUser.data().surname}</option>`
                })
            }
        })
        participantToDelete.innerHTML = cad

        //Guarda los participantes en un array auxiliar
        participantToDelete.addEventListener('change' && 'blur', () => {
            aux = []
            for (let i = 0; i < participants.length; i++) {
                aux.push(participants[i])
            }
            console.log(aux.length)
        })

        //Elimina un participante del viaje
        btnDeleteParticipant.addEventListener('click', async () => {
            if (aux.length <= 1 || participantToDelete.value == 0) {
                //Error cuando no se puede eliminarel usuario seleccionado
                document.getElementById('cannotDeleteUser').classList.add('formulario-error-activo')
                setTimeout(() => {
                    document.getElementById('cannotDeleteUser').classList.remove('formulario-error-activo')
                }, 5000)
            } else {
                for (let i = 0; i < aux.length; i++) {
                    if (participantToDelete.value == aux[i]) {
                        aux.splice(i, 1)
                    }
                }
                let q = query(iterRef)
                let querySnapshot = await getDocs(q)

                //Compara el "id" del viaje para actualizar el que toca
                querySnapshot.forEach((doc) => {
                    if (dataIter.iterId == doc.data().iterId) {
                        updateParticipants(aux, doc.id)
                    }
                })
            }
            //Cerrar el modal
            const modal = bootstrap.Modal.getInstance(deleteParticipantModal.closest('.modal'));
            modal.hide()

            //Enseñar de nuevo los datos del viaje
            getIter(dataIter)
        })
    })

    //Añadir participante
    addParticipant.addEventListener('click', () => {
        let userToDb = document.getElementById('newParticipant')
        newUser.addEventListener('keyup', validateForm)
        newUser.addEventListener('blur', validateForm)

        let noExiste = true
        let existe = false
        let id = dataIter.iterId
        let arrayUsers = []
        console.log(id)

        btnAddParticipant.addEventListener('click', async () => {
            if (emailValidado) {
                let q = query(usersRef)
                let querySnapshot = await getDocs(q)

                querySnapshot.forEach((doc) => {
                    if (userToDb.value == doc.data().email) {
                        existe = true
                    } else {
                        //El usuario no existe
                        noExiste = true
                    }
                })

                //Si el usuario existe
                if (existe) {
                    let q = query(iterRef, where("iterId", "==", id))
                    let querySnapshotIter = await getDocs(q)

                    noExiste = false
                    querySnapshotIter.forEach(async (docIter) => {
                        if (docIter.data().participants.includes(userToDb.value)) {
                            //Si no está completo sale un error
                            document.getElementById('userinIter').classList.add('formulario-error-activo')
                            setTimeout(() => {
                                document.getElementById('userinIter').classList.remove('formulario-error-activo')
                            }, 5000)
                        } else {
                            //Rellena el array con los participantes que ya existen
                            for (let i = 0; i < docIter.data().participants.length; i++) {
                                arrayUsers.push(docIter.data().participants[i])
                            }

                            //Mete el nuevo participante al array
                            arrayUsers.push(userToDb.value)

                            let q = query(iterRef)
                            let querySnapshot = await getDocs(q)

                            //Compara el "id" del viaje para actualizar el que toca
                            querySnapshot.forEach((doc) => {
                                if (dataIter.iterId == doc.data().iterId) {
                                    //Guarda el participante
                                    updateParticipants(arrayUsers, doc.id)

                                    //Cerrar el modal
                                    const modal = bootstrap.Modal.getInstance(addParticipantModal.closest('.modal'));
                                    modal.hide()

                                    //Enseñar de nuevo los datos del viaje
                                    getIter(dataIter)
                                }
                            })

                        }
                    })
                    //Si no existe sale un error
                } else if (noExiste) {
                    //Si no está completo sale un error
                    document.getElementById('noexisteUser').classList.add('formulario-error-activo')
                    setTimeout(() => {
                        document.getElementById('noexisteUser').classList.remove('formulario-error-activo')
                    }, 5000)
                }
            }
        })
    })
}

//validar formulario
function validateForm(e) {
    validarCampo(validation.email, e.target, 'newParticipant')
}

//Validar campo de email
function validarCampo(expr, input, campo) {
    if (expr.test(input.value)) {
        //Campo correcto
        document.getElementById(`input-${campo}`).classList.remove('incorrect')
        document.getElementById(`input-${campo}`).classList.add('correct')
        document.querySelector(`#input-${campo} i`).classList.add('fa-check-circle')
        document.querySelector(`#input-${campo} i`).classList.remove('fa-times-circle')
        emailValidado = true
    } else {
        //Campo incorrecto
        document.getElementById(`input-${campo}`).classList.add('incorrect')
        document.getElementById(`input-${campo}`).classList.remove('correct')
        document.querySelector(`#input-${campo} i`).classList.add('fa-times-circle')
        document.querySelector(`#input-${campo} i`).classList.remove('fa-check-circle')
        emailValidado = false
    }
}

//Funcion que actualiza los datos cambiados en el viaje
async function saveNewData(e) {
    try {
        if (camposValidados.iterDataName && camposValidados.iterDataDesc && camposValidados.iterDataCity) {
            e.preventDefault()
            let inputs = document.querySelectorAll('.iterDataInput')
            let confirmEdit = document.getElementById('confirmEdit')
            let disableFalseButton = document.getElementById('disableFalseButton')
            disableFalseButton.style.display = 'block'

            //Sacar los valores del formulario
            const itername = document.getElementById('iterDataName').value
            const iterdesc = document.getElementById('iterDataDesc').value
            const ciudad = document.getElementById('iterDataCity').value
            const pais = document.getElementById('iterDataPaises').value
            const startdate = document.getElementById('dataStartdate').value
            const enddate = document.getElementById('dataEnddate').value

            let q = query(iterRef)
            let querySnapshot = await getDocs(q)

            //Compara el "id" del viaje para actualizar el que toca
            querySnapshot.forEach((doc) => {
                if (dataIter.iterId == doc.data().iterId) {
                    updateIter(itername, iterdesc, pais, ciudad, startdate, enddate, doc.id)
                }
            })

            //Bloquear inputs y esconder botón
            inputs.forEach((doc) => {
                doc.disabled = true
            })

            confirmEdit.style.display = 'none'
        } else {
            console.log('que')
        }
    } catch (error) {
        console.log(error)
    }
}