'use strict';

const utils = require('./utils.js');

class Attribute {
    constructor(value) {
        Object.defineProperty(this, "_emitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: utils.createNanoEvents()
        });
        Object.defineProperty(this, "_value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._value = value;
    }
    value(value) {
        if (typeof value !== "undefined") {
            this._value = value;
            this._emitter.emit("value", this._value);
        }
        return this._value;
    }
    subscribe(listener) {
        const unsubscribe = this._emitter.on("value", listener);
        listener(this._value);
        return unsubscribe;
    }
}
class Vector4 extends Attribute {
    constructor(x = 0, y = 0, z = 0, w = 1) {
        super([x, y, z, w]);
    }
    value(x, y = 0, z = 0, w = 1) {
        if (typeof x === "undefined")
            return super.value();
        if (typeof x === "string")
            return this.value(...x.split(" ").map((x) => Number(x)));
        return super.value([Number(x), Number(y), Number(z), Number(w)]);
    }
}

exports.Attribute = Attribute;
exports.Vector4 = Vector4;
