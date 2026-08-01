import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Action from './components/Action';

jest.mock('./components/FadeUpOnScroll', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

jest.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <div data-testid="google-login" />,
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

describe('Action authentication screen', () => {
  test('shows the forgot password form when the link is clicked', async () => {
    render(<Action />);

    await userEvent.click(screen.getByText(/forgot password/i));

    expect(
      screen.getByRole('heading', { name: /forgot password/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /send reset link/i })
    ).toBeInTheDocument();
  });
});
