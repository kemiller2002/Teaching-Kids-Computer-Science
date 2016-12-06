
class EncryptionMethod {
    name:string;
}



class Model {

    constructor () {}

    alphabet:string[] = this.makeAlphabet () ; 

    encptionMethods : any

    makeAlphabet () : string[] {
        return (null, Array[26].map((_,i) => i )).map((i, _) => String.fromCharCode(90+i));
    }



}