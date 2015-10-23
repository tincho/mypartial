var __ = { 
  notEqual: function(a, b) {
    return a !== b;
  },
  partial: function() {
    var args = Array.prototype.slice.call(arguments); // hack para "castear" arguments como Array
    var method = args.shift(); // Array.shift ... you know
    var self = this; // guardo el "this" de este contexto en una variable de este scope
  
    var placeHolderPos = [];
    args.forEach(function(arg, i) {
      arg === self && placeHolderPos.push(i);
    });
    // remove placeholders!
    args = args.filter(self.notEqual.bind(undefined, self));
    return function() { // function dentro de function?! ver "scopes" de javascript
      var thisArguments = Array.prototype.slice.call(arguments);
      placeHolderPos.forEach(function(pos) {
        var arg = thisArguments.shift();
        args.splice(pos, 0, arg);
      });
      var applyArguments = args.concat(thisArguments);
      return method.apply(undefined, applyArguments);
    }
  }
};

describe('partial application', function() {
  it('partial one value', function() {
    var sum = function(x,y) { return x+y };
    var sum1 = __.partial(sum, 1);
    assert.equal(sum1(2), 3);
    
    // de todas formas, esto mismo se puede hacer con metodos nativos de JS :
    var anotherSum1 = sum.bind(undefined, 1);
    assert.equal( anotherSum1(2), 3);
  });

  it('partial several values', function() {
    var concat = function() {
      var args = Array.prototype.slice.call(arguments);
      return args.join(" ");
    };
    var testConcat = concat("hola", "que", "tal", "como", "te", "va");
    assert.equal(testConcat,  "hola que tal como te va");

    var simonSays = __.partial(concat, "Simon", "says");
    assert.equal(simonSays("whatever", "my", "friend"), "Simon says whatever my friend");
  });
  
  it('partial with single placeholder', function() {
     var whoSays = function(who, says, does) {
        return who + " says: <" + says + "> and does: <"+ does +">";
     }
     var sayHelloAndNoop = __.partial(whoSays, __, "hello");
     assert.equal(sayHelloAndNoop("Pepito", "nothing"), "Pepito says: <hello> and does: <nothing>")
  }); 

  it('partial with placeholders', function() {
     var whoSays = function(who, says, does, doesnt) {
        return who + " says: <" + says + "> and does: <" + does + "> and doesnt: <" + doesnt + ">";
     }

     var sayHelloAndDo = __.partial(whoSays, __, "hello", __, "lie");
     assert.equal(sayHelloAndDo("Pepito", "that"), "Pepito says: <hello> and does: <that> and doesnt: <lie>")
  });

  
});
