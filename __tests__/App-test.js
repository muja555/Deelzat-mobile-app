/**
 * @format
 */

import 'react-native';
import React from 'react';
import Root from 'modules/root/components/root/root.component';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<Root />);
});
