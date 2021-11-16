'use strict';

const geometry = require('./geometry.js');
const mesh = require('./mesh.js');
const renderTarget = require('./render-target.js');

class Pass {
    constructor(material, geometry$1, options) {
        Object.defineProperty(this, "_target", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (!geometry.isGeometry(geometry$1)) {
            options = geometry$1 !== null && geometry$1 !== void 0 ? geometry$1 : {};
            geometry$1 = new geometry.PlaneGeometry();
        }
        this._target = new renderTarget.RenderTarget({ offscreen: true, ...options });
        this._target.add(new mesh.Mesh(geometry$1, material));
    }
    get $$() {
        return this._target.texture.$$;
    }
}

exports.Pass = Pass;
