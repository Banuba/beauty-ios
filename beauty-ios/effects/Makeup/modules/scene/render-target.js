'use strict';

const geometry = require('./geometry.js');
const mesh = require('./mesh.js');
const utils = require('./utils.js');

function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

const assets = bnb.scene.getAssetManager();









class Attachment  {
  

  constructor({
    filtering,
    info = {},
  }





 = {}) {
    const name = utils.id("_scene_attachment");
    const attachment = assets.findImage(name) || assets.createImage(name, bnb.ImageType.ATTACHMENT);

    if (typeof filtering !== "undefined")
      attachment.asAttachment().setFilteringMode(bnb.TextureFilteringMode[filtering]);
    if (typeof info.load !== "undefined") {
      const _info = attachment.asAttachment().getInfo();
      _info.loadBehaviour = bnb.AttachmentLoadOp[info.load];
      attachment.asAttachment().setInfo(_info);
    }
    if (typeof info.store !== "undefined") {
      const _info = attachment.asAttachment().getInfo();
      _info.storedBehaviour = bnb.AttachmentStoreOp[info.store];
      attachment.asAttachment().setInfo(_info);
    }

    this.$$ = attachment;
  }

  get width() {
    return this.$$.asAttachment().getWidth()
  }

  get height() {
    return this.$$.asAttachment().getHeight()
  }
}

class RenderTarget {
  

  constructor({ target, width, height, scale, filtering, info, offscreen = false } = {}) {
    if (!target) {
      const targetName = offscreen
        ? utils.id("_scene_offscreen_render_target")
        : utils.id("_scene_render_target");
      target = assets.findRenderTarget(targetName);

      if (!target) {
        target = assets.createRenderTarget(targetName);
        const attachment = new Attachment({ filtering, info });
        target.addAttachment(attachment.$$);
      }
    }

    if (typeof width !== "undefined" && typeof height !== "undefined")
      target.setExtent(width, height);

    if (typeof scale !== "undefined") target.setScale(scale);

    this.$$ = target;
  }

  get texture() {
    const [attachment] = this.$$.getAttachments();
    return { $$: attachment }
  }

  add(...meshes) {
    const layerName = utils.id("_scene_layer");
    let layer = bnb.scene.getLayer(layerName);

    if (!layer) {
      layer = bnb.Layer.create(layerName);
      const target = this.$$;
      const list = bnb.scene.getRenderList();
      const tasks = [];

      // copy the old tasks
      for (let i = 0, size = list.getTasksCount(); i < size; ++i) {
        tasks.push({
          layer: list.getTaskLayer(i),
          target: list.getTaskTarget(i),
          subgeoms: list.getTaskSubGeometries(i),
        });
      }

      const idx = (() => {
        if (target.getName().includes("_offscreen_")) {
          for (let i = 0; i < tasks.length; ++i) {
            const task = tasks[i];
            if (task.target.getName().includes("_offscreen_")) continue
            else return i
          }
        }
        return tasks.length
      })();

      tasks.splice(idx, 0, { layer, target });

      // recreate render list
      list.clear();

      for (const task of tasks) {
        if (_nullishCoalesce(_optionalChain([task, 'access', _ => _.subgeoms, 'optionalAccess', _2 => _2.length]), () => ( 0 > 0))) list.addTask(task.layer, task.target, task.subgeoms);
        else list.addTask(task.layer, task.target);
      }
    }

    for (const mesh$1 of meshes) {
      const face = mesh.getFace(mesh$1);
      let root = face ? FaceTracker.for(face) : bnb.scene.getRoot();

      const entityName = utils.id("_scene_entity");
      let entity = root.findChildByName(entityName);
      if (!entity) {
        entity = bnb.scene.createEntity(entityName);
        entity.addIntoLayer(layer);
        root.addChild(entity);
      }

      const component = entity.getComponent(bnb.ComponentType.MESH_INSTANCE);
      let instance = component && component.asMeshInstance();
      if (!instance) {
        instance = bnb.MeshInstance.create();
        instance.setMesh(mesh$1.geometry.$$);

        const materials = utils.castArray(mesh$1.material);
        const subgeometries = instance.getMesh().getSubGeometries();

        for (let i = 0; i < materials.length; ++i) {
          const material = materials[i];
          const subgeometry = subgeometries[i];

          if (!subgeometry) break

          instance.setSubGeometryMaterial(subgeometry, material.$$);
        }

        instance.setVisible(mesh$1.visible());

        entity.addComponent(instance.asComponent());
      }

      mesh$1.onVisibilityChange((isVisible) => instance.setVisible(isVisible));

      if (mesh.isFaceMesh(mesh$1)) {
        for (const m of mesh$1.geometry.morphings) {
          const layerName = utils.id("_scene_face_morphings_layer");
          let layer = bnb.scene.getLayer(layerName);
          if (!layer) {
            layer = bnb.Layer.create(layerName);
            bnb.scene.getRenderList().addTask(layer, this.$$);
          }

          const morphName = m.$$.getName();
          let morph = assets.findMorph(morphName);
          if (!morph) {
            const type =
              m instanceof geometry.BeautyMorphing ? bnb.MorphingType.BEAUTY : bnb.MorphingType.MESH;
            morph = assets.createMorph(morphName, type);
            morph.setWarpMesh(m.$$);
          }

          const entityName = `${morphName}_face${mesh$1.geometry.index}`;
          let entity = root.findChildByName(entityName);
          if (!entity) {
            entity = bnb.scene.createEntity(entityName);
            entity.addIntoLayer(layer);
            root.addChild(entity);
          }

          const component = entity.getComponent(bnb.ComponentType.FACE_MORPHING);
          let morphing = component && component.asFaceMorphing();

          if (morphing) {
            if (m instanceof geometry.BeautyMorphing) {
              const beauty = morphing.asBeautyMorphing();
              m.weight("eyes", beauty.getEyesWeight());
              m.weight("nose", beauty.getNoseWeight());
              m.weight("face", beauty.getFaceWeight());
            } else {
              m.weight(morphing.getWeight());
            }
          } else {
            const type =
              m instanceof geometry.BeautyMorphing ? bnb.MorphingType.BEAUTY : bnb.MorphingType.MESH;
            morphing = bnb.FaceMorphing.create(type);
            morphing.setMorphing(morph);
            morphing.setVisible(true);
            entity.addComponent(morphing.asComponent());
          }

          if (m instanceof geometry.BeautyMorphing) {
            const beauty = morphing.asBeautyMorphing();
            m.subscribe((weights) => {
              beauty.setEyesWeight(weights.eyes);
              beauty.setNoseWeight(weights.nose);
              beauty.setFaceWeight(weights.face);
              morphing.setVisible(Object.values(weights).some((w) => w !== 0));
            });
          } else {
            m.subscribe((value) => {
              morphing.setWeight(value);
              morphing.setVisible(value !== 0);
            });
          }
        }
      }
    }

    return this
  }
}

class FaceTracker {
  static for(mesh) {
    const root = bnb.scene.getRoot();
    const index = mesh.geometry.index;

    const entityName = `face_tracker${index}`;
    let entity = root.findChildByName(entityName);
    if (!entity) {
      entity = bnb.scene.createEntity(entityName);
      root.addChild(entity);
    }

    const component = entity.getComponent(bnb.ComponentType.FACE_TRACKER);
    let tracker = component && component.asFaceTracker();
    if (!tracker) {
      tracker = bnb.FaceTracker.create();

      const faceName = `face${index}`;
      let face = assets.findFace(faceName);
      if (!face) {
        face = assets.createFace(faceName);
        face.setFaceMesh(mesh.geometry.$$);
        face.setIndex(index);
      }

      tracker.setFace(face);
      entity.addComponent(tracker.asComponent());
    }

    return entity
  }
}

exports.Attachment = Attachment;
exports.RenderTarget = RenderTarget;
