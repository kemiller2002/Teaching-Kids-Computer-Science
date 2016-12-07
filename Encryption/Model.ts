interface EncryptionMethod {
    name:string;
    mixCharacters (message:string) : string
}

class Model {

    constructor () {}

    alphabet:string[] = this.makeAlphabet (); 

    encryptionMethods : EncryptionMethod[] = [
       new PlainText(), new ShiftCipher(), new SubstitutionCipher()
    ]


    selectedItem : EncryptionMethod; 

    makeAlphabet () : string[] {
        return "abcdefghijklmnopqrstuvwxyz".split('');  
    }
}

class PlainText {
    name: string =  "Plain Text";
    mixCharacters(message:string) : string {return message;}
}

class ShiftCipher implements EncryptionMethod {
    name  : string =  "Shift Cipher"

    offset : number =  (() => Math.floor(Math.random() * (1 - 26) + 1))();

    shift (character : string) : string { 
        let charCode = character.charCodeAt(0)
        
        if(character === ' ' || charCode < 97 || charCode > 122  ) 
        {return character;} 

        let  number =  Math.floor((charCode + this.offset) % 26 + 97);

        return String.fromCharCode (number); 
    }

    mixCharacters (message:string) : string {
        return message.split('').map((v, _) => this.shift(v) ).join('');
    }
}

class SubstitutionCipher implements EncryptionMethod {

    name =  "Substitution Cipher"

    mixCharacters (message:string) : string {

        return "";
    }


}