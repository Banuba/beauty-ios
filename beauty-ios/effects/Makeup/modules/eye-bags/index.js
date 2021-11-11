'use strict';

class EyeBagsRemoval {
  enable() {
    bnb.scene.enableRecognizerFeature(bnb.FeatureID.EYE_BAGS);
    return this
  }

  disable() {
    bnb.scene.disableRecognizerFeature(bnb.FeatureID.EYE_BAGS);
    return this
  }
}

exports.EyeBagsRemoval = EyeBagsRemoval;
