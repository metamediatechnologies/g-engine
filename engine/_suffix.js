
  if( typeof window !== "undefined") {
    window._g = _g;
  }

})(window);


Number.prototype.map = function (istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((this - istart) / (istop - istart));
};
Number.prototype.limit = function (min, max) {
    return Math.min(max, Math.max(min, this));
};
Number.prototype.round = function (precision) {
    precision = Math.pow(10, precision || 0);
    return Math.round(this * precision) / precision;
};
Number.prototype.floor = function () {
    return Math.floor(this);
};
Number.prototype.ceil = function () {
    return Math.ceil(this);
};
Number.prototype.toInt = function () {
    return (this | 0);
};
Array.prototype.erase = function (item) {
    for (var i = this.length; i--; i) {
        if (this[i] === item) this.splice(i, 1);
    }
    return this;
};
Array.prototype.random = function () {
    return this[(Math.random() * this.length).floor()];
};
Function.prototype.bind = function (bind) {
    var self = this;
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return self.apply(bind || null, args);
    };
};
