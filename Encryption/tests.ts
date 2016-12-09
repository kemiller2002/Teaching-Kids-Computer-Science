declare class Assert {
    ok (test:boolean, result : string);    
}


declare class QUnit {
    static test (name:string, assertFn : (assert:Assert) => void) : boolean
}


QUnit.test("Check for alphabet", (assert:Assert) => {
        let model = new Model(); 

        let alphabet = Model.makeAlphabet();

        assert.ok(alphabet[0]().letter === 'a' , "Found a"); 
    }
);


QUnit.test ("Check Shift", (assert:Assert) => {
    let shift = new ShiftCipher(); 

    let unencryptedMessage = "this is a test."

    let message = shift.mixCharacters(unencryptedMessage);

    assert.ok (true , message);
    assert.ok (message.length === unencryptedMessage.length, "Length is the same.")
    assert.ok (message[message.length -1] === '.', "Period not encrypted.")
});

QUnit.test ("check randomize", (assert:Assert) => {
    let length = 26;

    let numbers:number[] = SubstitutionCipher.randomizeNumberOrder(length);

    assert.ok(length === numbers.length, `array length: ${numbers.length}, expected length: ${length}`);
    
});

QUnit.test ("Check letter population, substitution", (assert:Assert) => {

    let substitution = new SubstitutionCipher(Model.makeAlphabet);

    substitution.alphabet.forEach(element => { 
            assert.ok (element.replacement !== '', 
                `letter equals: ${element.letter}  replacement equals: ${element.replacement}`);
    });
       
});