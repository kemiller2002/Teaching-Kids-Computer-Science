declare class Assert {
    ok (test:boolean, result : string);    
}


declare class QUnit {
    static test (name:string, assertFn : (assert:Assert) => void) : boolean
}


QUnit.test("example", (assert:Assert)=> assert.ok(true, "YAY!") );