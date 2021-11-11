'use strict';

const utils = require('./utils.js');

class Attribute {
   __init() {this._emitter = utils.createNanoEvents();}
  

  constructor(value) {Attribute.prototype.__init.call(this);
    this._value = value;
  }

  value(value) {
    if (typeof value !== "undefined") {
      this._value = value;
      this._emitter.emit("value", this._value);
    }

    return this._value
  }

  subscribe(listener) {
    const unsubscribe = this._emitter.on("value", listener);

    listener(this._value);

    return unsubscribe
  }
}



class Vector4 extends Attribute {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    super([x, y, z, w]);
  }

  /** @returns the Vector4 value as array */
  




  value(x, y = 0, z = 0, w = 1) {
    if (typeof x === "undefined") return super.value()
    if (typeof x === "string")
      return this.value(...(x.split(" ").map((x) => Number(x)) ))

    return super.value([Number(x), Number(y), Number(z), Number(w)])
  }
}

exports.Attribute = Attribute;
exports.Vector4 = Vector4;
