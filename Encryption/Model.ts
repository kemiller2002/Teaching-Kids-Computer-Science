interface EncryptionMethod {
    name:string;
    mixCharacters (message:string) : string
}

class LetterAndReplacement {
    constructor (public letter : string){}
 
    replacement : string = ""; 
}



interface Object {
    tee<T>(fn : any) : T;
}


Object.prototype.tee = function<T> (fn : (i : T)=>void) {
    fn (this);
    return this;
}

class Model {

    constructor () {}

    alphabet:LetterAndReplacement[] = this.makeAlphabet (); 

    encryptionMethods : EncryptionMethod[] = [
       new PlainText(), new ShiftCipher(), new SubstitutionCipher(this.makeAlphabet)
    ]


    selectedItem : EncryptionMethod; 

    makeAlphabet () : LetterAndReplacement[] {
        return "abcdefghijklmnopqrstuvwxyz".
                split('').
                map((l, _) => (new LetterAndReplacement(l)) );  
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

    constructor (makeLetters : () => LetterAndReplacement[]) {
        this.alphabet = makeLetters ();
        let count = this.alphabet.length; 

    }


    static randomizeNumberOrder (maxLength: number, numbers:number[]) : void{
        if(maxLength === numbers.length){
            return;
        }

        let newNumber = Math.floor(Math.random() * (1 - 26) + 1)

        if(numbers.indexOf(newNumber) === -1){
            numbers.push(newNumber);
        }

        this.randomizeNumberOrder (maxLength, numbers);

    }

    alphabet : LetterAndReplacement[]

    mixCharacters (message:string) : string {

        return "";
    }


}