/**
 * Login/Sign Up/Forgot Password Screen
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles } from '@theme/';

// Components
import { Alerts, Card, Spacer, Text, Button } from '@ui/';
import TcombTextInput from '@components/tcomb/TextInput';

/* Facebook login ============================================================== */

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;
// function

const loginFB = function(error, result) {
  if (error) {
    alert("login has error: " + result.error);
  } else if (result.isCancelled) {
    alert("login is cancelled.");
  } else {
    AccessToken.getCurrentAccessToken().then(
      (data) => {
        let accessToken = data.accessToken;
        const responseInfoCallback = (error, result) => {
          if (error) {
            console.log(error);
            alert('Error fetching data: ' + error.toString());
          } else {
            console.log(result);
            Actions.signUpWithFacebook(result);
          }
        }
        const infoRequest = new GraphRequest('/me', {
          accessToken: accessToken,
          parameters: {
            fields: {
              string: 'email,name,first_name,middle_name,last_name,picture'
            }
          }
        }, responseInfoCallback);
        // Start the graph request.
        new GraphRequestManager().addRequest(infoRequest).start();
      }
    )
  }
};

const LoginFacebook = React.createClass({
  render: function() {
    return (
      <View style={[AppStyles.flex1, AppStyles.centerAligned],{backgroundColor: '#406abe',height:40}}>
        <LoginButton
          publishPermissions={["publish_actions email"]}
          onLoginFinished={(error,result) => loginFB(error, result)}
          onLogoutFinished={() => alert("logout.")}/>
      </View>
    );
  }
});
/* Component ==================================================================== */
let redirectTimeout;
class AuthForm extends Component {
  static componentName = 'Login';

  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      nickname: PropTypes.string,
      id: PropTypes.string,
    }),
    submit: PropTypes.func,
    onSuccessfulSubmit: PropTypes.func,
    formType: PropTypes.oneOf(['login','loginfb', 'signUp', 'passwordReset', 'updateProfile']),
    formFields: PropTypes.arrayOf(PropTypes.string),
    buttonTitle: PropTypes.string,
    successMessage: PropTypes.string,
    introTitle: PropTypes.string,
    introText: PropTypes.string,
  }

  static defaultProps = {
    user: null,
    submit: null,
    onSuccessfulSubmit: null,
    formType: 'login',
    formFields: ['Email', 'Password'],
    buttonTitle: 'Login',
    successMessage: 'Awesome, you\'re now logged in',
    introTitle: null,
    introText: null,
  }

  constructor(props) {
    super(props);

    props.user.firstname = props.first_name;
    props.user.lastname = props.last_name;
    props.user.email = props.email;
    props.user.id = props.id;
    props.user.nickname = props.name;
    // What fields should exist in the form?
    const formFields = {};
    if (props.formFields.indexOf('Email') > -1) formFields.Email = this.validEmail;
    if (props.formFields.indexOf('Password') > -1) formFields.Password = this.validPassword;
    if (props.formFields.indexOf('ConfirmPassword') > -1) formFields.ConfirmPassword = this.validPassword;
    if (props.formFields.indexOf('FirstName') > -1) formFields.FirstName = FormValidation.String;
    if (props.formFields.indexOf('LastName') > -1) formFields.LastName = FormValidation.String;

    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',
      },
      form_fields: FormValidation.struct(formFields),
      form_values: {
        Email: (props.user && props.user.email) ? props.user.email : '',
        FirstName: (props.user && props.user.firstname) ? props.user.firstname : '',
        LastName: (props.user && props.user.lastname) ? props.user.lastname : '',
        Id: (props.user && props.user.id) ? props.user.id : '',
        Nickname:(props.user && props.user.nickname) ? props.user.nickname : '',
      },
      options: {
        fields: {
          Email: {
            template: TcombTextInput,
            error: 'Please enter a valid email',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          Password: {
            template: TcombTextInput,
            error: 'Passwords must be more than 8 characters and contain letters and numbers',
            clearButtonMode: 'while-editing',
            secureTextEntry: true,
          },
          ConfirmPassword: {
            template: TcombTextInput,
            error: 'Your passwords must match',
            clearButtonMode: 'while-editing',
            secureTextEntry: true,
          },
          FirstName: {
            template: TcombTextInput,
            error: 'Please enter your first name',
            clearButtonMode: 'while-editing',
          },
          LastName: {
            template: TcombTextInput,
            error: 'Please enter your first name',
            clearButtonMode: 'while-editing',
          },
        },
      },
    };
  }

  componentDidMount = async () => {
    // Pre-populate any details stored in AsyncStorage
    const values = await this.getStoredCredentials();

    if (values !== null && values.email && values.password) {
      this.setState({
        form_values: {
          ...this.state.form_values,
          Email: values.email || '',
          Password: values.password || '',
          FirstName: (props.user && props.user.firstname) ? props.user.firstname : '',
          LastName: (props.user && props.user.lastname) ? props.user.lastname : '',
          Id: (props.user && props.user.id) ? props.user.id : '',
          Nickname:(props.user && props.user.nickname) ? props.user.nickname : '',
        },
      });
    }
  }

  componentWillUnmount = () => clearTimeout(redirectTimeout);

  /**
    * Get user data from AsyncStorage to populate fields
    */
  getStoredCredentials = async () => {
    const values = await AsyncStorage.getItem('api/credentials');
    const jsonValues = JSON.parse(values);

    return jsonValues;
  }

  /**
    * Email Validation
    */
  validEmail = FormValidation.refinement(
    FormValidation.String, (email) => {
      const regularExpression = /^.+@.+\..+$/i;

      return regularExpression.test(email);
    },
  );

  /**
    * Password Validation - Must be 6 chars long
    */
  validPassword = FormValidation.refinement(
    FormValidation.String, (password) => {
      if (password.length < 8) return false; // Too short
      if (password.search(/\d/) === -1) return false; // No numbers
      if (password.search(/[a-zA-Z]/) === -1) return false; // No letters
      return true;
    },
  );

  /**
    * Password Confirmation - password fields must match
    * - Sets the error and returns bool of whether to process form or not
    */
  passwordsMatch = (form) => {
    const error = form.Password !== form.ConfirmPassword;

    this.setState({
      options: FormValidation.update(this.state.options, {
        fields: {
          ConfirmPassword: {
            hasError: { $set: error },
            error: { $set: error ? 'Passwords don\'t match' : '' },
          },
        },
      }),
      form_values: form,
    });

    return error;
  }

  /**
    * Handle Form Submit
    */
  handleSubmit = () => {
    // Get new credentials and update
    const formData = this.form.getValue();
    // Check whether passwords match
    if (formData && formData.Password && formData.ConfirmPassword) {
      const passwordsDontMatch = this.passwordsMatch(formData);
      if (passwordsDontMatch) return false;
      this.setState({
        form_values: {
          ...this.state.form_values,
          Password: formData.Password || '',
          ConfirmPassword: formData.ConfirmPassword,
        },
      });
    }

    // Form is valid
    if (formData) {
      if (formData.Email !== '') {
        this.setState({ form_values: formData }, () => {
        this.setState({ resultMsg: { status: 'One moment...' } });

        // Scroll to top, to show message
        if (this.scrollView) this.scrollView.scrollTo({ y: 0 });

        if (this.props.submit) {
          this.props.submit(formData).then(() => {
            this.setState({
              resultMsg: { success: this.props.successMessage },
            }, () => {
              // If there's another function to fire on successful submit
              // eg. once signed up, let's log them in - pass the Login function
              // through as the onSuccessfulSubmit prop
              if (this.props.onSuccessfulSubmit) {
                return this.props.onSuccessfulSubmit(formData, true)
                  .then(() => {
                    Actions.app({ type: 'reset' });
                    Actions.pop();
                  }).catch(err => this.setState({ resultMsg: { error: err.message } }));
              }

              // Timeout to ensure success message is seen/read by user
              redirectTimeout = setTimeout(() => {
                Actions.app({ type: 'reset' });
                Actions.pop();
              }, 500);

              return true;
            });
          }).catch(err => this.setState({ resultMsg: { error: err.message } }));
        } else {
          this.setState({ resultMsg: { error: 'Submit function missing' } });
        }
        });
      } else {
        this.setState({ resultMsg: { status: 'One moment...' } });

        // Scroll to top, to show message
        if (this.scrollView) this.scrollView.scrollTo({ y: 0 });

        if (this.props.submit) {
          this.props.submit(this.state.form_values).then(() => {
            this.setState({
              resultMsg: { success: this.props.successMessage },
            }, () => {
              // If there's another function to fire on successful submit
              // eg. once signed up, let's log them in - pass the Login function
              // through as the onSuccessfulSubmit prop
              if (this.props.onSuccessfulSubmit) {
                return this.props.onSuccessfulSubmit(this.state.form_values, true)
                  .then(() => {
                    Actions.app({ type: 'reset' });
                    Actions.pop();
                  }).catch(err => this.setState({ resultMsg: { error: err.message } }));
              }

              // Timeout to ensure success message is seen/read by user
              redirectTimeout = setTimeout(() => {
                Actions.app({ type: 'reset' });
                Actions.pop();
              }, 500);

              return true;
            });
          }).catch(err => this.setState({ resultMsg: { error: err.message } }));
        } else {
          this.setState({ resultMsg: { error: 'Submit function missing' } });
        }
      }
    }


    return true;
  };

  render = () => {
    const Form = FormValidation.form.Form;

    return (
      <ScrollView
        automaticallyAdjustContentInsets={false}
        ref={(a) => { this.scrollView = a; }}
        style={[AppStyles.container]}
      >
        <Card>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.state.resultMsg.success}
            error={this.state.resultMsg.error}
          />
          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />

          <Spacer size={20} />

          <Button title={this.props.buttonTitle} onPress={this.handleSubmit} />

          <Spacer size={10} />

          { this.props.formType === 'signUp' &&
          <LoginFacebook />
          }
          {this.props.formType === 'login' &&
          <View>
            <TouchableOpacity onPress={Actions.passwordReset}>
              <Text p style={[AppStyles.textCenterAligned, AppStyles.link]}>
                Forgot Password
              </Text>
            </TouchableOpacity>

            <Spacer size={10} />

            <Text p style={[AppStyles.textCenterAligned]}>
              - or -
            </Text>

            <Button outlined title={'Sign Up'} onPress={Actions.signUp} />
          </View>
          }
        </Card>

        <Spacer size={60} />
      </ScrollView>
    );
  }
}

/* Export Component ==================================================================== */
export default AuthForm;
