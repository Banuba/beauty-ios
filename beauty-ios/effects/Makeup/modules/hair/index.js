'use strict';

const attribute = require('../scene/attribute.js');
const geometry = require('../scene/geometry.js');
const material = require('../scene/material.js');
const mesh = require('../scene/mesh.js');
require('../scene/render-target.js');
const scene = require('../scene/scene.js');
const texture = require('../scene/texture.js');
const hair = require('./hair.vert.js');
const hair$1 = require('./hair.frag.js');
const index$1 = require('./avg-color/index.js');
const index = require('./gradient/index.js');

function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }
exports.ColoringMode = void 0; (function (ColoringMode) {
  /* 0 */ const SolidColor = 0; ColoringMode[ColoringMode["SolidColor"] = SolidColor] = "SolidColor";
  /* 1 */ const Gradient = SolidColor + 1; ColoringMode[ColoringMode["Gradient"] = Gradient] = "Gradient";
  /* 2 */ const Strands = Gradient + 1; ColoringMode[ColoringMode["Strands"] = Strands] = "Strands";
})(exports.ColoringMode || (exports.ColoringMode = {}));








class Hair {
    __init() {this._hair = new mesh.Mesh(
    new geometry.PlaneGeometry(),
    new material.ShaderMaterial({
      vertexShader: hair['default'],
      fragmentShader: hair$1['default'],
      uniforms: {
        tex_camera: new texture.Camera(),
        tex_hair_mask: new texture.SegmentationMask("HAIR"),
        tex_gradient_mask: index.Gradient(),
        tex_strands_mask: new texture.SegmentationMask("HAIR_STRAND"),
        tex_avg_color: index$1.AvgColor(new texture.Camera(), new texture.SegmentationMask("HAIR")),

        var_hair_color0: new attribute.Vector4(0, 0, 0, 0),
        var_hair_color1: new attribute.Vector4(0, 0, 0, 0),
        var_hair_color2: new attribute.Vector4(0, 0, 0, 0),
        var_hair_color3: new attribute.Vector4(0, 0, 0, 0),
        var_hair_color4: new attribute.Vector4(0, 0, 0, 0),

        var_hair_colors_count: new attribute.Vector4(0),

        var_hair_coloring_mode: new attribute.Vector4(exports.ColoringMode.SolidColor),
      },
    }),
  );}

  constructor() {Hair.prototype.__init.call(this);
    const onChange = () => {
      const [mode] = this._hair.material.uniforms.var_hair_coloring_mode.value();

      let isColored = [
        this._hair.material.uniforms.var_hair_color0.value(),
        this._hair.material.uniforms.var_hair_color1.value(),
        this._hair.material.uniforms.var_hair_color2.value(),
        this._hair.material.uniforms.var_hair_color3.value(),
        this._hair.material.uniforms.var_hair_color4.value(),
      ].some(([, , , a]) => a > 0);

      if (mode === exports.ColoringMode.Strands) {
        this._hair.material.uniforms.tex_hair_mask.disable();
        this._hair.material.uniforms.tex_strands_mask.enable();
      } else {
        this._hair.material.uniforms.tex_strands_mask.disable();
        this._hair.material.uniforms.tex_hair_mask.enable();
      }

      this._hair.visible(isColored);
    };

    this._hair.material.uniforms.var_hair_color0.subscribe(onChange);
    this._hair.material.uniforms.var_hair_color1.subscribe(onChange);
    this._hair.material.uniforms.var_hair_color2.subscribe(onChange);
    this._hair.material.uniforms.var_hair_color3.subscribe(onChange);
    this._hair.material.uniforms.var_hair_color4.subscribe(onChange);

    scene.add(this._hair);
  }

  

  color(first, ...rest) {
    if (Array.isArray(first)) return this.color(...first)

    const colors = [first, ...rest];

    this._hair.material.uniforms.var_hair_colors_count.value(colors.length);
    this._hair.material.uniforms.var_hair_coloring_mode.value(
      colors.length === 1 ? exports.ColoringMode.SolidColor : exports.ColoringMode.Gradient,
    );

    for (let i = 0; i < 5; ++i) {
      const color = _nullishCoalesce(colors[i], () => ( "0 0 0 0"));

      const idx = i; 
      const uniform = `var_hair_color${idx}`; 

      this._hair.material.uniforms[uniform].value(color);
    }
  }

  

  strands(first, ...rest) {
    if (Array.isArray(first)) return this.strands(...first)

    const colors = [first, ...rest];

    this._hair.material.uniforms.var_hair_colors_count.value(5);
    this._hair.material.uniforms.var_hair_coloring_mode.value(exports.ColoringMode.Strands);

    for (let i = 0; i < 5; ++i) {
      const color = _nullishCoalesce(colors[i], () => ( "0 0 0 0"));

      const idx = i; 
      const uniform = `var_hair_color${idx}`; 

      this._hair.material.uniforms[uniform].value(color);
    }
  }

  clear() {
    this.strands("0 0 0 0");
    this.color("0 0 0 0");
  }
}

exports.Hair = Hair;
