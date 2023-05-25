// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-analytics.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js"
import { getFirestore, getDocs, collection, addDoc, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzvMQ9J7YymzGSSPKsGwVWxuJy6SJ7zOc",
  authDomain: "calc-iter.firebaseapp.com",
  projectId: "calc-iter",
  storageBucket: "calc-iter.appspot.com",
  messagingSenderId: "387941054014",
  appId: "1:387941054014:web:4a85881ec1c21af633036f",
  measurementId: "G-8E8QN6E6MD"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

const analytics = getAnalytics(app)

export const db = getFirestore(app)

export const usersRef = collection(db, "usuarios")
export const iterRef = collection(db, "viajes")
export const paisRef = collection(db, "paises")
export const gastosRef = collection(db, "gastos")

//Insertar usuarios en la db
export async function guardar(name, surname, telefono, email, passwd, rol) {
  await addDoc(collection(db, "usuarios"), {
    name: name,
    surname: surname,
    telefono: telefono,
    email: email,
    passwd: passwd,
    rol: rol
  })
    .then((docRef) => {
      console.log("Datos añadidos correctamente")
    })
    .catch((error) => {
      console.error("Error al añadir el documento: ", error)
    })
}

//Select de los usuarios
export const selectUsuarios = await getDocs(collection(db, "usuarios"))

//Select de todos los paises
export const selectPaises = await getDocs(collection(db, "paises"))

//Crear un nuevo viaje
export async function insertIter(email, name, desc, country, city, startDate, endDate, iterId) {
  await addDoc(collection(db, "viajes"), {
    iterId: iterId,
    name: name,
    description: desc,
    country: country,
    city: city,
    startDate: startDate,
    endDate: endDate,
    participants: [
      email
    ]
  })
}

//Añadir participantes a un viaje
export async function newParticipant(email, iterId) {
  const docRef = doc(db, "viajes", iterId)
  console.log(docRef)
  await updateDoc(docRef, {
    participants: email
  })
  .then((docRef) => {
    console.log("datos actualizados")
  })
  .catch((error) => {
    console.log(error)
  })
}

//Nuevo gasto
export async function insertGasto(name, type, price, paidBy, payers, iterId, gastoId) {
  await addDoc(collection(db, "gastos"), {
    iterId: iterId,
    name: name,
    type: type,
    price: price,
    paidBy: paidBy,
    payers: payers,
    gastoId: gastoId
  })
}

//Actualizar datos del usuario
export async function updateUser(id, name, surname, telefono) {
  const docRef = doc(db, "usuarios", id)
  console.log(docRef)
  await updateDoc(docRef, {
    name: name,
    surname: surname,
    telefono: telefono
  })
  .then((docRef) => {
    console.log("datos actualizados")
  })
  .catch((error) => {
    console.log(error)
  })
}

//Actualizar datos del viaje
export async function updateIter(name, desc, country, city, startDate, endDate, id) {
  const docRef = doc(db, "viajes", id)
  console.log(docRef)
  await updateDoc(docRef, {
    name: name,
    description: desc,
    country: country,
    city: city,
    startDate: startDate,
    endDate: endDate
  })
  .then((docRef) => {
    console.log("datos actualizados")
  })
  .catch((error) => {
    console.log(error)
  })
}

//Eliminar participante
export async function updateParticipants(part, id) {
  const docRef = doc(db, "viajes", id)
  console.log(docRef)
  await updateDoc(docRef, {
    participants: part
  })
  .then((docRef) => {
    console.log("datos actualizados")
  })
  .catch((error) => {
    console.log(error)
  })
}

//Eliminar viaje
export async function deleteIter(id) {
  const docRef = doc(db, "viajes", id)
  console.log(docRef)
  await deleteDoc(docRef)
}

//Eliminar viaje
export async function deleteGasto(id) {
  const docRef = doc(db, "gastos", id)
  console.log(docRef)
  await deleteDoc(docRef)
}