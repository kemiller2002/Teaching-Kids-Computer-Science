

interface Observable<T> {
    (item?:T) : T
}

interface ObservableArray<T> {
    (item?:Observable<T>) : Observable<T>[]
}

declare class ko {
    static observable<T>(item?:T) : Observable<T>;
    static observableArray<T>(item?:T) :  Observable<T>[];
    static computed<T> (fn : (() => T), i:any) : T; 
}


interface EncryptionMethod {
    name:string;
    mixCharacters (message:string) : string
}

class LetterAndReplacement {
    constructor (public letter : string){}
    
    replacement : Observable<string> = ko.observable(""); 

    replacedLetterValue : string = ko.computed (
            () => {
                    return (this.replacement() === "" || !this.replacement()) ?
                        this.letter : this.replacement();
                
            }, this); 

}

class Model {

    constructor () {}

    alphabet:Observable<LetterAndReplacement>[] = Model.makeAlphabet (); 

    encryptionMethods : EncryptionMethod[] = [
       new PlainText(), new RotCipher(), new SubstitutionCipher(Model.makeAlphabet)
    ]

    selectedMethod : (item?:EncryptionMethod) => EncryptionMethod = 
        ko.observable<EncryptionMethod>(this.encryptionMethods[0]); 

    unencryptedMessage : string; 
    
    encryptedMessage : Observable<LetterAndReplacement>[] = ko.observableArray<LetterAndReplacement>()

    messages : string [] = [
        "Never trust anything that can think for itself if you can’t see where it keeps its brain. ― Harry Potter and the Chamber of Secrets",
        "You sort of start thinking anything’s possible if you’ve got enough nerve. ― Harry Potter and the Half-Blood Prince",
        "It takes a great deal of bravery to stand up to our enemies, but just as much to stand up to our friends. – Harry Potter and the Philosopher’s Stone"
        ,"It’s no use going back to yesterday, because I was a different person then. - Alice in Wonderland"
        ,"Why, sometimes I've believed as many as six impossible things before breakfast. Alice in Wonderland"
        ,"Never, never, never give up. - Winston Churchhill" 
        ,"It's the job that's never started as takes longest to finish. - Lord of the Rings"
        ,"Do. Or do not. There is no try. - The Empire Stikes Back"
        ,"Never tell me the odds - The Empire Strikes Back."
        ,"Your father... was seduced by the Dark Side of the Force. He ceased to be the Jedi Anakin Skywalker and became Darth Vader. When that happened, the good man who was your father was destroyed. So, what I told you was true... from a certain point of view. - Return of the Jedi"
    ];

    getRandomMessage () : string {
        let ceiling = this.messages.length;

        let randomNumber = Math.random() * 100

        let entryNumber = Math.floor( randomNumber % ceiling);

        return this.messages[entryNumber].toLowerCase();
    }

    generateNewMessage () {
        this.unencryptedMessage = this.getRandomMessage();

        let encryptedText = this.selectedMethod().mixCharacters(this.unencryptedMessage)

        console.log(`${this.unencryptedMessage} -> ${encryptedText}`)

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

class RotCipher implements EncryptionMethod {
    name  : string =  "Rotation Cipher"

    createOffset () : number { return Math.floor(Math.random() * (1 - 26) + 1);}

    offset : number =  this.createOffset();

    shift (character : string, offset:number) : string { 

        let charCode = character.charCodeAt(0)
        
        if(character === ' ' || charCode < 97 || charCode > 122  ) {return character;} 

        let  number =  Math.floor((charCode + this.offset) % 26 + 97);

        return String.fromCharCode (number); 
    }

    mixCharacters (message:string) : string {
        this.offset = this.createOffset();
        return message.split('').map((v, _) => this.shift(v, this.offset) ).join('');
    }
}

class SubstitutionCipher implements EncryptionMethod {

    name =  "Substitution Cipher"

    constructor (makeLetters : () => Observable<LetterAndReplacement>[]) {
        this.alphabet = makeLetters ();
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

        let randomizedOrder = SubstitutionCipher.randomizeNumberOrder
            (this.alphabet.length); 

        randomizedOrder.forEach((v, i) => {
           this.alphabet[i]().replacement (this.alphabet[v]().letter);     
        } );

        let getLetterSwitch = (l:string) => {
            let letter = this.alphabet.filter(a => a().letter.toLowerCase() === l)[0];

            return (letter) ? letter().replacement() : l;
        };

        return message.split('').map(getLetterSwitch).join('');
    }


}