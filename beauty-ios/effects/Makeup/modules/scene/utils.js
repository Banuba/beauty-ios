'use strict';

const castArray = (value) => (Array.isArray(value) ? value : [value]);
const id = (prefix = "") => {
    var _a;
    const idx = (_a = id.prefixes.get(prefix)) !== null && _a !== void 0 ? _a : 0;
    id.prefixes.set(prefix, idx + 1);
    return `${prefix}${idx}`;
};
id.prefixes = new Map();
function createNanoEvents() {
    return {
        events: {},
        emit(event, ...args) {
            var _a;
            (_a = (this.events[event] || [])) === null || _a === void 0 ? void 0 : _a.forEach((i) => i(...args));
        },
        on(event, cb) {
            var _a;
            (_a = (this.events[event] = this.events[event] || [])) === null || _a === void 0 ? void 0 : _a.push(cb);
            return () => { var _a; return (this.events[event] = (_a = (this.events[event] || [])) === null || _a === void 0 ? void 0 : _a.filter((i) => i !== cb)); };
        },
    };
}

exports.castArray = castArray;
exports.createNanoEvents = createNanoEvents;
exports.id = id;
