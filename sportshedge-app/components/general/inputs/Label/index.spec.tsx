import { fireEvent, render, screen } from '@testing-library/react-native';
import Label from '.';

describe('Label component', () => {
  it('should render the label text', () => {
    render(<Label title='Label' />);
    const text = screen.queryByText('Label');
    expect(text).toBeTruthy();
  });

  it('should not render the badge when required is false', () => {
    render(<Label title='Label' />);
    const text = screen.queryByTestId('badge');
    expect(text).toBeFalsy();
  });
  
  it('should render the badge when required is set to true', () => {
    render(<Label required title='Label' />);
    const text = screen.queryByTestId('badge');
    expect(text).toBeTruthy();
  });

  it('should not render the icon when icon source not passed', () => {
    render(<Label title='Label' />);
    const text = screen.queryByTestId('icon');
    expect(text).toBeFalsy();
  });

  it('should render the icon when icon source passed', () => {
    render(<Label iconSrc={require('../../../../assets/icon.png')} title='Label' />);
    const text = screen.queryByTestId('icon');
    expect(text).toBeTruthy();
  });
  
  it('should call the icon press handler', () => {
    const onPress = jest.fn();
    render(<Label iconSrc={require('../../../../assets/icon.png')} onIconPress={onPress} title='Label' />);
    const iconButton = screen.queryByTestId('icon');
    fireEvent.press(iconButton);
    expect(onPress).toBeCalled();
  });

  it('should not render the helper text when helper text is not passed', () => {
    render(<Label title='Label' />);
    const text = screen.queryByText('helper');
    expect(text).toBeFalsy();
  });
  
  it('should render the helper text when helper text is passed', () => {
    render(<Label title='Label' helperText='helper' />);
    const text = screen.queryByText('helper');
    expect(text).toBeTruthy();
  });
});