(function (exports) {
  'use strict';

  /**
   * Object.keys {@link https://ponyfoo.com/articles/polyfills-or-ponyfills | ponyfill}
   * @external
   */
  var keys = function (collection) {
      var keys = [];
      for (var key in collection)
          keys.push(key);
      return keys;
  };
  /** High level object API over low level {@link Api.setRecognizerFeatures | Recognizer} API */
  var Recognizer = /*@__PURE__*/ (function () {
      function Recognizer() {
          /** Hash map of enabled features */
          this._enabled = {};
      }
      /** Enables Recognizer feature */
      Recognizer.prototype.enable = function (feature) {
          if (feature in this._enabled)
              return this;
          this._enabled[feature] = true;
          Api.setRecognizerFeatures(keys(this._enabled));
          return this;
      };
      /** Disables Recognizer feature */
      Recognizer.prototype.disable = function (feature) {
          if (!(feature in this._enabled))
              return this;
          Api.setRecognizerFeatures(keys(this._enabled));
          delete this._enabled[feature];
          return this;
      };
      return Recognizer;
  }());
  /** Global Recognizer instance */
  var recognizer = /*@__PURE__*/ new Recognizer();

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  function __decorate(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
  }

  /**
   * Classic Nodejs {@link https://medium.com/developers-arena/nodejs-event-emitters-for-beginners-and-for-experts-591e3368fdd2 | Event emitter}
   * @external
   */
  var EventEmitter = /*@__PURE__*/ (function () {
      function EventEmitter() {
          this.__listeners = {};
      }
      /** Adds the listener to the event */
      EventEmitter.prototype.on = function (event, listener) {
          var _a;
          var _b;
          ((_a = (_b = this.__listeners)[event]) !== null && _a !== void 0 ? _a : (_b[event] = [])).push(listener);
          return this;
      };
      /** Removes the listener from the event */
      EventEmitter.prototype.off = function (event, listener) {
          var _a, _b, _c;
          var idx = (_b = (_a = this.__listeners[event]) === null || _a === void 0 ? void 0 : _a.indexOf(listener)) !== null && _b !== void 0 ? _b : -1;
          if (idx !== -1)
              (_c = this.__listeners[event]) === null || _c === void 0 ? void 0 : _c.splice(idx, 1);
          return this;
      };
      /** Invokes the event listeners */
      EventEmitter.prototype.emit = function (event) {
          var _a;
          (_a = this.__listeners[event]) === null || _a === void 0 ? void 0 : _a.forEach(function (listener) { return listener(); });
          return this;
      };
      return EventEmitter;
  }());

  /** Object API for face presence detection */
  var FaceTracker = /*@__PURE__*/ (function (_super) {
      __extends(FaceTracker, _super);
      function FaceTracker() {
          // Backward compatibility
          // will be removed when `scene` is released
          var _this = _super !== null && _super.apply(this, arguments) || this;
          /**
           * Emits "face" event
           *
           * Designed to be used in conjunction with {@link Effect.faceActions} (see example)
           * @deprecated
           * This is a backward-compatibility and is considered for removal in favor of Recognizer from Scene API
           * @example
           * ```ts
           * // config.ts
           *
           * configure({
           *  // ...
           *  faceActions: [FaceTracker.emitFaceDetected],
           *  // ...
           * })
           * ```
           */
          _this.emitFaceDetected = function () { return _this.emit("face"); };
          /**
           * Emits "no-face" event
           *
           * Designed to be used in conjunction with {@link Effect.noFaceActions} (see example)
           * @deprecated
           * This is a backward-compatibility and is considered for removal in favor of Recognizer from Scene API
           * @example
           * ```ts
           * // config.ts
           *
           * configure({
           *  // ...
           *  noFaceActions: [FaceTracker.emitNoFaceDetected],
           *  // ...
           * })
           * ```
           */
          _this.emitNoFaceDetected = function () { return _this.emit("no-face"); };
          return _this;
      }
      return FaceTracker;
  }(EventEmitter));
  /** Global FaceTracker instance */
  var faceTracker = /*@__PURE__*/ new FaceTracker();

  /** High level object API over low level {@link Api.meshfxMsg | Api.meshfxMsg("wlut")} */
  var Lut = /*@__PURE__*/ (function () {
      /**
       * @param index - the index of `glfx_WLUT{0,1,2,3}` defined in shaders
       *
       * e.g.
       * `0` for `glfx_WLUT0`, `1` for `glfx_WLUT1`, etc
       * @param file - filepath of LUT file to use
       * @example
       * ```ts
       * new Lut(mesh, 0, "lut3d_barbie.png")
       * ```
       */
      function Lut(mesh, index, file) {
          var _this = this;
          this._strength = 0;
          /** Used to auto-reload the LUT on mesh enable */
          this._reload = function () {
              if (!_this._file)
                  return;
              Api.meshfxMsg("wlut", _this._index, _this._strength, _this._file);
          };
          this._index = index;
          this._file = file;
          if (mesh["_isEnabled"])
              this._reload();
          mesh.on("enabled", this._reload);
      }
      /** Sets the file as LUT file */
      Lut.prototype.set = function (file) {
          this._file = file;
          Api.meshfxMsg("wlut", this._index, this._strength, this._file);
          return this;
      };
      /** Sets LUT strength from 0 to 1 */
      Lut.prototype.strength = function (value) {
          this._strength = value;
          if (this._file != null) {
              Api.meshfxMsg("wlut", this._index, this._strength * 100, this._file); // 100 - stands for mapping: [0, 1] -> [0, 100]
          }
          return this;
      };
      return Lut;
  }());

  /**
   * Auto-increment {@link Mesh._id} generator
   * @private
   */
  var id = (function () {
      var i = 0;
      return function () { return i++; };
  })();
  /** High level object API over low level {@link Api.meshfxMsg | Api.meshfxMsg("spawn")} */
  var Mesh = /*@__PURE__*/ (function (_super) {
      __extends(Mesh, _super);
      /**
       * @param file - filepath of .bsm2 model to be used of special `"!glfx_FACE"` keyword (see {@link https://docs.banuba.com/docs/effect_constructor/reference/config_js#spawn | the link} for details)
       */
      function Mesh(file) {
          var _this = _super.call(this) || this;
          _this._id = id();
          _this._isEnabled = false;
          _this._file = file;
          return _this;
      }
      /** Shows the mesh and allocates resources */
      Mesh.prototype.enable = function () {
          if (this._isEnabled)
              return this;
          this._isEnabled = true;
          Api.meshfxMsg("spawn", this._id, 0, this._file);
          this.emit("enabled");
          return this;
      };
      /** Hides the mesh and frees resources */
      Mesh.prototype.disable = function () {
          if (!this._isEnabled)
              return this;
          this._isEnabled = false;
          Api.meshfxMsg("del", this._id);
          this.emit("disabled");
          return this;
      };
      return Mesh;
  }(EventEmitter));

  /** High level object API over low level {@link Api.meshfxMsg | Api.meshfxMsg("beautyMorph")} */
  var FaceMorph$1 = /*@__PURE__*/ (function () {
      /**
       * @example
       * ```ts
       * const eyes = new FaceMorph("eyes")
       *  .strength(0.75)
       * ```
       */
      function FaceMorph(property) {
          this._strength = 0;
          this._property = property;
      }
      /** Sets morph strength from 0 to 1 */
      FaceMorph.prototype.strength = function (value) {
          this._strength = value;
          Api.meshfxMsg("beautyMorph", 0, this._strength * 100, this._property); // 100 - stands for mapping: [0, 1] -> [0, 100]
          return this;
      };
      return FaceMorph;
  }());

  /** High level object API over {@link Api.meshfxMsg | Api.meshfxMsg("tex")} */
  var Texture = /*@__PURE__*/ (function () {
      /**
       * @param index - the index of texture sampler defined in cfg.toml (see {@link https://docs.banuba.com/docs/effect_constructor/reference/cfg_toml#materials | the link } for details)
       * @param file - filepath of texture file to use
       * @example
       * ```ts
       * new Texture(mesh, 2, "softlight.ktx")
       * ```
       */
      function Texture(mesh, index, file) {
          var _this = this;
          /** Used to auto-reload the texture on mesh enable */
          this._reload = function () {
              if (!_this._file)
                  return;
              Api.meshfxMsg("tex", _this._mesh["_id"], _this._index, _this._file);
          };
          this._mesh = mesh;
          this._index = index;
          this._file = file;
          if (this._mesh["_isEnabled"])
              this._reload();
          this._mesh.on("enabled", this._reload);
      }
      /** Sets the file as texture file */
      Texture.prototype.set = function (file) {
          this._file = file;
          if (this._mesh["_isEnabled"]) {
              Api.meshfxMsg("tex", this._mesh["_id"], this._index, this._file);
          }
          return this;
      };
      return Texture;
  }());

  /**
   * Internally used by Vec4 to provide the same Vec4 instance for the same GLSL `vec4` index
   * @private
   * @example
   * ```ts
   * new Vec4(42) === new Vec4(42) // true
   * new Vec4(1) === new Vec4(2) // false
   * ```
   */
  var cache = {};
  /**
   * High level object API over {@link Api.meshfxMsg | Api.meshfxMsg("shaderVec4") }
   *
   * Generally it's an object representation of {@link https://thebookofshaders.com/glossary/?search=vec4 | GLSL vec4}
   */
  var Vec4 = /*@__PURE__*/ (function () {
      /**
       * @param index - index of shader `vec4` variable (see {@link https://docs.banuba.com/docs/effect_constructor/reference/config_js#shadervec4 | link} for details)
       *
       * @example
       * ```ts
       * const vec4 = new Vec4(42)
       * ```
       */
      function Vec4(index) {
          this.x = new Component(this);
          this.y = new Component(this);
          this.z = new Component(this);
          this.w = new Component(this);
          this._index = index;
          if (!(index in cache))
              cache[index] = this;
          return cache[index];
      }
      /**
       * Sets `vec4` components at once
       * @example
       * ```ts
       * const vec4 = new Vec4(42).set("1 2 3 4") // "1 2 3 4"
       *
       * vec4.x.get() // 1
       * vec4.y.get() // 2
       * vec4.z.get() // 3
       * vec4.w.get() // 4
       *
       * vec4.set("5 6") // "5 6 0 0"
       *
       * vec4.x.get() // 5
       * vec4.y.get() // 6
       * vec4.z.get() // but `undefined`
       * vec4.w.get() // but `undefined`
       * ```
       */
      Vec4.prototype.set = function (xyzw) {
          var _a = xyzw.split(" ").map(parseFloat), x = _a[0], y = _a[1], z = _a[2], w = _a[3];
          this.x["_value"] = x;
          this.y["_value"] = y;
          this.z["_value"] = z;
          this.w["_value"] = w;
          Api.meshfxMsg("shaderVec4", 0, this._index, this.toString());
          return this;
      };
      /**
       * Returns string representation of {@link Vec4}
       * @example
       * ```ts
       * new Vec4(42).set("1 2 3 4").toString() // "1 2 3 4"
       * ```
       */
      Vec4.prototype.toString = function () {
          return [
              this.x.toString(),
              this.y.toString(),
              this.z.toString(),
              this.w.toString(),
          ].join(" ");
      };
      return Vec4;
  }());
  /**
   * Object representation of {@link https://thebookofshaders.com/glossary/?search=vec4 | GLSL vec4} component (coordinate)
   *
   * Simplifies sync & manipulation of `vec4` components (coordinates)
   *
   * @private
   * @typeParam T - Type of component value.
   *
   * It may be useful to force the component to be treated as `Component<number>` to avoid type warnings, e.g:
   * ```ts
   * const x = new Vec4(1).x
   * x.set(x => x + 1) // Warning: Operator '+' cannot be applied to types 'number | boolean' and 'number'.
   *
   * const y = new Vec4(2).y
   * y.set(y => <number>y + 1) // it's ok but verbose

   * const z = new Vec4(3).z as Coordinate<number>
   * z.set(z => z + 1) // it's just fine
   * ```
   * @example
   * ```ts
   * const vec4 = new Vec4(42) // "0 0 0 0"
   *
   * vec4.y.set(2) // same as vec4.set("0 2 0 0")
   * vec4.z.set(3) // same as vec4.set("0 2 3 0")
   *
   * vec4.w.set(w => <number>w + 4) // same as vec4.set("0 2 3 4")
   * ```
   */
  var Component = /*@__PURE__*/ (function () {
      function Component(parent) {
          this._parent = parent;
      }
      /** Returns the component value */
      Component.prototype.get = function () { return this._value; };
      Component.prototype.set = function (value) {
          if (typeof value === "function")
              value = value(this._value);
          this._value = value;
          Api.meshfxMsg("shaderVec4", 0, this._parent["_index"], this._parent.toString());
          return this;
      };
      /**
       * Returns string representation of the {@link Component} according to the following rules:
       *
       * - for {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy | falsy} values returns `"0"`
       * - for {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy | truthy } values returns string representation of the value number representation
       * @example
       * ```ts
       * new vec4 = new Vex4(42)
       * vec4.x.get() // `undefined`
       * vec4.x.toString() // "0"
       *
       * vec4.x.set(false).get() // false
       * vec.x.toString() // "0"
       *
       * vec4.x.set(true).get() // true
       * vec4.x.toString() // "1"
       *
       * vec4.x.set(42).get() // 42
       * vec4.x.toString() // "42"
       * ```
       */
      Component.prototype.toString = function () {
          var value = this._value;
          if (!value)
              value = Boolean(value);
          if (typeof value === "boolean")
              value = Number(value);
          if (typeof value === "number")
              value = String(value);
          return value;
      };
      return Component;
  }());

  function json(target, key, desc) {
      if (arguments.length === 3) {
          var method_1 = target[key];
          if (typeof method_1 !== "function")
              return;
          desc.value = function (maybeJson) {
              if (typeof maybeJson === "string") {
                  try {
                      maybeJson = JSON.parse(maybeJson);
                  }
                  catch (_a) { }
              }
              return method_1.call(this, maybeJson);
          };
      }
      for (var method in target.prototype) {
          json(target.prototype, method, Object.getOwnPropertyDescriptor(target.prototype, method));
      }
  }

  var FaceMorph = /*@__PURE__*/ (function () {
      function FaceMorph() {
          this.morphs = {
              face: new FaceMorph$1("face"),
              eyes: new FaceMorph$1("eyes"),
              nose: new FaceMorph$1("nose"),
          };
      }
      /** Sets face (cheeks) shrink strength from 0 to 1 */
      FaceMorph.prototype.face = function (strength) {
          this.morphs.face.strength(strength);
          return this;
      };
      /** Sets eyes grow strength from 0 to 1 */
      FaceMorph.prototype.eyes = function (strength) {
          this.morphs.eyes.strength(2 * strength); // TODO: What "2" stands for
          return this;
      };
      /** Sets nose shrink strength from 0 to 1 */
      FaceMorph.prototype.nose = function (strength) {
          this.morphs.nose.strength(strength);
          return this;
      };
      /** Resets morph */
      FaceMorph.prototype.clear = function () {
          return this
              .face(0)
              .eyes(0)
              .nose(0);
      };
      __decorate([
          json
      ], FaceMorph.prototype, "face", null);
      __decorate([
          json
      ], FaceMorph.prototype, "eyes", null);
      __decorate([
          json
      ], FaceMorph.prototype, "nose", null);
      return FaceMorph;
  }());
  /** Global FaceMorph instance */
  var faceMorph = /*@__PURE__*/ new FaceMorph();

  /** Removes eye bags */
  var EyeBagsRemoval = /*@__PURE__*/ (function () {
      function EyeBagsRemoval() {
      }
      /** Enables eye bags removal */
      EyeBagsRemoval.prototype.enable = function () {
          recognizer.enable("eye_bags");
          return this;
      };
      /** Disables eye bags removal */
      EyeBagsRemoval.prototype.disable = function () {
          recognizer.disable("eye_bags");
          return this;
      };
      return EyeBagsRemoval;
  }());
  /** Global EyeBagsRemoval instance */
  var eyeBagsRemoval = /*@__PURE__*/ new EyeBagsRemoval();

  var mesh$b = "triBG2.bsm2";

  var js_bg_rotation = 14;
  var js_bg_scale = 15;

  /**
   * Sets background behind a body to a texture
   * @example
   * ```ts
   * const bg = new BackgroundTexture()
   *  .set("bg_colors_tile.png")
   *  .scale(1.2)
   *  .rotate(45)
   * ```
   */
  var BackgroundTexture = /*@__PURE__*/ (function () {
      function BackgroundTexture() {
          this._mesh = new Mesh(mesh$b)
              .on("enabled", function () { return recognizer.enable("background"); })
              .on("disabled", function () { return recognizer.disable("background"); });
          this._texture = new Texture(this._mesh, 0);
          this._rotation = new Vec4(js_bg_rotation).x.set(0);
          this._scaling = new Vec4(js_bg_scale).x.set(1);
      }
      /** Sets the file as background texture*/
      BackgroundTexture.prototype.set = function (texture) {
          this._mesh.enable();
          this._texture.set(texture);
          return this;
      };
      /** Rotates the background texture clockwise in degrees */
      BackgroundTexture.prototype.rotate = function (angle) {
          this._rotation.set(function (x) { return x + angle; });
          return this;
      };
      /** Scales the background texture */
      BackgroundTexture.prototype.scale = function (factor) {
          this._scaling.set(function (x) { return x * factor; });
          return this;
      };
      /** Removes the background texture, resets background rotation and scaling */
      BackgroundTexture.prototype.clear = function () {
          this._mesh.disable();
          this._rotation.set(0);
          this._scaling.set(1);
          return this;
      };
      __decorate([
          json
      ], BackgroundTexture.prototype, "set", null);
      __decorate([
          json
      ], BackgroundTexture.prototype, "rotate", null);
      __decorate([
          json
      ], BackgroundTexture.prototype, "scale", null);
      return BackgroundTexture;
  }());
  /** Global BackgroundTexture instance */
  var backgroundTexture = /*@__PURE__*/ new BackgroundTexture();

  var mesh$a = "tri_Blur.bsm2";

  /** Blurs background behind a body */
  var BackgroundBlur = /*@__PURE__*/ (function () {
      function BackgroundBlur() {
          this._mesh = new Mesh(mesh$a)
              .on("enabled", function () { return recognizer.enable("background"); })
              .on("disabled", function () { return recognizer.disable("background"); });
      }
      /** Enables background blur */
      BackgroundBlur.prototype.enable = function () {
          this._mesh.enable();
          return this;
      };
      /** Disables background blur */
      BackgroundBlur.prototype.disable = function () {
          this._mesh.disable();
          return this;
      };
      return BackgroundBlur;
  }());
  /** Global BackgroundBlur instance */
  var backgroundBlur = /*@__PURE__*/ new BackgroundBlur();

  var mesh$9 = "tri_Bokeh.bsm2";

  /** Blurs background behind a body with {@link https://en.wikipedia.org/wiki/Bokeh  | Bokeh} effect */
  var BackgroundBokeh = /*@__PURE__*/ (function () {
      function BackgroundBokeh() {
          this._mesh = new Mesh(mesh$9)
              .on("enabled", function () { return recognizer.enable("background"); })
              .on("disabled", function () { return recognizer.disable("background"); });
      }
      /** Enables background blur */
      BackgroundBokeh.prototype.enable = function () {
          this._mesh.enable();
          return this;
      };
      /** Disables background blur */
      BackgroundBokeh.prototype.disable = function () {
          this._mesh.disable();
          return this;
      };
      return BackgroundBokeh;
  }());
  /** Global BackgroundBokeh instance */
  var backgroundBokeh = /*@__PURE__*/ new BackgroundBokeh();

  /**
   * Converts a given string to {@link Vec4.toString | Vec4 string}
   *
   * @external
   * @example
   * ```
   * toVec4String("") // "0 0 0 1"
   * toVec4String("1") // "1 0 0 1"
   * toVec4String("1 2") // "1 2 0 1"
   * toVec4String("1 2 3") // "1 2 3 1"
   * toVec4String("1 2 3 4") // "1 2 3 4"
   * ```
   */
  var toVec4String = function (value) {
      var _a = value.split(" "), _b = _a[0], r = _b === void 0 ? 0 : _b, _c = _a[1], g = _c === void 0 ? 0 : _c, _d = _a[2], b = _d === void 0 ? 0 : _d, _e = _a[3], a = _e === void 0 ? 1 : _e;
      return [r, g, b, a].join(" ");
  };
  /**
   * @external
   * @alias {@link toVec4String}
   */
  var rgba = toVec4String;
  /**
   * @external
   * @alias {@link toVec4String}
   **/
  var hsva = toVec4String;

  var mesh$8 = "skin.bsm2";

  var js_skin_color = 17;

  /**
   * Colors skin with a color
   */
  var Skin = /*@__PURE__*/ (function () {
      function Skin() {
          this._mesh = new Mesh(mesh$8)
              .on("enabled", function () { return recognizer.enable("skin_segmentation"); })
              .on("disabled", function () { return recognizer.disable("skin_segmentation"); });
          this._color = new Vec4(js_skin_color);
      }
      /** Sets skin color */
      Skin.prototype.color = function (color) {
          this._mesh.enable();
          this._color.set(rgba(color));
          return this;
      };
      Skin.prototype.clear = function () {
          this._color.set("0 0 0 0");
          this._mesh.disable();
          return this;
      };
      __decorate([
          json
      ], Skin.prototype, "color", null);
      return Skin;
  }());
  /** Global Skin instance */
  var skin = /*@__PURE__*/ new Skin();

  var nullTexture = "MakeupNull.png";

  var defaultSoftlightTexture = "soft.ktx";

  var defaultTeethLut = "lut3d_teeth_highlighter5.png";

  var defaultFlareTexture = "FLARE_38_512.png";

  var defaultEyesLut = "lut3d_eyes_verylow.png";

  var js_softlight = 0;
  var js_skinsoftening_removebags_rotation = 1;
  var js_is_apply_makeup = 2;
  var js_makeup_type = 3;

  /**
   * Global Retouch instance
   * @hidden
   */
  var Retouch = /*@__PURE__*/ (function () {
      var m = new Mesh("!glfx_FACE")
          .on("enabled", function () {
          // the "z" aka "rotation" has to be set to 1 cuz otherwise nether skinsoftening nor softlight will work
          new Vec4(js_skinsoftening_removebags_rotation).z.set(1);
      });
      /** These textures have to be set simultaniously cuz otherwise Retouch wont be rendered */
      var textures = {
          soflight: new Texture(m, 0, defaultSoftlightTexture),
          makeup: new Texture(m, 1, nullTexture),
          eyesflare: new Texture(m, 2, defaultFlareTexture),
      };
      /** These luts have to be set simultaneously cuz otherwise face will have highlighted eyes and teeth */
      var luts = {
          eyes: new Lut(m, 1, defaultEyesLut),
          teeth: new Lut(m, 2, defaultTeethLut),
      };
      return {
          enable: m.enable.bind(m),
          textures: textures,
          luts: luts,
      };
  })();
  /** Sets texture as composite makeup (i.e. all-in-one: lashes, shadows, eyeliner, etc) */
  var Makeup$1 = /*@__PURE__*/ (function () {
      function Makeup() {
          this._texture = Retouch.textures.makeup;
          this._isEnabled = new Vec4(js_is_apply_makeup).x;
          this._isTwoEyesMakeup = new Vec4(js_makeup_type).x;
      }
      /** Sets texture as makeup */
      Makeup.prototype.set = function (texture, isTwoEyesMakeup) {
          if (isTwoEyesMakeup === void 0) { isTwoEyesMakeup = true; }
          Retouch.enable();
          this._texture.set(texture);
          this._isEnabled.set(true);
          this._isTwoEyesMakeup.set(isTwoEyesMakeup);
          return this;
      };
      /** Resets makeup */
      Makeup.prototype.clear = function () {
          this._isEnabled.set(false);
          return this;
      };
      __decorate([
          json
      ], Makeup.prototype, "set", null);
      return Makeup;
  }());
  /** Highlights a face like a directional flash light */
  var Softlight = /*@__PURE__*/ (function () {
      function Softlight() {
          this._isEnabled = new Vec4(js_is_apply_makeup).y;
          this._strength = new Vec4(js_softlight).y;
      }
      /** Sets highlight strength from 0 to 1 */
      Softlight.prototype.strength = function (value) {
          Retouch.enable();
          this._strength.set(value);
          this._isEnabled.set(value !== 0);
          return this;
      };
      __decorate([
          json
      ], Softlight.prototype, "strength", null);
      return Softlight;
  }());
  /** Softs (smooths) a face skin */
  var SkinSoftening = /*@__PURE__*/ (function () {
      function SkinSoftening() {
          this._strength = new Vec4(js_skinsoftening_removebags_rotation).x;
      }
      /** Sets skin softening strength from 0 to 1 */
      SkinSoftening.prototype.strength = function (value) {
          Retouch.enable();
          this._strength.set(value);
          return this;
      };
      __decorate([
          json
      ], SkinSoftening.prototype, "strength", null);
      return SkinSoftening;
  }());
  /** Adds flare eyes effect */
  var EyesFlare = /*@__PURE__*/ (function () {
      function EyesFlare() {
          this._isEnabled = new Vec4(js_is_apply_makeup).z;
          this._strength = new Vec4(js_softlight).z;
      }
      /** Sets eyes flare strength from 0 to 1 */
      EyesFlare.prototype.strength = function (value) {
          Retouch.enable();
          this._strength.set(value);
          this._isEnabled.set(value !== 0);
          return this;
      };
      __decorate([
          json
      ], EyesFlare.prototype, "strength", null);
      return EyesFlare;
  }());
  /** Whitens eyes */
  var EyesWhitening = /*@__PURE__*/ (function () {
      function EyesWhitening() {
          this._lut = Retouch.luts.eyes;
      }
      /** Sets eyes whitening strength from 0 to 1 */
      EyesWhitening.prototype.strength = function (value) {
          Retouch.enable();
          this._lut.strength(value);
          return this;
      };
      __decorate([
          json
      ], EyesWhitening.prototype, "strength", null);
      return EyesWhitening;
  }());
  /** Whitens teeth */
  var TeethWhitening = /*@__PURE__*/ (function () {
      function TeethWhitening() {
          this._lut = Retouch.luts.teeth;
      }
      /** Sets teeth whitening strength from 0 to 1 */
      TeethWhitening.prototype.strength = function (value) {
          Retouch.enable();
          this._lut.strength(value);
          return this;
      };
      __decorate([
          json
      ], TeethWhitening.prototype, "strength", null);
      return TeethWhitening;
  }());
  /** Global Makeup instance */
  var makeup = /*@__PURE__*/ new Makeup$1();
  /** Global Softlight instance */
  var softlight = /*@__PURE__*/ new Softlight();
  /** Global SkinSoftening instance */
  var skinSoftening = /*@__PURE__*/ new SkinSoftening();
  /** Global EyesFlare instance */
  var eyesFlare = /*@__PURE__*/ new EyesFlare();
  /** Global EyesWhitening instance */
  var eyesWhitening = /*@__PURE__*/ new EyesWhitening();
  /** Global TeethWhitening instance */
  var teethWhitening = /*@__PURE__*/ new TeethWhitening();

  var mesh$7 = "make01.bsm2";

  var defaultContourTexture = "contour.png";

  var defaultBlusherTexture = "blushes.png";

  var defaultEyeshadowTexture = "eyeshadow.png";

  var defaultEyelinerTexture = "eyeliner.png";

  var defaultLashesTexture = "eyelashes.png";

  var defaultBrowsTexture = "eyebrows.png";

  var defaultHighlighterTexture = "highlighter.png";

  var js_blushes_color = 4;
  var js_contour_color = 5;
  var js_eyeliner_color = 6;
  var js_eyeshadow_color = 7;
  var js_lashes_color = 8;
  var js_brows_color = 10;
  var js_highlighter_color = 11;

  /** @hidden */
  var Makeup = /*@__PURE__*/ (function () {
      var m = new Mesh(mesh$7)
          .on("enabled", function () { return Retouch.enable(); });
      /** These textures have to be set cuz otherwise Makeup wont be rendered */
      var textures = {
          blusher: new Texture(m, 0, defaultBlusherTexture),
          contouring: new Texture(m, 1, defaultContourTexture),
          eyeliner: new Texture(m, 2, defaultEyelinerTexture),
          eyeshadow: new Texture(m, 3, defaultEyeshadowTexture),
          lashes: new Texture(m, 4, defaultLashesTexture),
          brows: new Texture(m, 5, defaultBrowsTexture),
          highlighter: new Texture(m, 6, defaultHighlighterTexture),
          __reserved: new Texture(m, 7, nullTexture), // extra texture for possible future needs
      };
      return {
          enable: m.enable.bind(m),
          textures: textures,
      };
  })();
  /** Represents particular facial area like contouring, blushes, etc */
  var FacialArea = /*@__PURE__*/ (function () {
      function FacialArea(texture, color) {
          this._defaultTextureUrl = texture["_file"];
          this._texture = texture.set(nullTexture);
          this._color = color;
          Makeup.enable();
      }
      /** Sets the facial area texture */
      FacialArea.prototype.set = function (texture) {
          this._texture.set(texture);
          return this;
      };
      /** Sets the facial area color */
      FacialArea.prototype.color = function (color) {
          if (this._texture["_file"] === nullTexture)
              this._texture.set(this._defaultTextureUrl);
          this._color.set(rgba(color));
          return this;
      };
      /** Resets the facial area color */
      FacialArea.prototype.clear = function () {
          this._color.set("0 0 0 0");
          return this;
      };
      __decorate([
          json
      ], FacialArea.prototype, "set", null);
      __decorate([
          json
      ], FacialArea.prototype, "color", null);
      return FacialArea;
  }());
  var Contour = /*@__PURE__*/ (function (_super) {
      __extends(Contour, _super);
      function Contour() {
          return _super.call(this, Makeup.textures.contouring, new Vec4(js_contour_color).set("0 0 0 1")) || this;
      }
      return Contour;
  }(FacialArea));
  var Blush = /*@__PURE__*/ (function (_super) {
      __extends(Blush, _super);
      function Blush() {
          return _super.call(this, Makeup.textures.blusher, new Vec4(js_blushes_color).set("0 0 0 1")) || this;
      }
      return Blush;
  }(FacialArea));
  var Eyeshadow = /*@__PURE__*/ (function (_super) {
      __extends(Eyeshadow, _super);
      function Eyeshadow() {
          return _super.call(this, Makeup.textures.eyeshadow, new Vec4(js_eyeshadow_color).set("0 0 0 1")) || this;
      }
      return Eyeshadow;
  }(FacialArea));
  var Eyeliner = /*@__PURE__*/ (function (_super) {
      __extends(Eyeliner, _super);
      function Eyeliner() {
          return _super.call(this, Makeup.textures.eyeliner, new Vec4(js_eyeliner_color).set("0 0 0 1")) || this;
      }
      return Eyeliner;
  }(FacialArea));
  var Eyelashes = /*@__PURE__*/ (function (_super) {
      __extends(Eyelashes, _super);
      function Eyelashes() {
          return _super.call(this, Makeup.textures.lashes, new Vec4(js_lashes_color).set("0 0 0 1")) || this;
      }
      return Eyelashes;
  }(FacialArea));
  var Eyebrows = /*@__PURE__*/ (function (_super) {
      __extends(Eyebrows, _super);
      function Eyebrows() {
          return _super.call(this, Makeup.textures.brows, new Vec4(js_brows_color).set("0 0 0 1")) || this;
      }
      return Eyebrows;
  }(FacialArea));
  var Highlighter = /*@__PURE__*/ (function (_super) {
      __extends(Highlighter, _super);
      function Highlighter() {
          return _super.call(this, Makeup.textures.highlighter, new Vec4(js_highlighter_color).set("0 0 0 1")) || this;
      }
      return Highlighter;
  }(FacialArea));
  /** Global Contour instance */
  var contour = /*@__PURE__*/ new Contour();
  /** Global Blush instance */
  var blush = /*@__PURE__*/ new Blush();
  /** Global Eyeshadow instance */
  var eyeshadow = /*@__PURE__*/ new Eyeshadow();
  /** Global Eyeliner instance */
  var eyeliner = /*@__PURE__*/ new Eyeliner();
  /** Global Eyelashes instance */
  var eyelashes = /*@__PURE__*/ new Eyelashes();
  /** Global Eyebrows instance */
  var eyebrows = /*@__PURE__*/ new Eyebrows();
  /** Global Highlighter instance */
  var highlighter = /*@__PURE__*/ new Highlighter();

  var defaultEyelash3dTexture = "eyelashes3d.png";

  var mesh$6 = "eyelash.bsm2";

  var mesh2$1 = "cut_lashes.bsm2";

  var js_lashes3d_color = 9;

  /** Colors 3d Lashes */
  var Eyelashes3d = /*@__PURE__*/ (function () {
      function Eyelashes3d() {
          this._mesh = new Mesh(mesh$6);
          this._mesh2 = new Mesh(mesh2$1);
          this._texture = new Texture(this._mesh, 0, defaultEyelash3dTexture);
          this._color = new Vec4(js_lashes3d_color);
      }
      /** Sets 3d lashes color */
      Eyelashes3d.prototype.color = function (color) {
          this._mesh.enable();
          this._mesh2.enable();
          this._color.set(rgba(color));
          return this;
      };
      Eyelashes3d.prototype.set = function (texture) {
          this._mesh.enable();
          this._mesh2.enable();
          this._texture.set(texture);
          return this;
      };
      /** Resets lashes3d color */
      Eyelashes3d.prototype.clear = function () {
          this._color.set("0 0 0 0");
          this._mesh.disable();
          this._mesh2.disable();
          return this;
      };
      __decorate([
          json
      ], Eyelashes3d.prototype, "color", null);
      __decorate([
          json
      ], Eyelashes3d.prototype, "set", null);
      return Eyelashes3d;
  }());
  /** Global Eyelashes3d instance */
  var eyelashes3d = /*@__PURE__*/ new Eyelashes3d();

  var mesh1 = "triHair.bsm2";

  var mesh2 = "quadHair.bsm2";

  var js_hair_colors$1 = [19,20,21,22,23,24,25,26];
  var js_hair_colors_size = 27;

  /** @hidden */
  var defaultColor$1 = "0 0 0 0";
  /** Colors hair with 1 to 4 colors */
  var HairGradient = /*@__PURE__*/ (function () {
      function HairGradient() {
          this._mesh1 = new Mesh(mesh1);
          this._mesh2 = new Mesh(mesh2);
          this._colors = [
              new Vec4(js_hair_colors$1[0]),
              new Vec4(js_hair_colors$1[1]),
              new Vec4(js_hair_colors$1[2]),
              new Vec4(js_hair_colors$1[3]),
          ];
          this._usedColorsCount = new Vec4(js_hair_colors_size).x;
      }
      /** Sets hair color */
      HairGradient.prototype.color = function (colors) {
          var _this = this;
          if (!Array.isArray(colors))
              colors = [colors];
          recognizer.enable("hair");
          this._mesh1.enable();
          this._mesh2.enable();
          colors.forEach(function (color, index) {
              if (color == null)
                  return;
              _this._colors[index].set(rgba(color));
          });
          this._usedColorsCount.set(colors.length);
          return this;
      };
      /** Resets hair color */
      HairGradient.prototype.clear = function () {
          this._colors.forEach(function (c) { return c.set(defaultColor$1); });
          this._usedColorsCount.set(0);
          this._mesh1.disable();
          this._mesh2.disable();
          recognizer.disable("hair");
          return this;
      };
      __decorate([
          json
      ], HairGradient.prototype, "color", null);
      return HairGradient;
  }());
  /** Global HairGradient instance */
  var hairGradient = /*@__PURE__*/ new HairGradient();

  var mesh$5 = "tri_a.bsm2";

  var js_hair_colors = [19,20,21,22,23,24,25,26];

  /** Colors hair with one color */
  var Hair = /*@__PURE__*/ (function () {
      function Hair() {
          this._mesh = new Mesh(mesh$5)
              .on("enabled", function () { return recognizer.enable("hair"); })
              .on("disabled", function () { return recognizer.disable("hair"); });
          this._color = new Vec4(js_hair_colors[0]);
      }
      /** Sets hair color */
      Hair.prototype.color = function (color) {
          this._mesh.enable();
          this._color.set(rgba(color));
          return this;
      };
      /** Resets hair color */
      Hair.prototype.clear = function () {
          this._color.set("0 0 0 0");
          this._mesh.disable();
          return this;
      };
      __decorate([
          json
      ], Hair.prototype, "color", null);
      return Hair;
  }());
  /** Global HairColor instance */
  var hair = /*@__PURE__*/ new Hair();

  var mesh$4 = "triHS.bsm2";

  var js_strand_colors = [28,29,30,31,32];

  /** @hidden */
  var defaultColor = "0 0 0 0";
  /** Colors hair strands with 1 to 5 colors */
  var HairStrand = /*@__PURE__*/ (function () {
      function HairStrand() {
          this._mesh = new Mesh(mesh$4)
              .on("enabled", function () { return recognizer.enable("hair_strand"); })
              .on("disabled", function () { return recognizer.disable("hair_strand"); });
          this._colors = [
              new Vec4(js_strand_colors[0]),
              new Vec4(js_strand_colors[1]),
              new Vec4(js_strand_colors[2]),
              new Vec4(js_strand_colors[3]),
              new Vec4(js_strand_colors[4]),
          ];
      }
      /** Sets hair strands colors */
      HairStrand.prototype.color = function (colors) {
          var _this = this;
          if (!Array.isArray(colors))
              colors = [colors];
          this._mesh.enable();
          colors.forEach(function (color, index) {
              if (color == null)
                  return;
              _this._colors[index].set(hsva(color));
          });
          return this;
      };
      /** Resets hair strands colors */
      HairStrand.prototype.clear = function () {
          this._colors.forEach(function (c) { return c.set(defaultColor); });
          this._mesh.disable();
          return this;
      };
      __decorate([
          json
      ], HairStrand.prototype, "color", null);
      return HairStrand;
  }());
  /** Global HairStrand instance */
  var hairStrand = /*@__PURE__*/ new HairStrand();

  var mesh$3 = "lips.bsm2";

  var js_lips_color$1 = 33;
  var js_lips_brightness_contrast = 34;

  /** Colors lips with mat color, adjusts brightness and contrast of the color */
  var MattLips = /*@__PURE__*/ (function () {
      function MattLips() {
          this._mesh = new Mesh(mesh$3)
              .on("enabled", function () { return recognizer.enable("lips_segmentation"); })
              .on("disabled", function () { return recognizer.disable("lips_segmentation"); });
          this._color = new Vec4(js_lips_color$1);
          /**
           * Dull is opposite of saturation
           *
           * Changing saturation from 0 to 1 means from less saturated to more saturated
           * Changing dull from 0 to 1 means from more saturated to less saturated
           */
          this._dull = new Vec4(js_lips_brightness_contrast).x.set(0); // x actually changes saturation
          this._brightness = new Vec4(js_lips_brightness_contrast).y.set(1); // y actually changes brightness
      }
      /** Sets lips colors */
      MattLips.prototype.color = function (color) {
          this._mesh.enable();
          this._color.set(rgba(color));
          return this;
      };
      /** Sets the lips color saturation */
      MattLips.prototype.saturation = function (value) {
          this._dull.set(1 - value);
          return this;
      };
      /** Sets the lips color brightness */
      MattLips.prototype.brightness = function (value) {
          this._brightness.set(value);
          return this;
      };
      /** Resets lips color, brightness and contrast */
      MattLips.prototype.clear = function () {
          this._color.set("0 0 0 0");
          this._dull.set(0);
          this._brightness.set(1);
          this._mesh.disable();
          return this;
      };
      __decorate([
          json
      ], MattLips.prototype, "color", null);
      __decorate([
          json
      ], MattLips.prototype, "saturation", null);
      __decorate([
          json
      ], MattLips.prototype, "brightness", null);
      return MattLips;
  }());
  /** Global Lips instance */
  var mattLips = /*@__PURE__*/ new MattLips();

  var mesh$2 = "eyes.bsm2";

  var js_is_face_tracked = 12;
  var js_eyes_color = 18;

  /** Sets eyes color */
  var Eyes = /*@__PURE__*/ (function () {
      function Eyes() {
          var _this = this;
          this._mesh = new Mesh(mesh$2)
              .on("enabled", function () {
              recognizer.enable("eyes_segmentation");
              faceTracker // TODO: The `eyes` works bad without face tracker, but `lips` and `lips_shiny` are okay ¯\_(ツ)_/¯
                  .on("face", _this._enable)
                  .on("no-face", _this._disable);
          })
              .on("disabled", function () {
              recognizer.disable("eyes_segmentation");
              faceTracker
                  .off("face", _this._enable)
                  .off("no-face", _this._disable);
          });
          this._isEnabled = new Vec4(js_is_face_tracked).x;
          this._color = new Vec4(js_eyes_color);
          this._enable = function () { return _this._isEnabled.set(true); };
          this._disable = function () { return _this._isEnabled.set(false); };
      }
      /** Sets eyes color */
      Eyes.prototype.color = function (color) {
          this._mesh.enable();
          this._color.set(rgba(color));
          return this;
      };
      /** Resets eyes color */
      Eyes.prototype.clear = function () {
          this._color.set("0 0 0 0");
          this._mesh.disable();
          return this;
      };
      __decorate([
          json
      ], Eyes.prototype, "color", null);
      return Eyes;
  }());
  /** Global EyesColor instance */
  var eyes = /*@__PURE__*/ new Eyes();

  var mesh$1 = "shiny_lips.bsm2";

  var js_lips_color = 33;
  var js_lips_shine = 35;
  var js_lips_glitter = 36;

  var defaultShineParams = "1.5 1 0.5 1";
  var defaultGlitterParams = "0 0 0";
  /** Colors lips with shiny color, adjusts brightness and contrast of the color */
  var ShinyLips = /*@__PURE__*/ (function () {
      function ShinyLips() {
          this._mesh = new Mesh(mesh$1)
              .on("enabled", function () { return recognizer.enable("lips_shine"); })
              .on("disabled", function () { return recognizer.disable("lips_shine"); });
          this._color = new Vec4(js_lips_color);
          /**
           * @property shine.x - sCoef -- color saturation
           * @property shine.y - vCoef -- shine brightness (intensity)
           * @property shine.z - sCoef1 -- shine saturation (color bleeding)
           * @property shine.w - bCoef -- darkness (more is less)
           */
          this._shine = new Vec4(js_lips_shine).set(defaultShineParams);
          /**
         * @property glitter.x - nCoeff - noiseness/width
         * @property glitter.y - nCoeff2 - amount of glitter highlights over whole lips area
         * @property glitter.z - nUVScale - grain/pixely
         */
          this._glitter = new Vec4(js_lips_glitter).set(defaultGlitterParams);
      }
      /** Sets lips color */
      ShinyLips.prototype.color = function (color) {
          this._mesh.enable();
          this._color.set(rgba(color));
          return this;
      };
      /** Sets the color saturation  */
      ShinyLips.prototype.saturation = function (value) {
          this._shine.x.set(value);
          return this;
      };
      /** Sets the color brightness */
      ShinyLips.prototype.brightness = function (value) {
          this._shine.w.set(value);
          return this;
      };
      /** Sets the lips shine intensity */
      ShinyLips.prototype.shineIntensity = function (value) {
          this._shine.y.set(value);
          return this;
      };
      ShinyLips.prototype.shineBlending = function (value) {
          Api.print("DeprecationWarning: Using `ShinyLips.shineBlending` will soon stop working. Use `ShinyLips.shineBleeding` instead");
          this.shineBlending = this.shineBleeding; // To emit the warning above only once
          return this.shineBleeding(value);
      };
      /** Sets the lips shine bleeding */
      ShinyLips.prototype.shineBleeding = function (value) {
          this._shine.z.set(value);
          return this;
      };
      ShinyLips.prototype.glitterGrain = function (value) {
          this._glitter.z.set(value);
          return this;
      };
      ShinyLips.prototype.glitterIntensity = function (value) {
          this._glitter.y.set(value);
          return this;
      };
      ShinyLips.prototype.glitterBleeding = function (value) {
          this._glitter.x.set(value);
          return this;
      };
      /** Resets lips color */
      ShinyLips.prototype.clear = function () {
          this._color.set("0 0 0 0");
          this._shine.set(defaultShineParams);
          this._glitter.set(defaultGlitterParams);
          this._mesh.disable();
          return this;
      };
      __decorate([
          json
      ], ShinyLips.prototype, "color", null);
      __decorate([
          json
      ], ShinyLips.prototype, "saturation", null);
      __decorate([
          json
      ], ShinyLips.prototype, "brightness", null);
      __decorate([
          json
      ], ShinyLips.prototype, "shineIntensity", null);
      __decorate([
          json
      ], ShinyLips.prototype, "shineBleeding", null);
      __decorate([
          json
      ], ShinyLips.prototype, "glitterGrain", null);
      __decorate([
          json
      ], ShinyLips.prototype, "glitterIntensity", null);
      __decorate([
          json
      ], ShinyLips.prototype, "glitterBleeding", null);
      return ShinyLips;
  }());
  /** Global ShinyLips instance */
  var shinyLips = /*@__PURE__*/ new ShinyLips();

  var mesh = "tri.bsm2";

  var js_slider_pos_alpha = 13;

  var LutFilter = /*@__PURE__*/ (function () {
      function LutFilter() {
          this._mesh = new Mesh(mesh);
          this._lut = new Lut(this._mesh, 0);
          new Vec4(js_slider_pos_alpha).set("0 1"); // TODO: can we fix shader code and get rid of this ?
      }
      /** Uses specified file as LUT filter */
      LutFilter.prototype.set = function (lut) {
          this._mesh.enable();
          this._lut.set(lut).strength(1);
          return this;
      };
      /** Sets filter strength from 0 to 1 */
      LutFilter.prototype.strength = function (value) {
          this._lut.strength(value);
          return this;
      };
      /** Resets the filter */
      LutFilter.prototype.clear = function () {
          this._mesh.disable();
          return this;
      };
      __decorate([
          json
      ], LutFilter.prototype, "set", null);
      __decorate([
          json
      ], LutFilter.prototype, "strength", null);
      return LutFilter;
  }());
  /** Global LutFilter instance */
  var lutFilter = /*@__PURE__*/ new LutFilter();

  /**
   * @packageDocumentation
   * @external
   */
  var Foundation = /*@__PURE__*/ (function () {
      function Foundation() {
      }
      /** Sets foundation color */
      Foundation.prototype.color = function (color) {
          skin.color(color);
          return this;
      };
      /** Sets foundation cover strength from 0 to 1 */
      Foundation.prototype.strength = function (value) {
          skinSoftening.strength(value);
          return this;
      };
      /** Resets foundation */
      Foundation.prototype.clear = function () {
          skin.clear();
          skinSoftening.strength(0);
          return this;
      };
      return Foundation;
  }());
  /** Global Foundation instance */
  var foundation = new Foundation();

  /**
   * @packageDocumentation
   * @module Beauty/features/lips
   * @external
   */
  var Lips = /*@__PURE__*/ (function () {
      function Lips() {
          this._lips = mattLips;
          this._color = "0 0 0 0";
          this._saturation = 1;
          this._brightness = 1;
          this._features = {
              get isActive() {
                  return [
                      this.shineIntensity,
                      this.shineBleeding,
                      this.glitterIntensity,
                      this.glitterBleeding,
                  ].some(function (value) { return value != 0; });
              },
              shineIntensity: this._lips === mattLips ? 0 : 1,
              shineBleeding: this._lips === mattLips ? 0 : 0.5,
              glitterGrain: this._lips === mattLips ? 0 : 0.4,
              glitterIntensity: this._lips === mattLips ? 0 : 1,
              glitterBleeding: this._lips === mattLips ? 0 : 1,
          };
      }
      Lips.prototype._useLips = function (lips) {
          // switch lips if needed
          if (this._lips === lips)
              return this._lips;
          this._lips.clear();
          this._lips = lips;
          // restore common properties
          this._lips
              .color(this._color)
              .saturation(this._saturation)
              .brightness(this._brightness);
          return this._lips;
      };
      Lips.prototype._setFeature = function (feature, value) {
          this._features[feature] = value;
          if (this._features.isActive) {
              this
                  ._useLips(shinyLips)[feature](this._features[feature]);
          }
          else {
              this
                  ._useLips(mattLips);
          }
          return this;
      };
      Lips.prototype.color = function (color) {
          this._color = color;
          this._lips.color(this._color);
          return this;
      };
      Lips.prototype.saturation = function (value) {
          this._saturation = value;
          this._lips.saturation(this._saturation);
          return this;
      };
      Lips.prototype.brightness = function (value) {
          this._brightness = value;
          this._lips.brightness(this._brightness);
          return this;
      };
      Lips.prototype.shineIntensity = function (value) {
          return this._setFeature("shineIntensity", value);
      };
      Lips.prototype.shineBlending = function (value) {
          Api.print("DeprecationWarning: Using `Lips.shineBlending` will soon stop working. Use `Lips.shineBleeding` instead");
          this.shineBlending = this.shineBleeding; // To emit the warning above only once
          return this.shineBleeding(value);
      };
      Lips.prototype.shineBleeding = function (value) {
          return this._setFeature("shineBleeding", value);
      };
      Lips.prototype.glitterGrain = function (value) {
          return this._setFeature("glitterGrain", value);
      };
      Lips.prototype.glitterIntensity = function (value) {
          return this._setFeature("glitterIntensity", value);
      };
      Lips.prototype.glitterBleeding = function (value) {
          return this._setFeature("glitterBleeding", value);
      };
      /**
       * Sets matt lips color
       * This is a helper method and equivalent of
       * ```js
       * Lips
       *  .color(rgba)
       *  .saturation(1)
       *  .shineIntensity(0)
       *  .shineBleeding(0)
       *  .glitterIntensity(0)
       *  .glitterBleeding(0)
       * ```
       */
      Lips.prototype.matt = function (color) {
          return this
              .color(color)
              .saturation(1)
              .shineIntensity(0)
              .shineBleeding(0)
              .glitterIntensity(0)
              .glitterBleeding(0);
      };
      /**
       * Sets shiny lips color
       * This is a helper method and equivalent of
       * ```js
       * Lips
       *  .color(rgba)
       *  .saturation(1.5)
       *  .shineIntensity(1)
       *  .shineBleeding(0.5)
       *  .glitterIntensity(0)
       *  .glitterBleeding(0)
       * ```
       */
      Lips.prototype.shiny = function (color) {
          return this
              .color(color)
              .saturation(1.5)
              .shineIntensity(1)
              .shineBleeding(0.5)
              .glitterIntensity(0)
              .glitterBleeding(0);
      };
      /**
       * Sets glitter lips color
       * This is a helper method and equivalent of
       * ```js
       * Lips
       *  .color(rgba)
       *  .saturation(1)
       *  .shineIntensity(0.9)
       *  .shineBleeding(0.6)
       *  .glitterGrain(0.4)
       *  .glitterIntensity(1)
       *  .glitterBleeding(1)
       * ```
       */
      Lips.prototype.glitter = function (color) {
          return this
              .color(color)
              .saturation(1)
              .shineIntensity(0.9)
              .shineBleeding(0.6)
              .glitterGrain(0.4)
              .glitterIntensity(1)
              .glitterBleeding(1);
      };
      /** Resets lips color */
      Lips.prototype.clear = function () {
          this._lips.clear();
          this._color = "0 0 0 0";
          this._saturation = 1;
          this._brightness = 1;
          this._features.shineIntensity = 0;
          this._features.shineBleeding = 0;
          this._features.glitterGrain = 0;
          this._features.glitterIntensity = 0;
          this._features.glitterBleeding = 0;
          return this;
      };
      return Lips;
  }());
  /** Global Lips instance */
  var lips = new Lips();

  var version = "0.35.0";

  /**
   * Effect for virtual Beautification try on
   * @packageDocumentation
   * @module Makup
   * @external
   */
  configure({
      faceActions: [faceTracker.emitFaceDetected],
      noFaceActions: [faceTracker.emitNoFaceDetected],
      videoRecordStartActions: [],
      videoRecordFinishActions: [],
      videoRecordDiscardActions: [],
      init: function () {
      },
      restart: function () {
          Api.meshfxReset();
          this.init();
      },
  });
  var printVersion = function () { return Api.print("Makeup effect v" + version); };
  /**
   * The effect test function
   * @hidden
   * @example
   * Web:
   * ```js
   * player.callJsMethod("test")
   * ```
   **/
  //@ts-ignore
  function test() {
      teethWhitening.strength(1);
      faceMorph.eyes(1).nose(1).face(1);
      softlight.strength(1);
      hair.color("0.09411, 0.2509, 0.3764");
      eyes.color("0.1098, 0.3450, 0.2078");
      eyeBagsRemoval.enable();
      highlighter.color("0.75 0.74 0.74 0.4");
      contour.color("0.3 0.1 0.1 0.6");
      foundation.color("0.73 0.39 0.08 0.4").strength(0.75);
      blush.color("0.7 0.1 0.2 0.5");
      eyeliner.color("0 0 0");
      eyeshadow.color("0.6 0.5 1 0.6");
      eyelashes3d.color("0 0 0.2 1");
      eyebrows.color("0.8 0.4 0.2 0.4");
      lips.glitter("0.85 0.43 0.5 0.8");
  }

  exports.BackgroundBlur = backgroundBlur;
  exports.BackgroundBokeh = backgroundBokeh;
  exports.BackgroundTexture = backgroundTexture;
  exports.Blush = blush;
  exports.Contour = contour;
  exports.EyeBagsRemoval = eyeBagsRemoval;
  exports.Eyebrows = eyebrows;
  exports.Eyelashes = eyelashes;
  exports.Eyelashes3d = eyelashes3d;
  exports.Eyeliner = eyeliner;
  exports.Eyes = eyes;
  exports.EyesColor = eyes;
  exports.EyesFlare = eyesFlare;
  exports.EyesWhitening = eyesWhitening;
  exports.Eyeshadow = eyeshadow;
  exports.FaceMorph = faceMorph;
  exports.Foundation = foundation;
  exports.Hair = hair;
  exports.HairGradient = hairGradient;
  exports.HairStrand = hairStrand;
  exports.Highlighter = highlighter;
  exports.Lips = lips;
  exports.LutFilter = lutFilter;
  exports.Makeup = makeup;
  exports.Skin = skin;
  exports.SkinSoftening = skinSoftening;
  exports.Softlight = softlight;
  exports.TeethWhitening = teethWhitening;
  exports.VERSION = version;
  exports.printVersion = printVersion;
  exports.test = test;

  Object.defineProperty(exports, '__esModule', { value: true });


      var globalThis = new Function("return this;")();
      
      for (var key in exports) { globalThis[key] = exports[key]; }
      
      // bugfix: SDK's `callJsMethod` can not call nested (e.b. `foo.bar()`) methods
      for (var key in exports) {
        var value = exports[key];
      
        if (value === null) continue;
        if (typeof value !== "object") continue;
      
        for (var method in Object.getPrototypeOf(value)) {
            var fn = value[method];
            globalThis[key + "." + method] = fn.bind(value);
        }
      }
      

  return exports;

}({}));
/* Feel free to add your custom code below */
