const crypto = require('crypto');

function MD5 (str){
  return crypto.createHash('md5').update(str).digest("hex")
}


let te1 = MD5('coche rojo')
let te2 = MD5('coches rojos')
console.log(te1,te2)