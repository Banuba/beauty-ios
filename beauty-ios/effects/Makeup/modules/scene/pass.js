'use strict';

const geometry = require('./geometry.js');
const mesh = require('./mesh.js');
const renderTarget = require('./render-target.js');

function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }



class Pass  {
  

  get $$() {
    return this._target.texture.$$
  }

  

  constructor(material, geometry$1, options) {
    if (!geometry.isGeometry(geometry$1)) {
      options = _nullishCoalesce(geometry$1, () => ( {}));
      geometry$1 = new geometry.PlaneGeometry();
    }

    this._target = new renderTarget.RenderTarget({ offscreen: true, ...options });
    this._target.add(new mesh.Mesh(geometry$1, material));
  }
}

exports.Pass = Pass;
