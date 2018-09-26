import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createSerializer } from 'enzyme-to-json';
import sinon from 'sinon';
import { NavBar } from './NavBar';

// Set the default serializer for Jest to be from enzyme-to-json
// This produces an easier to read serialized format.
expect.addSnapshotSerializer(createSerializer({ mode: 'deep' }));

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

describe('NavBar', () => {
  it('should render two menuitem if unauthenticated', () => {
    const auth = {
      isLoaded: false,
      isEmpty: true
    };
    const wrapper = shallow(<NavBar auth={auth} />);
    expect(wrapper.find('MenuItem')).toHaveLength(2);
  });
});
