import { render, screen } from '@testing-library/react-native';
import Badge from '.';

describe('Badge component', () => {
  it('should not render the text when type dot', () => {
    render(<Badge text='text' />);
    const text = screen.queryByText('text');
    expect(text).toBeFalsy();
  });

  it('should render the text when type dot', () => {
    render(<Badge type='text' text='text' />);
    const text = screen.queryByText('text');
    expect(text).toBeTruthy();
  });
});