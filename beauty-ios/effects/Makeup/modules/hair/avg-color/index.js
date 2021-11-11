'use strict';

const index$1 = require('./blur/index.js');
const index = require('./accumulate/index.js');

const AvgColor = (texture, _mask) => {
  let sample = texture;

  sample = index$1.Blur(sample, 10);

  return index.Accumulate(sample, 0)
};

exports.AvgColor = AvgColor;
