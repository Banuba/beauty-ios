'use strict';

const index$a = require('./modules/eye-bags/index.js');
const index$5 = require('./modules/eyelashes/index.js');
const index$1 = require('./modules/eyes/index.js');
const index$9 = require('./modules/face-morph/index.js');
const index$8 = require('./modules/filter/index.js');
const index$6 = require('./modules/hair/index.js');
const index$3 = require('./modules/lips/index.js');
const index$4 = require('./modules/makeup/index.js');
const index = require('./modules/skin/index.js');
const index$7 = require('./modules/softlight/index.js');
const index$2 = require('./modules/teeth/index.js');
const background = require('bnb_js/background');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

const background__default = /*#__PURE__*/_interopDefaultLegacy(background);

bnb.log(`\n\nMakeup API version: ${"1.0.0-23ee05d84f9e8a024d762947123a8b86e4c9492d"}\n`);

const Skin = new index.Skin();
const Eyes = new index$1.Eyes();
const Teeth = new index$2.Teeth();
const Lips = new index$3.Lips();
const Makeup = new index$4.Makeup();
const Eyelashes = new index$5.Eyelashes();
const Hair = new index$6.Hair();
const Softlight = new index$7.Softlight();
const Filter = new index$8.Filter();

const FaceMorph = new index$9.FaceMorph();

const EyeBagsRemoval = new index$a.EyeBagsRemoval();

Object.defineProperty(exports, 'Background', {
	enumerable: true,
	get: function () {
		return background__default['default'];
	}
});
exports.EyeBagsRemoval = EyeBagsRemoval;
exports.Eyelashes = Eyelashes;
exports.Eyes = Eyes;
exports.FaceMorph = FaceMorph;
exports.Filter = Filter;
exports.Hair = Hair;
exports.Lips = Lips;
exports.Makeup = Makeup;
exports.Skin = Skin;
exports.Softlight = Softlight;
exports.Teeth = Teeth;
