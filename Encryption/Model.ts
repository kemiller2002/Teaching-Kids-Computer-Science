interface EncryptionMethod {
    name:string;
    mixCharacters (message:string) : string
}

class Model {

    constructor () {}

    alphabet:string[] = this.makeAlphabet () ; 

    encptionMethods : any

    makeAlphabet () : string[] {
        return "abcdefghijklmnopqrstuvwxyz".split('');  
    }
}


class ShiftCipher implements EncryptionMethod {
    name : "Shift Cipher"

    offset : number =  (() => Math.floor(Math.random() * (1 - 26) + 1))();

    shift (character : string) : string { 
        if(character === ' ' ) {return ' ';} 

        let charCode = character.charCodeAt(0)
        let  number =  Math.floor((charCode + this.offset) % 26 + 97);

        return String.fromCharCode (number); 
    }

    mixCharacters (message:string) : string {
        return message.split('').map((v, _) => this.shift(v) ).join('');
    }
}