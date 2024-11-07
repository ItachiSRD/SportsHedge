import { Text } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import TextInput from '.';

describe('TextInput Component', () => {
  it('should call onChange callback when text is entered', () => {
    const onChangeMock = jest.fn();
    const { queryByPlaceholderText } = render(<TextInput onChangeText={onChangeMock} placeholder='input' />);
    const inputElement = queryByPlaceholderText('input');
    const inputValue = 'TestInput';
    fireEvent.changeText(inputElement!, inputValue);
    expect(onChangeMock).toHaveBeenCalledWith(inputValue);
  });
    
  it('should display error message when error prop is provided', () => {
    const { queryByText } = render(<TextInput status="error" statusMsg="Error" />);
    const errorElement = queryByText('Error');
    expect(errorElement).toBeTruthy();
  });

  it('should not display error message when error prop is not provided', () => {
    const { queryByText } = render(<TextInput />);
    const errorElement = queryByText('Error');
    expect(errorElement).toBeFalsy();
  });

  it('should display success message when success prop is provided', () => {
    const { queryByText } = render(<TextInput status="succces" statusMsg="Success" />);
    const successElement = queryByText('Success');
    expect(successElement).toBeTruthy();
  });

  it('should not display success message when success prop is not provided', () => {
    const { queryByText } = render(<TextInput />);
    const successElement = queryByText('Success');
    expect(successElement).toBeFalsy();
  });

  it('should show prefix when prefix provided', () => {
    const prefix = <Text>prefix</Text>;
    const { queryByText } = render(<TextInput prefix={prefix} />);
    const prefixElem = queryByText('prefix');
    expect(prefixElem).toBeTruthy();
  });
  
  it('should not show prefix when prefix not provided', () => {
    const { queryByText } = render(<TextInput />);
    const prefixElem = queryByText('prefix');
    expect(prefixElem).toBeFalsy();
  });

  it('should show suffix when suffix provided', () => {
    const suffix = <Text>suffix</Text>;
    const { queryByText } = render(<TextInput prefix={suffix} />);
    const suffixElem = queryByText('suffix');
    expect(suffixElem).toBeTruthy();
  });
  
  it('should not show suffix when suffix not provided', () => {
    const { queryByText } = render(<TextInput />);
    const suffixElem = queryByText('suffix');
    expect(suffixElem).toBeFalsy();
  });
});