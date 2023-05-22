import { getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"
import { auth, iterRef, usersRef, gastosRef } from './firebase2.js'
import { divisionPago } from './gasto.js'

let info = document.getElementById('iter-info')
let newIterButtons = document.getElementById('newIterButtons')
let dataIter

//Función que enseña los viajes del usuario actual
export async function showIter() {
    let cad = ``
    let cont = 1
    let q = query(iterRef, where("participants", "array-contains", auth.currentUser.email), orderBy("startDate"))
    let querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
        cad += `<div id="iter${cont}" class="rounded border border-dark mt-3 bg-iter" style="height: 70px">
                    <table style="height: 70px">
                        <td style="width: 25%; font-size: 13px;">${doc.data().name}</td>
                        <td style="width: 35%; padding-left: 8px; font-size: 13px;" class="text-decoration-underline">${doc.data().startDate} - ${doc.data().endDate}</td>
                        <td style="width: 30%; padding-left: 10px; font-size: 13px;">${doc.data().country}, ${doc.data().city}</td>
                        <td style="width: 10px; font-size: 13px;"><button id="deleteButton" class="deleteButton"><img src="../img/delete.png" style="width: 17px; height: 20px"></button></td>
                     </table>     
                </div>`
        cont++
    })

    //Comprueba si el usuario tiene viajes
    if (cont <= 1) {
        cad = `<p>Todavía no tienes viajes creados, prueba a crear alguno con los botones inferiores</p>`
        info.innerHTML = cad
    } else {
        //Mostrar los viajes por pantalla
        info.innerHTML = cad
    }

    //Reseteo el contador para crear los eventos click
    cont = 1

    querySnapshot.forEach((doc) => {
        document.getElementById('iter' + cont).addEventListener('click', () => { getIter(doc.data()) })
        cont++
    })
}

//Click para ver los datos del
datos.addEventListener('click', () => {
    divisionPago(dataIter)
    getDatos()
})

//Enseña los datos del viaje cuando hacemos click
export function getDatos() {
    let gastosViaje = document.getElementById('gastosViaje')
    let datosViaje = document.getElementById('datosViaje')
    let gastosButtons = document.getElementById('gastosButtons')
    gastosButtons.style.display = 'none'
    datos.classList.add('bordeBotones')
    gastos.classList.remove('bordeBotones')
    datosViaje.style.display = 'block'
    gastosViaje.style.display = 'none'

    gastos.addEventListener('click', () => {
        getIter(dataIter)
    })
}

//Calcula los gastos 
export async function calcGastos(dataIter) {
    let deudas = document.getElementById('deudasGroup')
    let cad = ``
    let gasto = 0

    //Recorre los participantes para hacer la suma de cada uno
    for (let i = 0; i < dataIter.participants.length; i++) {

        //Enseñar el nombre y apellido del usuario
        let qUsers = query(usersRef, where("email", "==", dataIter.participants[i]))
        let querySnapUsers = await getDocs(qUsers)

        //Saber quien ha pagado y a quien hay que devolverle el dinero
        let q = query(gastosRef, where("paidBy", "==", dataIter.participants[i]), where("iterId", "==", dataIter.iterId))
        let querySnapt = await getDocs(q)

        querySnapUsers.forEach((docUser) => {
            cad += `<p><b>${docUser.data().name} ${docUser.data().surname}:</b>`
            querySnapt.forEach((docPaid) => {
                if (docPaid.data().payers.includes(auth.currentUser.email)) {
                    if (docPaid.data().paidBy == auth.currentUser.email) {
                    } else {
                        gasto += docPaid.data().price / docPaid.data().payers.length
                    }
                }
            });
            //Limito los decimales a 2 dígitos
            gasto = gasto.toFixed(2)
            cad += ` ${gasto}€</p>`
            gasto = 0
            deudas.innerHTML = cad
        })
    }
}

function selectDates(iter) {
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
                    cad = `<td>
                                <input class="iterDataInput" type="date" id="dataStartdate" name="startdate" value="${iter.startDate}" min="${startDate}" required>
                            </td>
                            <td>
                                <input class="iterDataInput" type="date" id="dataEnddate" name="enddate" value="${iter.endDate}" min="${endDate}" required>
                            </td>`
                    break
                default:
                    //startDate es la fecha actual
                    startDate = year + "-0" + month + "-" + day
                    //endDate es la fecha actual + 1
                    endDate = year + "-0" + month + "-" + day
                    cad = `<td>
                                <input class="iterDataInput" type="date" id="dataStartdate" name="startdate" value="${iter.startDate}" min="${startDate}" required>
                            </td>
                            <td>
                                <input class="iterDataInput" type="date" id="dataEnddate" name="enddate" value="${iter.endDate}" min="${endDate}" required>
                            </td>`
                    break
            }
            break

        default:
            startDate = year + "-" + month + "-" + day
            endDate = year + "-" + month + "-" + day
            cad = `<td>
                        <input class="iterDataInput" type="date" id="dataStartdate" name="startdate" value="${iter.startDate}" min="${startDate}" required>
                    </td>
                    <td>
                        <input class="iterDataInput" type="date" id="dataEnddate" name="enddate" value="${iter.endDate}" min="${endDate}" required>
                    </td>`
            break
    }
    return cad
}

function reponerFecha() {
    let startdate = document.getElementById('stadataStartdatertdate')
    startdate.addEventListener('blur', () => {
        let endFecha = document.getElementById('dataEnddate')

        endFecha.min = startdate.value
    })
}

//Enseña los datos del viaje
export async function getIter(iter) {
    let gastosButtons = document.getElementById('gastosButtons')
    gastosButtons.style.display = 'block'
    gastos.classList.add('bordeBotones')
    datos.classList.remove('bordeBotones')
    let cad = ``

    divisionPago(iter)
    calcGastos(iter)

    cad += `<div id="datosViaje" style="margin-top: 8%;">
                <table>
                    <tr>
                        <td>
                            <input class="iterDataInput" type="text" plceholder="Nombre del viaje" id="iterDataName" value="${iter.name}">
                        </td>
                        <td>
                            <input class="iterDataInput" type="text" plceholder="Nombre del viaje" id="iterDataName" value="${iter.description}">
                        </td>
                    </tr>
                    <tr>`

    cad += selectDates(iter)

    cad += `</tr>
            <tr>
                <td>
                    <input
                </td>
            </tr>
                </table>
                            <p>estoy dentro del viaje ${iter.iterId}</p>
                <p>${iter.participants}<p>
            </div>`

    let qGastos = query(gastosRef)
    let querySnapshot = await getDocs(qGastos)

    cad += `<div id="gastosViaje" style="margin-top: 5%">`
    let cont = 0
    //Muestra los gastos por pantalla
    querySnapshot.forEach(async (doc) => {
        //Enseñar el nombre y apellido del usuario
        if (doc.data().iterId == iter.iterId) {
            let qUsers = query(usersRef, where("email", "==", doc.data().paidBy))
            let querySnapUsers = await getDocs(qUsers)
            cad += `<div id="${doc.data().gastoId}" class="rounded border border-dark mt-3 bg-iter" style="padding: 10px">
                        <table>
                        <td class="tdGastos"><img src="../img/${doc.data().type}.png" class="gastoImg"></td>
                        <td class="tdGastos">${doc.data().name}</td>
                        <td class="tdGastos">${doc.data().price}€</td>`
            querySnapUsers.forEach((docUser) => {
                cad += `<td class="tdGastos">${docUser.data().name} ${docUser.data().surname}</td>
                                    <td>${docUser.data().telefono}</td>`
            })
            cad += `</table>
                    </div>`
            cont++
        }
    })

    console.log(cad)

    //Lo anterior es un proceso await, por lo que tarda un poco en cargar  
    //usamos un timeout de unas milesimas para que se enseñe todo correctamentr
    setTimeout(() => {
        //Enseñar el menu de gastos y datos
        let botoneraPadre = document.getElementById('botoneraPadre')
        botoneraPadre.style.display = 'block'
        newIterButtons.style.display = 'none'

        //Se comprueba que hayan gastos creados o no
        if (cont == 0) {
            cad += `<div class="noIter">
                        <p>Todavía no tienes gastos, prueba a crear alguno con los botones de abajo</p>
                    </div>
                </div>`
            info.innerHTML = cad
            let datosViajeDiv = document.getElementById('datosViaje')
            datosViajeDiv.style.display = 'none'
        } else {
            cad += `</div>`
            info.innerHTML = cad
            let datosViajeDiv = document.getElementById('datosViaje')
            datosViajeDiv.style.display = 'none'
        }
    }, 150)

    //Calcula quienes deben pagar el gasto
    pagadorGasto(iter)

    dataIter = iter

    datos.addEventListener('click', () => {
        divisionPago(dataIter)
        getDatos()
    })
}

//Nos devuelve a la pestaña donde se enseña la lista de viajes
allIter.addEventListener('click', () => {
    let botoneraPadre = document.getElementById('botoneraPadre')
    let gastosButtons = document.getElementById('gastosButtons')
    gastosButtons.style.display = 'none'
    botoneraPadre.style.display = 'none'
    newIterButtons.style.display = 'block'
    showIter()
})

//Rellena el select para seleccionar quien paga el gasto
async function pagadorGasto(datos) {
    let selectPagador = document.getElementById('pagadoPor')
    let participants = datos.participants
    let q = query(usersRef)
    let querySnapshot = await getDocs(q)
    let cad = ``

    cad += `<option value="0">---Selecciona pagador</option>`

    querySnapshot.forEach((doc) => {
        for (let i = 0; i < participants.length; i++) {
            if (doc.data().email == participants[i]) {
                cad += `<option value="${participants[i]}">${doc.data().name} ${doc.data().surname}</option>`

            }
        }
    })
    selectPagador.innerHTML = cad
}
