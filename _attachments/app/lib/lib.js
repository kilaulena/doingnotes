function byText(a, b) {
  var x = a.text.toLowerCase();
  var y = b.text.toLowerCase();
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

function byDate(a, b) {
  var x = a.created_at;
  var y = b.created_at;
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

function slugize(string) {
  return string.toLowerCase().replace(/\s/g, "-");
}

function stripBlanks(string) {
  return (string.replace(/^ +/,'')).replace(/ +$/,'');
}

Array.prototype.remove = function(obj) {
  var a = [];
  for (var i=0; i<this.length; i++) {
    if (this[i] != obj) {
      a.push(this[i]);
    }
  }
  return a;
}

Array.prototype.flatten = function() {
  return this.reduce(function(res, el) {
    if(el.constructor == Array) {
      el.forEach(function(sub_el) {
        res.push(sub_el);
      })
    } else {
      res.push(el);
    }
    return res;
  }, []);
}

Array.prototype.reject = function(fun) {
  return this.reduce(function(res, el) {
    if(!fun(el)) {
      res.push(el);
    };
    return res;
  }, []);
}

Array.prototype.select = function(fun) {
  return this.reduce(function(res, el) {
    if(fun(el)) {
      res.push(el);
    };
    return res;
  }, []);
}


Array.prototype.compact = function() {
  return this.reduce(function(res, el) {
    if(el !== null) {
      res.push(el);
    };
    return res;
  }, [])
}

String.prototype.reverse = function() {
  var reversed = [];
  for(var i = 0; i < this.length; i++) {
    reversed[this.length - i - 1] = this[i];
  }
  return reversed.join('');
}