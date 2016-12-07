declare class Assert {
    ok (test:boolean, result : string);    
}


declare class QUnit {
    static test (name:string, assertFn : (assert:Assert) => void) : boolean
}


QUnit.test("Check for alphabet", (assert:Assert) => {
        let model = new Model(); 

        let alphabet = model.makeAlphabet();

        assert.ok(alphabet[0] === 'a' , "Found a"); 
    }
);