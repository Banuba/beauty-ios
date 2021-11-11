'use strict';

function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }const castArray = (value) =>
  (Array.isArray(value) ? value : [value]); 

const id = (prefix = "" ) => {
  const idx = _nullishCoalesce(id.prefixes.get(prefix), () => ( 0));

  id.prefixes.set(prefix, idx + 1);

  return `${prefix}${idx}` 
};

id.prefixes = new Map();

// https://github.com/ai/nanoevents


















function createNanoEvents() {
  return {
    events: {},
    emit(event, ...args) {
_optionalChain([(this.events[event] || []), 'optionalAccess', _ => _.forEach, 'call', _2 => _2((i) => i(...args))]);
    },
    on(event, cb) {
_optionalChain([(this.events[event] = this.events[event] || []), 'optionalAccess', _3 => _3.push, 'call', _4 => _4(cb)]);
      return () => (this.events[event] = _optionalChain([(this.events[event] || []), 'optionalAccess', _5 => _5.filter, 'call', _6 => _6((i) => i !== cb)]))
    },
  }
}

exports.castArray = castArray;
exports.createNanoEvents = createNanoEvents;
exports.id = id;
