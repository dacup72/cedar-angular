module.exports = {
  name: 'select-autocomplete',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/select-autocomplete',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
