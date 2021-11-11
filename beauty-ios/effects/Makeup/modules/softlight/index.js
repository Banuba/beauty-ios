'use strict';

const attribute = require('../scene/attribute.js');
const geometry = require('../scene/geometry.js');
const material = require('../scene/material.js');
const mesh = require('../scene/mesh.js');
require('../scene/render-target.js');
const scene = require('../scene/scene.js');
const texture = require('../scene/texture.js');
const soflight = require('./soflight.vert.js');
const soflight$1 = require('./soflight.frag.js');
const soft = require('./soft.ktx.js');

class Softlight {
    __init() {this._softlight = new mesh.Mesh(
    new geometry.FaceGeometry(),
    new material.ShaderMaterial({
      vertexShader: soflight['default'],
      fragmentShader: soflight$1['default'],
      uniforms: {
        tex_camera: new scene.Scene(),
        tex_softlight: new texture.Image(soft['default']),

        var_softlight_strength: new attribute.Vector4(0),
      },
    }),
  );}

  constructor() {Softlight.prototype.__init.call(this);
    this._softlight.material.uniforms.var_softlight_strength.subscribe(([strength]) =>
      this._softlight.visible(strength > 0),
    );

    scene.add(this._softlight);
  }

  /** Sets the softlight strength from 0 to 1 */
  strength(strength) {
    if (typeof strength !== "undefined")
      this._softlight.material.uniforms.var_softlight_strength.value(strength);
    return this._softlight.material.uniforms.var_softlight_strength.value()[0]
  }

  /** Removes the softlight */
  clear() {
    this.strength(0);
  }
}

exports.Softlight = Softlight;
