'use strict';

const attribute = require('../scene/attribute.js');
const geometry = require('../scene/geometry.js');
const material = require('../scene/material.js');
const mesh = require('../scene/mesh.js');
require('../scene/render-target.js');
const scene = require('../scene/scene.js');
const texture = require('../scene/texture.js');
const softening = require('./softening.vert.js');
const softening$1 = require('./softening.frag.js');
const skin = require('./skin.vert.js');
const skin$1 = require('./skin.frag.js');

class Skin {
  __init() {this._skin = new mesh.Mesh(
    new geometry.PlaneGeometry(),
    new material.ShaderMaterial({
      vertexShader: skin['default'],
      fragmentShader: skin$1['default'],
      uniforms: {
        tex_camera: new texture.Camera(),
        tex_mask: new texture.SegmentationMask("SKIN"),

        var_skin_color: new attribute.Vector4(0, 0, 0, 0),
        var_skin_softening_strength: new attribute.Vector4(0),
      },
    }),
  );}
  /**
   * FRX version of skin softening.
   * It's designed to be used as a faster alternative to `skin_nn` softening
   * for the cases not leveraging skin coloration.
   */
  __init2() {this._softening = new mesh.Mesh(
    new geometry.FaceGeometry(),
    new material.ShaderMaterial({
      vertexShader: softening['default'],
      fragmentShader: softening$1['default'],
      uniforms: {
        tex_camera: new texture.Camera(),

        var_skin_softening_strength: this._skin.material.uniforms.var_skin_softening_strength,
      },
    }),
  );}

  constructor() {Skin.prototype.__init.call(this);Skin.prototype.__init2.call(this);
    const onChange = () => {
      const [softening] = this._skin.material.uniforms.var_skin_softening_strength.value();
      const [, , , a] = this._skin.material.uniforms.var_skin_color.value();

      const isSkinColored = a > 0;
      const isSkinSoftened = softening > 0;

      this._skin.visible(isSkinColored);
      this._softening.visible(!isSkinColored && isSkinSoftened);

      if (isSkinColored) this._skin.material.uniforms.tex_mask.enable();
      else this._skin.material.uniforms.tex_mask.disable();
    };

    this._skin.material.uniforms.var_skin_color.subscribe(onChange);
    this._skin.material.uniforms.var_skin_softening_strength.subscribe(onChange);

    scene.add(this._skin, this._softening);
  }

  color(color) {
    if (typeof color !== "undefined") this._skin.material.uniforms.var_skin_color.value(color);
    return this._skin.material.uniforms.var_skin_color.value().join(" ") 
  }

  softening(strength) {
    if (typeof strength !== "undefined")
      this._skin.material.uniforms.var_skin_softening_strength.value(strength);
    return this._skin.material.uniforms.var_skin_softening_strength.value()[0]
  }

  clear() {
    this.color("0 0 0 0");
    this.softening(0);
  }
}

exports.Skin = Skin;
