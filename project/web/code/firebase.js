//Inicializar firebase
const fireConfig = firebase.initializeApp({
    apiKey: "AIzaSyC22eiTrPMO1ONZpZUuFgMY2gzZ17ach9M",
    authDomain: "trip-to-kebab.firebaseapp.com",
    projectId: "trip-to-kebab",
    storageBucket: "trip-to-kebab.appspot.com",
    messagingSenderId: "570056238564",
    appId: "1:570056238564:web:dea4b2ac808c54ae0853f1",
    measurementId: "G-NVBH4H5831"
})

var db = firebase.firestore()

const app = initializeApp(fireConfig)
const database = getDatabase(app)
const auth = firebase.auth()

function registrar() {
    firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
  });
}

//Guardar usuarios en la db
function guardar(name, surname, username, email, passwd, rol) {
    db.collection("usuarios").add({
        name: name,
        surname: surname,
        username: username,
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