import { fireEvent, render } from '@testing-library/react-native';
import TextArea from '.';

describe('TextArea Component', () => {
  it('should call onChange callback when text is entered', () => {
    const onChangeMock = jest.fn();
    const { queryByPlaceholderText } = render(<TextArea onChangeText={onChangeMock} placeholder='input' />);
    const inputElement = queryByPlaceholderText('input');
    const inputValue = 'TestInput';
    fireEvent.changeText(inputElement!, inputValue);
    expect(onChangeMock).toHaveBeenCalledWith(inputValue);
  });
    
  it('should display error message when error prop is provided', () => {
    const { queryByText } = render(<TextArea status="error" statusMessage="Error" />);
    const errorElement = queryByText('Error');
    expect(errorElement).toBeTruthy();
  });

  it('should not display error message when error prop is not provided', () => {
    const { queryByText } = render(<TextArea />);
    const errorElement = queryByText('Error');
    expect(errorElement).toBeFalsy();
  });

  it('should show char count when maxchars set', () => {
    const { queryByPlaceholderText, queryByText } = render(<TextArea placeholder='input' maxChars={100} />);
    const inputElement = queryByPlaceholderText('input');
    const inputValue = 'Test';
    fireEvent.changeText(inputElement!, inputValue);
    const countElem = queryByText('(4/100)');
    expect(countElem).toBeTruthy();
  });
  
  it('should not show char count when maxchars not set', () => {
    const { queryByPlaceholderText, queryByText } = render(<TextArea placeholder='input' />);
    const inputElement = queryByPlaceholderText('input');
    const inputValue = 'Test';
    fireEvent.changeText(inputElement!, inputValue);
    const countElem = queryByText('(4/100)');
    expect(countElem).toBeFalsy();
  });
});