//let div1 = document.getElementById('prueba')
function rellenar() {

    let cad = ``
    for (let i = 0; i < transactionArr; i++) {
        cad += `<div>
                    <p>${transactionArr[i]}</p>
                </div>`
    }
    return cad
}

div1.innerHTML = rellenar()