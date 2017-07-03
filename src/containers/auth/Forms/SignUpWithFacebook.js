/**
 * Sign Up facebook Container
 *
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/user/actions';

// The component we're mapping to
import FormRender from './FormView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  user: state.user,
  formType: 'loginfb',
  formFields: ['Password', 'ConfirmPassword'],
  buttonTitle: 'Login',
  successMessage: 'Awesome, you\'re now logged in',
});

// Any actions to map to the component?
const mapDispatchToProps = {
  submit: UserActions.signUpWithFb,
  onSuccessfulSubmit: UserActions.login,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormRender);
