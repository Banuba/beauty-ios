'use strict';

const attribute = require('../scene/attribute.js');
const geometry = require('../scene/geometry.js');
const material = require('../scene/material.js');
const mesh = require('../scene/mesh.js');
require('../scene/render-target.js');
const scene = require('../scene/scene.js');
const texture = require('../scene/texture.js');
const whitening = require('./whitening.vert.js');
const whitening$1 = require('./whitening.frag.js');
const color = require('./color.vert.js');
const color$1 = require('./color.frag.js');
const flare = require('./flare.vert.js');
const flare$1 = require('./flare.frag.js');
const FLARE_38_512 = require('./FLARE_38_512.png.js');
const lut3d_eyes_high = require('./lut3d_eyes_high.png.js');

class Eyes {
    __init() {this._whitening = new mesh.Mesh(
    new geometry.FaceGeometry(),
    new material.ShaderMaterial({
      vertexShader: whitening['default'],
      fragmentShader: whitening$1['default'],
      uniforms: {
        tex_camera: new texture.Camera(),
        tex_whitening: new texture.LUT(lut3d_eyes_high['default']),

        var_eyes_whitening_strength: new attribute.Vector4(0),
      },
    }),
  );}
    __init2() {this._color = new mesh.Mesh(
    new geometry.PlaneGeometry(),
    new material.ShaderMaterial({
      vertexShader: color['default'],
      fragmentShader: color$1['default'],
      uniforms: {
        tex_camera: new texture.Camera(),
        tex_l_eye_mask: new texture.SegmentationMask("L_EYE"),
        tex_r_eye_mask: new texture.SegmentationMask("R_EYE"),

        var_eyes_color: new attribute.Vector4(0, 0, 0, 0),
      },
    }),
  );}
    __init3() {this._flare = new mesh.Mesh(
    new geometry.FaceGeometry(),
    new material.ShaderMaterial({
      vertexShader: flare['default'],
      fragmentShader: flare$1['default'],
      uniforms: {
        tex_camera: new texture.Camera(),
        tex_flare: new texture.Image(FLARE_38_512['default']),

        var_eyes_flare_strength: new attribute.Vector4(0),
      },
    }),
  );}

  constructor() {Eyes.prototype.__init.call(this);Eyes.prototype.__init2.call(this);Eyes.prototype.__init3.call(this);
    const onChange = () => {
      const [whitening] = this._whitening.material.uniforms.var_eyes_whitening_strength.value();
      const [flare] = this._flare.material.uniforms.var_eyes_flare_strength.value();
      const [, , , a] = this._color.material.uniforms.var_eyes_color.value();

      if (a > 0) {
        this._color.material.uniforms.tex_l_eye_mask.enable();
        this._color.material.uniforms.tex_r_eye_mask.enable();
      } else {
        this._color.material.uniforms.tex_l_eye_mask.disable();
        this._color.material.uniforms.tex_r_eye_mask.disable();
      }

      this._whitening.visible(whitening > 0);
      this._color.visible(a > 0);
      this._flare.visible(flare > 0);
    };

    this._whitening.material.uniforms.var_eyes_whitening_strength.subscribe(onChange);
    this._color.material.uniforms.var_eyes_color.subscribe(onChange);
    this._flare.material.uniforms.var_eyes_flare_strength.subscribe(onChange);

    scene.add(this._whitening, this._flare, this._color);
  }

  /** Sets the eyes sclera whitening strength from 0 to 1 */
  whitening(strength) {
    if (typeof strength !== "undefined")
      this._whitening.material.uniforms.var_eyes_whitening_strength.value(strength);
    return this._whitening.material.uniforms.var_eyes_whitening_strength.value()[0]
  }

  /** Sets the eyes color */
  color(color) {
    if (typeof color !== "undefined") this._color.material.uniforms.var_eyes_color.value(color);
    return this._color.material.uniforms.var_eyes_color.value().join(" ") 
  }

  /** Sets the eyes flare strength from 0 to 1 */
  flare(strength) {
    if (typeof strength !== "undefined")
      this._flare.material.uniforms.var_eyes_flare_strength.value(strength);
    return this._flare.material.uniforms.var_eyes_flare_strength.value()[0]
  }

  /** Removes the eyes color, resets any settings applied */
  clear() {
    this.whitening(0);
    this.color("0 0 0 0");
    this.flare(0);
  }
}

exports.Eyes = Eyes;
