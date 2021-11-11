'use strict';

const attribute = require('../scene/attribute.js');
const geometry = require('../scene/geometry.js');
const material = require('../scene/material.js');
const mesh = require('../scene/mesh.js');
require('../scene/render-target.js');
const scene = require('../scene/scene.js');
const texture = require('../scene/texture.js');
const matt = require('./matt.vert.js');
const matt$1 = require('./matt.frag.js');
const shiny = require('./shiny.vert.js');
const shiny$1 = require('./shiny.frag.js');
const glitter = require('./glitter.png.js');

class Lips {
    __init() {this._shared = {
    tex_camera: new texture.Camera(),
    tex_lips_mask: new texture.SegmentationMask("LIPS"),
    tex_shine_mask: new texture.SegmentationMask("LIPS_SHINING"),

    var_lips_color: new attribute.Vector4(0, 0, 0, 0),
    var_lips_saturation: new attribute.Vector4(1),
    var_lips_brightness: new attribute.Vector4(1),
  };}
    __init2() {this._matt = new mesh.Mesh(
    new geometry.PlaneGeometry(),
    new material.ShaderMaterial({
      vertexShader: matt['default'],
      fragmentShader: matt$1['default'],
      uniforms: {
        tex_camera: this._shared.tex_camera,
        tex_lips_mask: this._shared.tex_lips_mask,

        var_lips_color: this._shared.var_lips_color,
        var_lips_saturation: this._shared.var_lips_saturation,
        var_lips_brightness: this._shared.var_lips_brightness,
      },
    }),
  );}
    __init3() {this._shiny = new mesh.Mesh(
    new geometry.PlaneGeometry(),
    new material.ShaderMaterial({
      vertexShader: shiny['default'],
      fragmentShader: shiny$1['default'],
      uniforms: {
        tex_camera: this._shared.tex_camera,
        tex_lips_mask: this._shared.tex_lips_mask,
        tex_shine_mask: this._shared.tex_shine_mask,
        tex_noise: new texture.Image(glitter['default']),

        var_lips_color: this._shared.var_lips_color,
        var_lips_saturation: this._shared.var_lips_saturation,
        var_lips_brightness: this._shared.var_lips_brightness,
        var_lips_shine_intensity: new attribute.Vector4(0),
        var_lips_shine_bleeding: new attribute.Vector4(0),

        var_lips_shine_scale: new attribute.Vector4(0),
        var_lips_glitter_bleeding: new attribute.Vector4(0),
        var_lips_glitter_intensity: new attribute.Vector4(0),
        var_lips_glitter_grain: new attribute.Vector4(0),
      },
    }),
  );}

  constructor() {Lips.prototype.__init.call(this);Lips.prototype.__init2.call(this);Lips.prototype.__init3.call(this);
    const shinyUniforms = this._shiny.material.uniforms;
    const shinyAttributes = [
      shinyUniforms.var_lips_shine_scale,
      shinyUniforms.var_lips_shine_intensity,
      shinyUniforms.var_lips_shine_bleeding,
      shinyUniforms.var_lips_glitter_bleeding,
      shinyUniforms.var_lips_glitter_intensity,
      shinyUniforms.var_lips_glitter_grain,
    ];

    const onChange = () => {
      const [, , , a] = this._shared.var_lips_color.value();
      const isColored = a > 0;

      if (!isColored) {
        this._matt.visible(false);
        this._shiny.visible(false);
        this._matt.material.uniforms.tex_lips_mask.disable();
        this._shiny.material.uniforms.tex_shine_mask.disable();
        return
      }

      this._matt.material.uniforms.tex_lips_mask.enable();

      const isShineEnabled = shinyAttributes.some((attribute) => attribute.value()[0] !== 0);

      if (isShineEnabled) {
        this._matt.visible(false);

        this._shiny.material.uniforms.tex_shine_mask.enable();
        this._shiny.visible(true);
      } else {
        this._shiny.visible(false);
        this._shiny.material.uniforms.tex_shine_mask.disable();

        this._matt.visible(true);
      }
    };

    this._shared.var_lips_color.subscribe(onChange);
    shinyAttributes.forEach((attribute) => attribute.subscribe(onChange));

    scene.add(this._matt, this._shiny);
  }

  /**
   * Sets matt lips color
   * This is a helper method and equivalent of
   * ```js
   * Lips
   *  .color(rgba)
   *  .saturation(1)
   *  .shineIntensity(0)
   *  .shineBleeding(0)
   *  .shineScale(0)
   *  .glitterIntensity(0)
   *  .glitterBleeding(0)
   * ```
   */
  matt(color) {
    if (typeof color !== "undefined") {
      this.color(color);
      this.saturation(1);
      this.brightness(1);
      this.shineIntensity(0);
      this.shineBleeding(0);
      this.shineScale(0);
      this.glitterIntensity(0);
      this.glitterBleeding(0);
    }
    return this.color()
  }

  /**
   * Sets shiny lips color
   * This is a helper method and equivalent of
   * ```js
   * Lips
   *  .color(rgba)
   *  .saturation(1.5)
   *  .shineIntensity(1)
   *  .shineBleeding(0.5)
   *  .shineScale(1)
   *  .glitterIntensity(0)
   *  .glitterBleeding(0)
   * ```
   */
  shiny(color) {
    if (typeof color !== "undefined") {
      this.color(color);
      this.saturation(1.5);
      this.brightness(1);
      this.shineIntensity(1);
      this.shineBleeding(0.5);
      this.shineScale(1);
      this.glitterIntensity(0);
      this.glitterBleeding(0);
    }
    return this.color()
  }

  /**
   * Sets glitter lips color
   * This is a helper method and equivalent of
   * ```js
   * Lips
   *  .color(rgba)
   *  .saturation(1)
   *  .shineIntensity(0.9)
   *  .shineBleeding(0.6)
   *  .shineScale(1)
   *  .glitterGrain(0.4)
   *  .glitterIntensity(1)
   *  .glitterBleeding(1)
   * ```
   */
  glitter(color) {
    if (typeof color !== "undefined") {
      this.color(color);
      this.saturation(1);
      this.brightness(1);
      this.shineIntensity(0.9);
      this.shineBleeding(0.6);
      this.shineScale(1);
      this.glitterGrain(0.4);
      this.glitterIntensity(1);
      this.glitterBleeding(1);
    }
    return this.color()
  }

  /** Sets the lips color */
  color(color) {
    if (typeof color !== "undefined") {
      this._shared.var_lips_color.value(color);
    }
    return this._shared.var_lips_color.value().join(" ") 
  }

  /** Sets the lips color saturation */
  saturation(value) {
    this._shared.var_lips_saturation.value(value);
  }

  /** Sets the lips color brightness */
  brightness(value) {
    this._shared.var_lips_brightness.value(value);
  }

  /** Sets the lips shine intensity */
  shineIntensity(value) {
    this._shiny.material.uniforms.var_lips_shine_intensity.value(value);
  }

  /** Sets the lips shine bleeding */
  shineBleeding(value) {
    this._shiny.material.uniforms.var_lips_shine_bleeding.value(value);
  }

  shineScale(value) {
    this._shiny.material.uniforms.var_lips_shine_scale.value(value);
  }

  glitterGrain(value) {
    this._shiny.material.uniforms.var_lips_glitter_grain.value(value);
  }

  glitterIntensity(value) {
    this._shiny.material.uniforms.var_lips_glitter_intensity.value(value);
  }

  glitterBleeding(value) {
    this._shiny.material.uniforms.var_lips_glitter_bleeding.value(value);
  }

  /** Removes the lips color, resets any setting applied */
  clear() {
    this.color("0 0 0 0");
    this.saturation(1);
    this.brightness(1);
    this.shineIntensity(0);
    this.shineBleeding(0);
    this.shineScale(0);
    this.glitterGrain(0);
    this.glitterIntensity(0);
    this.glitterBleeding(0);
  }
}

exports.Lips = Lips;
