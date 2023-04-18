// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-analytics.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js"
import { getFirestore, getDocs, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"

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

const db = getFirestore(app)

export const usersRef = collection(db, "usuarios")
export const iterRef = collection(db, "viajes")
export const paisRef = collection(db, "paises")

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