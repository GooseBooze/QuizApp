let objekter = [];

function leggTilObjekt() {
    let nyttObjekt = { id: objekter.length + 1, navn: "Objekt " + (objekter.length + 1) };
    objekter.push(nyttObjekt);
    document.getElementById("output").innerHTML = "Objekter: " + JSON.stringify(objekter, null, 2);
}
