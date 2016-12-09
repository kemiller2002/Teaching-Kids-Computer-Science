

interface Observable<T> {
    (item?:T) : T
}

interface ObservableArray<T> {
    (item?:Observable<T>) : Observable<T>[]
}

declare class ko {
    static observable<T>(item?:T) : Observable<T>;
    static observableArray<T>(item?:T) :  Observable<T>[]; 
}


interface EncryptionMethod {
    name:string;
    mixCharacters (message:string) : string
}

class LetterAndReplacement {
    constructor (public letter : string){}
    
    private _replacement : string = undefined; 
    private _replacementSet : boolean = false;

    get replacement() {
        return this._replacement || (this._replacementSet) ? this.letter : "";
    }
    
    set replacement(l : string) {
        this._replacement = l; 
        this._replacementSet = true;
        console.log(`REPLACED ${l} `)
    }



    get encryptionReplacement() {
        return this.replacement || this.letter;
    }/*
     set encryptionReplacement(l : string) {
    }*/

}

class Model {

    constructor () {}

    alphabet:Observable<LetterAndReplacement>[] = Model.makeAlphabet (); 

    encryptionMethods : EncryptionMethod[] = [
       new PlainText(), new ShiftCipher(), new SubstitutionCipher(Model.makeAlphabet)
    ]

    test:any= ko.observable("SDF"); //Observable<LetterAndReplacement> = ko.observable(new LetterAndReplacement("!"));

    selectedMethod : (item?:EncryptionMethod) => EncryptionMethod = 
        ko.observable<EncryptionMethod>(this.encryptionMethods[0]); 

    unencryptedMessage : string; 
    
    encryptedMessage : Observable<LetterAndReplacement>[] = ko.observableArray<LetterAndReplacement>()

    generateNewMessage () {
        this.unencryptedMessage = "this is a test.";
        let encryptedText = this.selectedMethod().mixCharacters(this.unencryptedMessage)

        let encryptedMessage : Observable<LetterAndReplacement>[] = 
            encryptedText.split('').
            map(l => this.getLetterAndReplacementByLetter(l));
        
        while(this.encryptedMessage.pop() !== undefined) {}

        encryptedMessage.forEach(l => this.encryptedMessage.push(l));
    }

    static makeAlphabet () : Observable<LetterAndReplacement>[] {
        return "abcdefghijklmnopqrstuvwxyz".
                split('').
                map((l, _) => (ko.observable(new LetterAndReplacement(l))) );  
    }

    getLetterAndReplacementByLetter (letter:string) : Observable<LetterAndReplacement> {
        return this.alphabet.filter(x=>x().letter.toLowerCase() === letter.toLowerCase())[0] 
            || ko.observable<LetterAndReplacement>(new LetterAndReplacement(letter));
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

    constructor (makeLetters : () => Observable<LetterAndReplacement>[]) {
        this.alphabet = makeLetters ();
        let count = this.alphabet.length; 

        let randomizedOrder = SubstitutionCipher.randomizeNumberOrder
            (this.alphabet.length); 

        randomizedOrder.forEach((v, i) => {
           this.alphabet[i]().replacement = this.alphabet[v]().letter;     
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

    alphabet : Observable<LetterAndReplacement>[]

    mixCharacters (message:string) : string {

        return "";
    }


}