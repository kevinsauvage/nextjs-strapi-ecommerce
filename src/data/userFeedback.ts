export const userFeedback = {
  addLinesToCart: {
    error: 'Something went wrong adding the item to the cart, please try again',
    success: 'Item correctly added to the cart',
  },
  login: {
    error: 'There was an error trying to login',
    success: 'You were successfully logged in',
  },
  logout: {
    error: 'An error occurred while logging out',
    success: 'You were successfully logged out',
  },
  missingFields: 'Fill in missing required fields',
  passwordDifferent: 'The password are different.',
  passwordLength: 'Your password must be at least 8 characters',
  register: {
    error: 'There was an error trying to register',
    success: 'You were successfully registered',
  },
  removeLinesFromCart: {
    error: 'Something went wrong removing the item from the cart, please try again',
    success: 'Item correctly removed from the cart',
  },
  resetPassword: {
    error: 'There was an error trying to reset your password',
    success: 'Your password was successfully reset, your are logged in',
  },
  sendRecoverEmail: {
    success: 'Your email was successfully sent',
  },
  updateLines: {
    error: 'Something went wrong updating the item in the cart, please try again',
    success: 'Item correctly updated in the cart',
  },
} as const;
