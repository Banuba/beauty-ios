'use strict';

const makeup = require('./makeup.js');

Object.assign(globalThis, makeup.m);
/* Feel free to add your custom code below */
FaceMorph.eyes(1.2)
FaceMorph.nose(1)
FaceMorph.face(1)
Teeth.whitening(1)

Makeup.eyeliner("0 0 0 0.7")
Makeup.contour("0.3 0.1 0.1 0.6")
Makeup.highlighter("0.75 0.74 0.74 0.4")
Makeup.blushes("0.7 0.1 0.2 0.5")

// Foundation
Skin.color("0.73 0.39 0.08 0.3")
Skin.softening(1)

// Lips
Lips.matt("0.56 0 0 0.5")

// From release v1.4.0 only
Brows.color("0 0 0 1")