var LetterAndReplacement = (function () {
    function LetterAndReplacement(letter) {
        var _this = this;
        this.letter = letter;
        this.replacement = ko.observable("");
        this.replacedLetterValue = ko.computed(function () {
            return (_this.replacement() === "" || !_this.replacement()) ?
                _this.letter : _this.replacement();
        }, this);
    }
    return LetterAndReplacement;
}());
var Model = (function () {
    function Model() {
        this.alphabet = Model.makeAlphabet();
        this.encryptionMethods = [
            new PlainText(), new RotCipher(), new SubstitutionCipher(Model.makeAlphabet)
        ];
        this.selectedMethod = ko.observable(this.encryptionMethods[0]);
        this.encryptedMessage = ko.observableArray();
        this.messages = [
            "Never trust anything that can think for itself if you can’t see where it keeps its brain. ― Harry Potter and the Chamber of Secrets",
            "You sort of start thinking anything’s possible if you’ve got enough nerve. ― Harry Potter and the Half-Blood Prince",
            "It takes a great deal of bravery to stand up to our enemies, but just as much to stand up to our friends. – Harry Potter and the Philosopher’s Stone",
            "It’s no use going back to yesterday, because I was a different person then. - Alice in Wonderland",
            "Why, sometimes I've believed as many as six impossible things before breakfast. Alice in Wonderland",
            "Never, never, never give up. - Winston Churchhill",
            "It's the job that's never started as takes longest to finish. - Lord of the Rings",
            "Do. Or do not. There is no try. - The Empire Stikes Back",
            "Never tell me the odds - The Empire Strikes Back.",
            "Your father... was seduced by the Dark Side of the Force. He ceased to be the Jedi Anakin Skywalker and became Darth Vader. When that happened, the good man who was your father was destroyed. So, what I told you was true... from a certain point of view. - Return of the Jedi"
        ];
    }
    Model.prototype.getRandomMessage = function () {
        var ceiling = this.messages.length;
        var randomNumber = Math.random() * 100;
        var entryNumber = Math.floor(randomNumber % ceiling);
        return this.messages[entryNumber].toLowerCase();
    };
    Model.prototype.generateNewMessage = function () {
        var _this = this;
        this.unencryptedMessage = this.getRandomMessage();
        var encryptedText = this.selectedMethod().mixCharacters(this.unencryptedMessage);
        console.log(this.unencryptedMessage + " -> " + encryptedText);
        var encryptedMessage = encryptedText.split('').
            map(function (l) { return _this.getLetterAndReplacementByLetter(l); });
        while (this.encryptedMessage.pop() !== undefined) { }
        encryptedMessage.forEach(function (l) { return _this.encryptedMessage.push(l); });
    };
    Model.makeAlphabet = function () {
        return "abcdefghijklmnopqrstuvwxyz".
            split('').
            map(function (l, _) { return (ko.observable(new LetterAndReplacement(l))); });
    };
    Model.prototype.getLetterAndReplacementByLetter = function (letter) {
        return this.alphabet.filter(function (x) { return x().letter.toLowerCase() === letter.toLowerCase(); })[0]
            || ko.observable(new LetterAndReplacement(letter));
    };
    return Model;
}());
var PlainText = (function () {
    function PlainText() {
        this.name = "Plain Text";
    }
    PlainText.prototype.mixCharacters = function (message) { return message; };
    return PlainText;
}());
var RotCipher = (function () {
    function RotCipher() {
        this.name = "Rotation Cipher";
        this.offset = this.createOffset();
    }
    RotCipher.prototype.createOffset = function () { return Math.floor(Math.random() * (1 - 26) + 1); };
    RotCipher.prototype.shift = function (character, offset) {
        var charCode = character.charCodeAt(0);
        if (character === ' ' || charCode < 97 || charCode > 122) {
            return character;
        }
        var number = Math.floor((charCode + this.offset) % 26 + 97);
        return String.fromCharCode(number);
    };
    RotCipher.prototype.mixCharacters = function (message) {
        var _this = this;
        this.offset = this.createOffset();
        return message.split('').map(function (v, _) { return _this.shift(v, _this.offset); }).join('');
    };
    return RotCipher;
}());
var SubstitutionCipher = (function () {
    function SubstitutionCipher(makeLetters) {
        this.name = "Substitution Cipher";
        this.alphabet = makeLetters();
    }
    SubstitutionCipher.randomizeNumberOrder = function (maxLength) {
        var arrayLength = maxLength;
        var numbersArray = [];
        while (arrayLength > 0) {
            var newNumber = Math.floor(Math.random() * (maxLength - 0) + 0);
            if (numbersArray.indexOf(newNumber) === -1) {
                numbersArray.push(newNumber);
                arrayLength--;
            }
        }
        return numbersArray;
    };
    SubstitutionCipher.prototype.mixCharacters = function (message) {
        var _this = this;
        var randomizedOrder = SubstitutionCipher.randomizeNumberOrder(this.alphabet.length);
        randomizedOrder.forEach(function (v, i) {
            _this.alphabet[i]().replacement(_this.alphabet[v]().letter);
        });
        var getLetterSwitch = function (l) {
            var letter = _this.alphabet.filter(function (a) { return a().letter.toLowerCase() === l; })[0];
            return (letter) ? letter().replacement() : l;
        };
        return message.split('').map(getLetterSwitch).join('');
    };
    return SubstitutionCipher;
}());
//# sourceMappingURL=Model.js.map