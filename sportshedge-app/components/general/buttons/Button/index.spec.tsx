import { render, fireEvent, screen } from '@testing-library/react-native';
import Button from '.';

describe('Button', () => {
  it('should call the `onPress` prop when it is clicked', () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress} title="Click me!" />);
    const button = screen.getByRole('button');
    fireEvent.press(button);
    expect(onPress).toBeCalled();
  });

  it('button should be disabled when `disabled` prop passed', () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress} disabled title="Click me!" />);
    const button = screen.getByRole('button');
    fireEvent.press(button);
    expect(onPress).not.toBeCalled();
  });

  it('loading indicator should be shown when passed `loading` prop', () => {
    render(<Button loading title="Click me!" />);
    const loader = screen.getByTestId('loader');
    expect(loader).toBeTruthy();
  });

  it('loading indicator should not be shown when `loading` prop not passed', () => {
    render(<Button title="Click me!" />);
    const loader = screen.queryByTestId('loader');
    expect(loader).toBeFalsy();
  });
});
