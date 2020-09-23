const path = require('path');
require(path.resolve('helpers', 'prototypes'));
const testObject = {
  Property: 'value',
  extraData: 'extra',
};

describe('UNIT: Object.renameProperty()', () => {
  it('should return an object with a renamed property', async (done) => {
    const endObject = await testObject.renameProperty('Property', 'property');
    expect(endObject.Property).toBe(undefined);
    expect(endObject.property).toBe('value');
    done();
  });
});
