const fs = require('fs')
const crypto = require('crypto');


 function  spinToText(string) {

  function parseBr(string) {
    string = string.split("{");
    let data = [];
    for (let loop = 0; loop < string.length; loop++) {
        data[loop] = string[loop].split("}");
    }
    return data;
}



        let res = -1;
        let finalData = "";
        let loopinput = parseBr(string);
        let output = [];
        for (let loop = 0; loop < loopinput.length; loop++) {
            for (let loopx = 0; loopx < loopinput[loop].length; loopx++) {
                if (!(loopinput[loop][loopx] === "" || loopinput[loop][loopx] === "/n")) {
                    res++;
                    if (loopinput[loop][loopx].includes("|")) {
                        let out = loopinput[loop][loopx].split("|");
                        output[res] = out[Math.floor(Math.random() * out.length)];
                    } else {
                        output[res] = loopinput[loop][loopx];
                    }
                }
            }
        }
        for (let loop = 0; loop < output.length; loop++) {
            finalData += output[loop];
        }
        return finalData;
    }


 function spinMyText(data, lang) {

  const md5 = (str) => crypto.createHash('md5').update(str).digest("hex")

      const patern_code_1 = /<[^<>]+>/us;
      const patern_code_2 = /\[[^\[\]]+\]/i;
      const patern_code_3 = /\$@.*?\$@/i;
    
      data = data.trim();
      const found1 = data.match(patern_code_1) || [];
      const found2 = data.match(patern_code_2) || [];
      const found3 = data.match(patern_code_3) || [];
      const htmlcodes = found1.length > 0 ? found1[0] : '';
      const bbcodes = found2.length > 0 ? found2[0] : '';
      const vbcodes = found3.length > 0 ? found3[0] : '';
      const founds = {};
      const current_dir = __dirname;
      const sel_lang = lang.trim();
    
      const arr_data = [];
      if (htmlcodes) arr_data.push(htmlcodes);
      if (bbcodes) arr_data.push(bbcodes);
      if (vbcodes) arr_data.push(vbcodes);
    
      arr_data.forEach((code) => {
        const code_md5 = md5(code);
        data = data.replaceAll(code, `%%!%%${code_md5}%%!%%`);
      });
    
      const file = fs.readFileSync(`./core/${sel_lang}_db.sdata`, 'utf8').split("\n");
      file.forEach((line) => {
        const synonyms = line.split('|');
        synonyms.forEach((word) => {
          word = word.trim();
          if (word !== '') {
            word = word.replace('/', '\\/');
            if (new RegExp(`\\b${word}\\b`, 'u').test(data)) {
              founds[md5(word)] = line.replace(/\n|\r/g, '');
              data = data.replace(new RegExp(`\\b${word}\\b`, 'u'), md5(word));
            }
          }
        });
      });
    
      arr_data.forEach((code) => {
        const code_md5 = md5(code);
        data = data.replaceAll(`%%!%%${code_md5}%%!%%`, code);
      });
    
      const array_count = Object.keys(founds).length;
    
      if (array_count !== 0) {
        for (let code in founds) {
          data = data.replaceAll(code, `{${founds[code]}}`);
        }
      }
    
      return data;
    }
    


function drescribirTexto(text,lang){
  const textoConSinonimos = spinMyText(text,lang)
  return spinToText(textoConSinonimos)
}


// console.log(drescribirTexto('The red car is very fast','en'))