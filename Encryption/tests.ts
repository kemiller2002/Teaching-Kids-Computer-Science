declare class Assert {
    ok (test:boolean, result : string);    
}


declare class QUnit {
    static test (name:string, assertFn : (assert:Assert) => void) : boolean
}


QUnit.test("Check for alphabet", (assert:Assert) => {
        let model = new Model(); 

        let alphabet = model.makeAlphabet();

        assert.ok(alphabet[0].letter === 'a' , "Found a"); 
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
    let numbers:number[] = [];
    let length = 26;

    SubstitutionCipher.randomizeNumberOrder(length, numbers)

    assert.ok(length === numbers.length, "array is appropriate length");

});