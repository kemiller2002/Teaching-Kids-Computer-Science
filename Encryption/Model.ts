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

    offset : number

    shift (character : string) : string { 
        let  number =  character.charCodeAt(0) + this.offset / 26;
        return String.fromCharCode (number); 
    }

    mixCharacters (message:string) : string {
        return message.split('').map((v, _) => this.shift(v) ).join();
    }


}