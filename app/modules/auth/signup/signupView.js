import React, {Component} from 'react';
import {
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import {Text, Icon} from 'react-native-elements';
import i18nService from "../../../utils/i18n/i18nService";
import TextInput from "../../../components/textInput/textInput";
import LargeButton from "../../../components/largeButton/largeButton";
import IconsType from "../../../constants/IconsType";
import {textInputStyle} from "../../../components/textInput/textInputStyle";
import iconsService from "../../../utils/iconsService";
import ModalOverlay from "../../../components/overlay/overlay";
import FlashMessage from "react-native-flash-message";
import messageService from "../../../utils/messageService";
import commonService from "../../../services/commonService";
import asyncStorageService from "../../../utils/asyncStorageService";
import userService from "../../../utils/userService";
import NavigationRoutes from "../../../constants/NavigationRoutes";
import LinearGradient from "react-native-linear-gradient";
import NavigationBack from "../../../components/navigationBack/navigationBack";
import CommonConstant from "../../../constants/CommonConstant";
import ax from "../../../utils/axios";

export default class SignupView extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = this.iconPrefix = iconsService.getIconPrefix();
        this.state = {
            signup: {
                email: '',
                name: '',
                password: '',
                confirmPassword: ''
            },
            emailValid: false,
            nameErrorMessage: false,
            passwordErrorMessage: false,
            confirmPasswordErrorMessage: false,

            showPasswordTooltip: false,
            showNameTooltip: false,
            showAlerts: false
        };
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.setState({
            showPasswordTooltip: false,
            showNameTooltip: false
        })
    }

    async initialize() {
        this.notificationToken = await asyncStorageService.getItem('fcmToken');
    }

    handleEmailChange = (text) => {
        let signup = this.state.signup;
        signup.email = text;
        const isEmailValid = commonService.validateEmail(text);
        console.log(isEmailValid);
        this.setState({
            signup: signup,
            emailValid: isEmailValid
        });
    };

    handleNameChange = (text) => {
        let signup = this.state.signup;
        signup.name = text;
        const isNameValid = text && text.length < 6 ? false : true;
        this.setState({
            signup: signup,
            nameValid: isNameValid
        });
    };

    handlePasswordChange = (text) => {
        let signup = this.state.signup;
        signup.password = text;
        const isPasswordValid = commonService.validatePassword(text);
        this.setState({
            signup: signup,
            passwordValid: isPasswordValid
        });
    };

    handleConfirmPasswordChange = (text) => {
        let signup = this.state.signup;
        signup.confirmPassword = text;
        const isConfirmPasswordValid = commonService.validatePassword(text);
        this.setState({
            signup: signup,
            confirmPasswordValid: isConfirmPasswordValid
        });
    };

    back = () => {
        this.props.navigation.goBack();
    };

    render() {
        const {
            isLoading,
            error,
            data,
            user,
            signup
        } = this.props;

        const {email, name, password, confirmPassword} = this.state.signup;
        const {emailValid, passwordValid, nameValid, confirmPasswordValid, showPasswordTooltip, showNameTooltip} = this.state;
        return (
            <LinearGradient style={{...sharedStyles.safeView}}
                            colors={[sharedStyles.gradient.start, sharedStyles.gradient.end]}>
                <SafeAreaView style={sharedStyles.safeView}>
                    <KeyboardAvoidingView style={sharedStyles.safeView} behavior={(Platform.OS === 'ios') ? 'padding' : null} enabled>
                        <NavigationBack onPress={() => {
                            this.back();
                        }}/>
                        <View style={sharedStyles.centredColumn}>
                            <View style={{width: '90%'}}>
                                <TextInput name={'email'}
                                           placeholder={i18nService.t('email')}
                                           disabled={isLoading || user}
                                           icon={'mail'}
                                           value={email}
                                           textContentType={'username'}
                                           maxLength={CommonConstant.MAX_EMAIL_LENGTH}
                                           keyboardType={'email-address'}
                                           valid={emailValid}
                                           onChangeText={this.handleEmailChange}
                                />
                                <TextInput ref={(ref) => this.nameRef = ref}
                                           name={'name'}
                                           placeholder={i18nService.t('name')}
                                           disabled={isLoading || user}
                                           icon={'contact'}
                                           value={name}
                                           maxLength={CommonConstant.MAX_NAME_LENGTH}
                                           valid={nameValid}
                                           onChangeText={this.handleNameChange}
                                           rightIcon={
                                               <Icon
                                                   type={IconsType.Ionicon}
                                                   name={`${this.iconPrefix}-${'help-circle-outline'}`}
                                                   size={24}
                                                   color={textInputStyle.leftIconColor}
                                                   underlayColor={'transparent'}
                                                   onPress={() => {
                                                       this.setState({
                                                           showNameTooltip: !showNameTooltip
                                                       })
                                                   }}
                                               />
                                           }
                                />
                                <TextInput ref={(ref) => this.passwordRef = ref}
                                           name={'password'}
                                           placeholder={i18nService.t('password')}
                                           textContentType={'password'}
                                           disabled={isLoading || user}
                                           icon={'lock'}
                                           secureTextEntry={true}
                                           value={password}
                                           maxLength={CommonConstant.MAX_PASSWORD_LENGTH}
                                           valid={passwordValid}
                                           onChangeText={this.handlePasswordChange}
                                           rightIcon={
                                               <Icon
                                                   type={IconsType.Ionicon}
                                                   name={`${this.iconPrefix}-${'help-circle-outline'}`}
                                                   size={24}
                                                   color={textInputStyle.leftIconColor}
                                                   underlayColor={'transparent'}
                                                   onPress={() => {
                                                       this.setState({
                                                           showPasswordTooltip: !showPasswordTooltip
                                                       })
                                                   }}
                                               />
                                           }
                                />
                                <TextInput name={'confirmPassword'}
                                           placeholder={i18nService.t('confirm_password')}
                                           disabled={isLoading || user}
                                           icon={'lock'}
                                           secureTextEntry={true}
                                           value={confirmPassword}
                                           maxLength={CommonConstant.MAX_PASSWORD_LENGTH}
                                           valid={confirmPasswordValid}
                                           onChangeText={this.handleConfirmPasswordChange}
                                />
                            </View>
                            <View style={{width: '90%'}}>
                                <LargeButton title={i18nService.t('sign_up')}
                                             buttonStyle={{marginTop: 20}}
                                             loading={isLoading || user}
                                             disabled={!emailValid || !nameValid || !passwordValid || !confirmPasswordValid || password !== confirmPassword}
                                             onPress={async () => {
                                                 const currentPassword = this.state.signup.password;
                                                 const currentLocale = i18nService.getCurrentLocale();
                                                 ax.defaults.headers.common['Authorization'] = ``;
                                                 const result = await signup({
                                                     ...this.state.signup,
                                                     notificationToken: this.notificationToken,
                                                     language: currentLocale
                                                 });
                                                 if(result.error) {
                                                     const errorText = i18nService.t(`validation_message.${result.message}`);
                                                     messageService.showError(this.refs.flashMessage, errorText);
                                                 } else {
                                                     const user = {
                                                         id: result.source.key,
                                                         email: result.source.data.email,
                                                         name: result.source.data.name[0],
                                                         password: currentPassword,
                                                         token: result.source.data.token,
                                                         tracking: false,
                                                         avatar: result.source.data.avatar,
                                                         language: currentLocale,
                                                         verified: false,
                                                         confidentiality: {
                                                             showPositionOnMap: true,
                                                             showPositionOnlyToContacts: true,
                                                             accepted: false
                                                         }
                                                     };
                                                     userService.setUser(user);
                                                     this.props.navigation.navigate(NavigationRoutes.AUTH_LOGIN, {
                                                         email: user.email,
                                                         password: user.password
                                                     });
                                                 }
                                             }}
                                />
                            </View>

                            <ModalOverlay
                                isVisible={showNameTooltip}
                                onBackdropPress={()=> {
                                    this.setState({
                                        showNameTooltip: !showNameTooltip
                                    })
                                }}>
                                <Text>{i18nService.t('validation_message.name_should_be_more_symbols', {symbols: CommonConstant.MIN_NAME_LENGTH})}</Text>
                            </ModalOverlay>
                            <ModalOverlay
                                isVisible={showPasswordTooltip}
                                onBackdropPress={()=> {
                                    this.setState({
                                        showPasswordTooltip: !showPasswordTooltip
                                    })
                                }}>
                                <Text style={{fontSize: 16}}>{i18nService.t('validation_message.password_requirements', {symbols: CommonConstant.MIN_PASSWORD_LENGTH})}</Text>
                            </ModalOverlay>
                        </View>
                    </KeyboardAvoidingView>
                    <FlashMessage position="top" ref={'flashMessage'}/>
                </SafeAreaView>
            </LinearGradient>
        );
    }
}
