'use strict';

const attribute = require('../scene/attribute.js');
const geometry = require('../scene/geometry.js');
const material = require('../scene/material.js');
const mesh = require('../scene/mesh.js');
require('../scene/render-target.js');
const scene = require('../scene/scene.js');
const texture = require('../scene/texture.js');
const teeth = require('./teeth.vert.js');
const teeth$1 = require('./teeth.frag.js');
const lut3d_TEETH_medium = require('./lut3d_TEETH_medium.png.js');

class Teeth {
    constructor() {
        Object.defineProperty(this, "_teeth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new mesh.Mesh(new geometry.FaceGeometry(), new material.ShaderMaterial({
                vertexShader: teeth['default'],
                fragmentShader: teeth$1['default'],
                uniforms: {
                    tex_camera: new texture.Camera(),
                    tex_whitening: new texture.LUT(lut3d_TEETH_medium['default']),
                    var_teeth_whitening_strength: new attribute.Vector4(0),
                },
            }))
        });
        this._teeth.material.uniforms.var_teeth_whitening_strength.subscribe(([strength]) => this._teeth.visible(strength > 0));
        scene.add(this._teeth);
    }
    /** Sets the teeth whitening strength from 0 to 1 */
    whitening(strength) {
        if (typeof strength !== "undefined")
            this._teeth.material.uniforms.var_teeth_whitening_strength.value(strength);
        this._teeth.material.uniforms.var_teeth_whitening_strength.value()[0];
    }
    /** Resets any settings applied */
    clear() {
        this.whitening(0);
    }
}

exports.Teeth = Teeth;
