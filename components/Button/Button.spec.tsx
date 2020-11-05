import React from 'react';
import renderer from 'react-test-renderer';
import { Button } from '.';

it('Button renders correctly', () => {
  const tree = renderer
    .create(<Button renderingContext={{
      id: 'test',
      item: {
        fields: {
          link: {
            url: "/",
            text: "click me"
          }
        }
      }
    }} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});