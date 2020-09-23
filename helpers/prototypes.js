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

  // Add Object.isSeeded if it doesn't exist
  if (!('isSeeded' in Object.prototype)) {
    Object.defineProperty(Object.prototype, 'isSeeded', {
      writable: false, // Cannot alter this property
      enumerable: false, // Will not show up in a for-in loop.
      configurable: false, // Cannot be deleted via the delete operator
      value: function (_status = true) {
        _status = _status == false ? false : true;

        let returnValue = this;

        // Let's see if it's an array of objects...
        if (Array.isArray(this)) {
          returnValue = this.map((item) => {
            if (item instanceof Object) {
              item.seeded = _status;
            }
            return item;
          });
        } else {
          // If it's just an object...
          returnValue.seeded = _status;
        }

        return returnValue;
      },
    });
  }
})(Object);
