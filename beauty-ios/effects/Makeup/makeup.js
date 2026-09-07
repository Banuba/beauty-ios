'use strict';

require('bnb_js/global');
require('./modules/scene/index.js');
const modules_faceMorph_index = require('./modules/face-morph/index.js');
const modules_hair_index = require('./modules/hair/index.js');
const modules_brows_index = require('./modules/brows/index.js');
const modules_eyeBags_index = require('./modules/eye-bags/index.js');
const modules_eyelashes_index = require('./modules/eyelashes/index.js');
const modules_eyes_index = require('./modules/eyes/index.js');
const modules_lips_index = require('./modules/lips/index.js');
const modules_lipsLiner_index = require('./modules/lips-liner/index.js');
const modules_lutFilter_index = require('./modules/lut-filter/index.js');
const modules_makeup_index = require('./modules/makeup/index.js');
const modules_skin_index = require('./modules/skin/index.js');
const modules_softlight_index = require('./modules/softlight/index.js');
const modules_teeth_index = require('./modules/teeth/index.js');
const modules_index = require('./modules/index.js');
const background = require('bnb_js/background');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

const background__default = /*#__PURE__*/_interopDefaultLegacy(background);

bnb.log(`\n\nMakeup API version: ${"1.4.0-379d9ade2c087670be95dd5ba5de153d68e4a3c2"}\n`);
const Skin = new modules_skin_index.Skin();
const Eyes = new modules_eyes_index.Eyes();
const Teeth = new modules_teeth_index.Teeth();
const Lips = new modules_lips_index.Lips();
const Makeup = new modules_makeup_index.Makeup();
const LipsLiner = new modules_lipsLiner_index.LipsLiner();
const Eyelashes = new modules_eyelashes_index.Eyelashes();
const Brows = new modules_brows_index.Brows();
const Softlight = new modules_softlight_index.Softlight();
const Hair = new modules_hair_index.Hair();
const Filter = new modules_lutFilter_index.LutFilter();
const FaceMorph = new modules_faceMorph_index.FaceMorph();
const EyeBagsRemoval = new modules_eyeBags_index.EyeBagsRemoval();
/**
 * @example
 * ```js
 * var settings = {
 *   // "feature_name": {
 *   //   "param_name": default_value, // example_value
 *   // },
 *   "Skin": {
 *     "color": "0.0 0.0 0.0 0.0", // "0 1.0 0 1.0"
 *     "softening": 0.0,           // 1.0
 *   },
 *   "Eyes": {
 *     "color": "0.0 0.0 0.0 0.0", // "0 0 1.0 1.0"
 *     "whitening": 0.0,           // 1.0
 *     "flare": 0.0,               // 1.0
 *   },
 *   "Teeth": {
 *     "whitening": 0.0, // 1.0
 *   },
 *   "Lips": {
 *     "color": "0.0 0.0 0.0 0.0", // "1.0 0.12 0.14 1.0",
 *     "saturation": 1,            // 1.5
 *     "brightness": 1,            // 1.2
 *     "shineIntensity": 0,        // 0.9
 *     "shineBleeding": 0,         // 0.6
 *     "shineScale": 0,            // 1.1
 *     "glitterGrain": 0,          // 0.4
 *     "glitterIntensity": 0,      // 1.0
 *     "glitterBleeding": 0,       // 1.0
 *   },
 *   "Makeup": {
 *     contour: "0.0 0.0 0.0 0.0",     // "0.0 0.0 0.0 1.0"
 *     blushes: "0.0 0.0 0.0 0.0",     // "0.0 0.0 0.0 1.0"
 *     highlighter: "0.0 0.0 0.0 0.0", // "0.0 0.0 0.0 1.0"
 *     eyeshadow: "0.0 0.0 0.0 0.0",   // "0.0 0.0 0.0 1.0"
 *     eyeliner: "0.0 0.0 0.0 0.0",    // "0.0 0.0 0.0 1.0"
 *     lashes: "0.0 0.0 0.0 0.0",      // "0.0 0.0 0.0 1.0"
 *   },
 *   "Eyelashes": {
 *     "color": "0.0 0.0 0.0 0.0",  // "0.0 0.0 0.0 1.0",
 *     "texture": "",               // "textures/eyelashes/1.png"
 *   },
 *   "Brows": {
 *     "color": "0.0 0.0 0.0 0.0",  // "0.0 0.0 0.0 1.0"
 *   },
 *   "Softltght": {
 *     "strength": 0.0, // 1.0
 *   },
 *   "Hair": {
 *     "color": "0.0 0.0 0.0 0.0", // one color "0.0 1.0 0.0 1.0" or up to 5 colors as array ["0.0 1.0 0.0 1.0", "1.0 0.0 0.0 1.0"]
 *   },
 *   "Filter": {
 *     noise: 0.0,      // 0.25
 *     sharpen: 0.0,    // 0.475
 *     brightness: 0.0, // 0.15
 *     contrast: 0.0,   // 0.2
 *     saturation: 0.0, // -0.15
 *     lut: "",         // "luts/lut1.png"
 *   },
 *   "FaceMorph": {
 *     "face": 0.0, // 1.0
 *     "eyes": 0.0, // 1.25,
 *     "nose": 0.0, // 1.0
 *     "lips": 0.0, // 1.5
 *   },
 * }
 *
 * var state = JSON.stringify(settings)
 *
 * effect.evalJs(`setState(${state})`)
 * ```
 * @see
 * {@link https://docs.banuba.com/face-ar-sdk-v1/effect_api/face_beauty}
 * {@link https://docs.banuba.com/face-ar-sdk-v1/effect_api/makeup}
 */
const setState = modules_index.createSetState({
    Skin,
    Eyes,
    Teeth,
    Lips,
    Makeup,
    LipsLiner,
    Eyelashes,
    Brows,
    Softlight,
    Hair,
    Filter,
    FaceMorph,
});

const m = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Background: background__default['default'],
    Skin: Skin,
    Eyes: Eyes,
    Teeth: Teeth,
    Lips: Lips,
    Makeup: Makeup,
    LipsLiner: LipsLiner,
    Eyelashes: Eyelashes,
    Brows: Brows,
    Softlight: Softlight,
    Hair: Hair,
    Filter: Filter,
    FaceMorph: FaceMorph,
    EyeBagsRemoval: EyeBagsRemoval,
    setState: setState
});

exports.m = m;
