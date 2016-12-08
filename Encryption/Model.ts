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

    alphabet:LetterAndReplacement[] = Model.makeAlphabet (); 

    encryptionMethods : EncryptionMethod[] = [
       new PlainText(), new ShiftCipher(), new SubstitutionCipher(Model.makeAlphabet)
    ]


    selectedItem : EncryptionMethod; 

    static makeAlphabet () : LetterAndReplacement[] {
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
        
        if(character === ' ' || charCode < 97 || charCode > 122  ) {return character;} 

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

        let randomizedOrder = SubstitutionCipher.randomizeNumberOrder
            (this.alphabet.length); 

        randomizedOrder.forEach((v, i) => {
           this.alphabet[i].replacement = this.alphabet[v].letter;     
        } );

    }


    static randomizeNumberOrder (maxLength: number) : number[]{

        let arrayLength = maxLength;

        let numbersArray:number[] = []; 

        while (arrayLength > 0) {
            let newNumber = Math.floor(Math.random() * (maxLength - 0 ) + 0)

            if(numbersArray.indexOf(newNumber) === -1) {
                numbersArray.push(newNumber);
                arrayLength --;
            }

        }
        
        return numbersArray;

    }

    alphabet : LetterAndReplacement[]

    mixCharacters (message:string) : string {

        return "";
    }


}