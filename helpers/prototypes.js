module.exports.default = !((Object) => {
  // Add Object.renameProperty if it doesn't exist
  if (!('renameProperty' in Object.prototype)) {
    Object.defineProperty(Object.prototype, 'renameProperty', {
      writable: false, // Cannot alter this property
      enumerable: false, // Will not show up in a for-in loop.
      configurable: false, // Cannot be deleted via the delete operator
      value: function (_old, _new) {
        // First check to make sure they're not the same
        if (_old !== _new) {
          // Make sure _old exists, and _new DOES NOT
          if (_old in this && !(_new in this)) {
            this[_new] = this[_old];
            delete this[_old];
          }
        }
        return this;
      },
    });
  }
})(Object);
