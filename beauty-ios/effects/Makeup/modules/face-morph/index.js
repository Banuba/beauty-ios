'use strict';

require('../scene/utils.js');
const geometry = require('../scene/geometry.js');
require('../scene/material.js');
const mesh = require('../scene/mesh.js');
require('../scene/render-target.js');
const scene = require('../scene/scene.js');
require('../scene/texture.js');

class FaceMorph {
    constructor() {
        Object.defineProperty(this, "_face", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new mesh.Mesh(new geometry.FaceGeometry(), [])
        });
        Object.defineProperty(this, "_beauty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._face.geometry.addMorphing("$builtin$meshes/beauty")
        });
        scene.add(this._face);
    }
    /** Sets eyes grow strength from 0 to 1 */
    eyes(weight) {
        return this._beauty.weight("eyes", 2 * weight);
    }
    /** Sets nose shrink strength from 0 to 1 */
    nose(weight) {
        return this._beauty.weight("nose", weight);
    }
    /** Sets face (cheeks) shrink strength from 0 to 1 */
    face(weight) {
        return this._beauty.weight("face", weight);
    }
    /** Resets all morphs */
    clear() {
        this.eyes(0);
        this.nose(0);
        this.face(0);
    }
}

exports.FaceMorph = FaceMorph;
