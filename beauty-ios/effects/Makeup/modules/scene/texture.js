'use strict';

const utils = require('./utils.js');

function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }
const assets = bnb.scene.getAssetManager();





// built in

class Camera  {
  

  constructor() {
    const camera = assets.findImage("camera");

    if (!camera) throw new Error("Unable to find 'camera' image which is mandatory")

    this.$$ = camera;
  }
}

// custom

class LUT  {
  
  

  constructor(filename, onLoad) {
    const name = utils.id("_scene_lut");
    const lut = _nullishCoalesce(assets.findImage(name), () => ( assets.createImage(name, bnb.ImageType.LUT)));

    this.$$ = lut;

    if (filename) this.load(filename, onLoad);
  }

  load(filename, onLoad) {
    this.filename = filename;

    this.$$.asWeightedLut().load(filename);
    this.$$.asWeightedLut().setWeight(1);

    if (onLoad) onLoad();

    return this
  }
}

class Image  {
  
  

  constructor(filename, onLoad) {
    const name = utils.id("_scene_image");
    const image = assets.findImage(name) || assets.createImage(name, bnb.ImageType.TEXTURE);

    this.$$ = image;

    if (filename) this.load(filename, onLoad);
  }

  get width() {
    return this.$$.asTexture().getWidth()
  }

  get height() {
    return this.$$.asTexture().getHeight()
  }

  load(filename, onLoad) {
    this.filename = filename;

    this.$$.asTexture().load(filename);

    if (onLoad) onLoad();

    return this
  }
}

class SegmentationMask


{
  

  constructor( type) {this.type = type;
    const name = `_scene_seg_mask_${type}`;
    let mask = assets.findImage(name);

    // compatibility with converted legacy effects
    if (!mask) {
      const query = type === "L_EYE" ? "left_eye" : type === "R_EYE" ? "right_eye" : type;
      mask = assets.findImage(query.toLocaleLowerCase());
    }

    if (!mask) {
      mask = assets.createSegmentationMask(name, bnb.SegmentationMaskType[type]);
    }

    this.$$ = mask;
  }

  enable() {
    this.$$.asSegmentationMask().setActive(true);
  }

  disable() {
    this.$$.asSegmentationMask().setActive(false);
  }
}

exports.Camera = Camera;
exports.Image = Image;
exports.LUT = LUT;
exports.SegmentationMask = SegmentationMask;
