
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { ScrollView, View, Text, TouchableOpacity, Platform, ActivityIndicator, Alert, KeyboardAvoidingView } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { TextInput, Title } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LoginManager, AccessToken, Profile, Settings } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { styles } from '../../../assets/css/styles';
import { fonts, apiUrl } from '../../utility/auth';
import useSignUpModel from '../../models/screenModels/SignUpModels';
import Screen from '../../Constants/Screen';
import { AppContext } from '../../store/app-context';

function SignupScreen({navigation}) {

    const [signUpData, setSignUpData] = useState({
        isLoading: false,
        isdisable: false,
        cartHide: false,
        responseError: '',
        showText: 'Show',
        showPassword: true,
        signupUser: {
            firstName: '',
            lastName: '',
            mobile: '',
            email: '',
            password: '',
            isFromSignup: true,
        },
        UserInfo: {},
        //callFrom :''
    });
    const [errors, setErrors] = useState({});
    const firstnameRef = useRef(null);
    const lastnameRef = useRef(null);
    const mobileRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const mounted = useRef(true);

    const { isLoading, cartHide, showPassword, signupUser: { firstName, lastName, mobile, email, password } } = signUpData;

    const appCtx = useContext(AppContext);

    useEffect(() => {
        const screenAnalytics = new Screen();

        const setObjects = () => {
            if (appCtx.callFrom !== undefined) {
                appCtx.setCallFrom(appCtx.callFrom);
                appCtx.setPropsObject(appCtx.propsObject);
            }
        }

        const initAnalytics = async () => {
            screenAnalytics.googleAnalyticsView('/Sign Up');
        };

        const initFacebookLogin = () => {
            Settings.initializeSDK();
        };

        const initGoogleSignIn = async () => {
            try {
                console.log("in useEffect------------")
                await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
                GoogleSignin.configure({
                    scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
                    //   androidClientId: '144171313367-1vadhljk1pkc07nk9n6epu58bp3cjskc.apps.googleusercontent.com',
                    iosClientId: '144171313367-27ijca2qqktkmv2sb1lvbupfvfihjjbj.apps.googleusercontent.com', //'442525301195-9ep3i0bko0tmu29ua8ah65hjh8mri5a8.apps.googleusercontent.com', // only for iOS
                    webClientId: '144171313367-vgrv3mrtpelj9n6789jn5l09v912oj94.apps.googleusercontent.com', //'442525301195-i2crm67khvlvreg4f4o30mfqi32r71p8.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
                    //offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
                    //hostedDomain: '', // specifies a hosted domain restriction
                    forceCodeForRefreshToken: true, // if you need offline access
                    prompt: 'select_account', // force account selection
                    forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
                    //accountName: '', // [Android] specifies an account name on the device that should be used
                });
            } catch (err) {
                console.log('Play services error', err.code);
                Alert.alert('Play services error', err.message);

            }
        };

        // const handleEvent = (err, data) => {
        //     // Handle the event data
        // };
        setObjects();
        initAnalytics();
        initFacebookLogin();
        initGoogleSignIn();

        return () => {
            mounted.current = false;
        };
    }, [mounted]);

    const onFocus = () => {
        let { errors = {} } = signUpData.signupUser;
        if (Object.keys(errors).length > 0) {
            for (let name in errors) {
                let ref = this[name];
                if (ref && ref.isFocused()) {
                    delete errors[name];
                }
            }
            setErrors({ errors });
        }
    };

    const validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    const handleChange = (name, value) => {
        setSignUpData((prevState) => ({
            ...prevState,
            signupUser: {
                ...prevState.signupUser,
                [name]: value,
            },
        }));
    };

    const onSubmit = () => {
        console.log("onSubmit ----------")
        let newErrors = {};
        const { firstName, lastName, mobile, email, password } = signUpData.signupUser;
        const fields = { firstName, lastName, mobile, email, password };

        Object.keys(fields).forEach((key) => {
            const value = fields[key].trim();
            if (!value) {
                newErrors[key] = 'Should not be empty';
            } else if (key === 'mobile' && !/^\+?\d+$/.test(value)) {
                newErrors[key] = 'Only numbers and + sign allowed in mobile';
            } else if (key === 'email' && !validateEmail(value)) {
                newErrors[key] = 'Email address is not valid';
            } else if (key === 'password' && value.length < 8) {
                newErrors[key] = 'Too short password, min length is 8';
            }
        });
        setErrors(newErrors);
        return newErrors;
    };

    const passwordShowHideHandler = () => {
        setSignUpData(prevState => ({
            ...prevState,
            cartHide: true,
            showPassword: !prevState.showPassword,
            showText: prevState.showText === 'Show' ? 'Hide' : 'Show'
        }));
    };

    const SigninEventHandler = () => {
        appCtx.setPropsObject(null);
        navigation.navigate('Signin');
    };

    function initUser(result) {
        const event = result;
        fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + event.credentials.token)
            .then((response) => response.json())
            .then((json) => {
                debugger;
                const fName = json.name.split(' ')[0];
                const lName = json.name.split(' ').length >= 3 ? `${json.name.split(' ')[1]} ' ' ${json.name.split(' ')[2]}` : json.name.split(' ')[1]
                setSignUpData(prevState => ({
                    ...prevState,
                    signupUser: {
                        firstName: fName,
                        lastName: lName,
                        mobile: '',
                        email: json.email,
                        password: '',
                        isFromSignup: true,
                    }
                }));

                const dataObject = JSON.stringify({
                    UserName: json.name,
                    UserID: event.credentials.userId,
                    Email: json.email,
                    Provider: 'facebook',
                    ExternalAccessToken: event.credentials.token,
                    usertype: 1
                });
                externalSignupRequest(dataObject);
            })
            .catch(() => {
                setSignUpData(prevState => ({
                    ...prevState,
                     isLoading: false
                }));
                reject('ERROR GETTING DATA FROM FACEBOOK')
            })
    }

    const callExternalWithSetState = (event) => {
        const fName = event.profile.name.split(' ')[0];
        const lName = event.profile.name.split(' ').length >= 3 ? `${event.profile.name.split(' ')[1]} ' ' ${event.profile.name.split(' ')[2]}` : event.profile.name.split(' ')[1]

        let signupUser = {
            firstName: fName,
            lastName: lName,
            mobile: '',
            email: event.profile.email,
            password: '',
            isFromSignup: true,
        }
        const dataObject = JSON.stringify({
            UserName: event.profile.name,
            UserID: event.credentials.userId,
            Email: event.profile.email,
            Provider: 'facebook',
            ExternalAccessToken: event.credentials.token,
            usertype: 1
        });
        externalSignupRequest(dataObject, signupUser);
    }

    function _handleEvent(e, data) {
        // this.setState({isdisable: false});
        const result = e || data;
        if (data !== null) {
            if (Platform.OS === 'ios') {
                // this.setState({ isLoading: true });        
                if (result.profile === undefined) {
                    initUser(result);
                } else {
                    callExternalWithSetState(result);
                }
            } else {
                if (result.type === 'success' && result.profile) {
                    try {
                        result.profile = JSON.parse(result.profile);
                    } catch (err) {
                        // this.setState({ isLoading: false });
                        //console.warn('Could not parse facebook profile: ', result.profile);
                        Alert.alert(err.message);
                    }
                }
                if (result.eventName === 'onLogin' || result.eventName === 'onLoginFound') {
                    //this.setState({ isLoading: true });        
                    if (result.profile === undefined) {
                        initUser(result);
                    } else {
                        callExternalWithSetState(result);
                    }
                } else if (result.eventName === 'onLogout') {
                    // this.setState({
                    //     user: null,
                    //     isLoading: false
                    // });
                }

                if (result.eventName && appCtx?.hasOwnProperty(result.eventName)) {
                    const event = result.eventName;
                    delete result.eventName;
                    console.log('Triggering \'%s\' event', event);
                    appCtx[event](result);
                } else {
                    console.log('\'%s\' Event is not defined or recognized', result.eventName);
                }
            }
        } else {
            // this.setState({
            //     user: null,
            //     isLoading: false
            // });
        }
    }

    const createAccountHandler = async () => {
        console.log("createAccountHandler-----");

        let errorObj = onSubmit();
        if (Object.keys(errorObj).length === 0) {
            makeRemoteRequest();
        }
    };

    const makeRemoteRequest = async () => {
        setSignUpData(prevState => ({
            ...prevState,
            isLoading: true
        }));
        console.log("makeRemoteRequet call-------", signUpData.signupUser)

        const netInfoState = await NetInfo.fetch();
        if (!netInfoState.isConnected) {
            Alert.alert("No Internet Access", "No Internet connection. Make sure Wi-Fi or cellular data is turned on, then try again.");
            setSignUpData(prevState => ({
                ...prevState,
                isLoading: false
            }));
        } else {
            const dataObject = JSON.stringify({
                firstname: signUpData.signupUser.firstName,
                lastname: signUpData.signupUser.lastName,
                email: signUpData.signupUser.email,
                password: signUpData.signupUser.password,
                phonenumber: signUpData.signupUser.mobile,
                usertype: 1
            });
            console.log("dataObject after StringiFy-----", dataObject);

            try {
                const response = await axios.post(`${apiUrl}/account/register`,
                    dataObject,
                    {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log("reponse ", response)
                if (response.status === 200) {
                    const resData = JSON.parse(response.data);
                    console.log("resData---------------", resData);

                    if (resData.accessTokenResponse === null) {
                        let errors = {};
                        errors['email'] = resData.iResult.Errors[1];
                        setSignUpData(prevState => ({
                            ...prevState,
                            isLoading: false,
                        }));
                        setErrors({ errors });
                    } else {
                        console.log("resData.accessTokenResponse----------", resData.accessTokenResponse)
                        appCtx.storeUserInfo(resData.accessTokenResponse);
                        appCtx.setappLogin(true);

                        appCtx.setPropsObject(signUpData.signupUser);
                        setSignUpData(prevState => ({
                            ...prevState,
                            isLoading: false
                        }));

                        navigation.navigate('BasicProfile',{
                            screenTitle: 'Basic Profile'
                        });
                    }
                }
            } catch (error) {
                setSignUpData(prevState => ({
                    ...prevState,
                    isLoading: false,
                }));
                Alert.alert("error in signup request---------", error)
            }
        }
    }

    const googleSignUp = async () => {
        setSignUpData(prevState => ({
            ...prevState,
            isLoading: true,
            isdisable: true
        }));
        try {
            console.log("Enter into Google Signup-------")
            await GoogleSignin.signOut();
            const data = await GoogleSignin.signIn();
            console.log("data -----", data);
            const user = data.user;
            console.log("user -----", user);

            let signupUser = {
                firstName: user.givenName,
                lastName: user.familyName,
                mobile: '',
                email: user.email,
                password: '',
                isFromSignup: true,
            }
            console.log("SignupUser------", signupUser)

            const dataObject = JSON.stringify({
                UserName: user.name,
                UserID: user.id,
                Email: user.email,
                Provider: 'google',
                ExternalAccessToken: data.idToken,
                usertype: 1
            });
            console.log("dataObject--------", dataObject)

            externalSignupRequest(dataObject, signupUser);
        } catch (error) {
            if (error.code === 'CANCELED') {
                console.log("error in cancelled-------", error)
                setSignUpData(prevState => ({
                    ...prevState,
                    isLoading: false,
                    isdisable: false
                }));
                Alert.alert(error.message);
            } else {
                setSignUpData(prevState => ({
                    ...prevState,
                    isLoading: false,
                    isdisable: false
                }));
                console.log("error--------", error)
                Alert.alert(error.message);
            }
        }
    };

    const onFacebookSignupPress = async () => {
        setSignUpData(prevState => ({
            ...prevState,
            isdisable: true,
            isLoading: true
        }));
        const netInfoState = await NetInfo.fetch();
        console.log("button is clicked---------");

        if (!netInfoState.isConnected) {
            Alert.alert("No Internet Access", "No Internet connection. Make sure Wi-Fi or cellular data is turned on, then try again.");
            setSignUpData(prevState => ({
                ...prevState,
                isdisable: false,
                isLoading: false
            }));
        } else {
            console.log("enter into function -----------------")

            const loginBehavior = Platform.OS === 'ios' ? 'web' : 'native_with_fallback';
            LoginManager.setLoginBehavior(loginBehavior);

            let permissions = ['email', 'user_friends', 'public_profile'];

            LoginManager.logInWithPermissions(permissions).then(
                async function (result) {
                    if (result.isCancelled) {
                        console.log('Login cancelled');
                        setSignUpData(prevState => ({
                            ...prevState,
                            isdisable: false,
                            isLoading: false
                        }));
                    } else {
                        console.log(
                            'Login success with permissions: ' +
                            result.grantedPermissions.toString()
                        );
                        login;
                    }
                },
                function (error) {
                    console.log('Login fail with error: ' + error);
                }
            );
        }
    }
    const login = async () => {
        const accessToken = await AccessToken.getCurrentAccessToken();
        if (!accessToken) {
            setSignUpData(prevState => ({
                ...prevState,
                isdisable: false,
                isLoading: false
            }));

            console.error('Failed to get access token');
            return;
        }

        const profile = await Profile.getCurrentProfile();
        if (!profile) {
            setSignUpData(prevState => ({
                ...prevState,
                isdisable: false,
                isLoading: false
            }));
            console.error('Failed to get user profile');
            return;
        }

        // Send accessToken and profile information to your backend
        const user = {
            name: profile.name,
            userID: profile.userID,
            email: profile.email,
            accessToken: accessToken.accessToken,
        };

        //just for demo
        setSignUpData(prevState => ({
            ...prevState,
            isdisable: false,
            isLoading: false
        }));

        console.log("user--------------", user)
        // Call your backend API to handle signup/login
        // const response = await fetch('YOUR_BACKEND_URL', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(user),
        // });


        // const data = await response.json();
        // if (data.success) {
        //     // Handle successful signup/login
        //     console.log('User successfully signed up/logged in');
        // } else {
        //     // Handle error
        //     console.error('Error during signup/login: ', data.message);
        // }
    }
    // const login = (permissions) => {
    //     LoginManager.logInWithPermissions(
    //         permissions,
    //         (err, data) => _handleEvent(err, data)
    //     );
    // };

    const externalSignupRequest = async (dataObject, signupUser) => {
        console.log("dataObject in Signup by Google", dataObject);
        try {
            const response = await axios.post(`${apiUrl}/account/registerexternal`,
                dataObject,
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("response from api-------", response);

            if (response.status === 200) {
                const resData = JSON.parse(response.data);
                console.log("resData---------------", resData);

                if (resData.access_token === undefined) {
                    let _error = Array.isArray(resData.Error)
                    setSignUpData(prevState => ({
                        ...prevState,
                        isLoading: false,
                        responseError: _error ? resData.Error[0] : resData.Error
                    }));
                } else {
                    console.log("resData.accessTokenResponse----------", resData)

                    appCtx.storeUserInfo(resData);
                    appCtx.setappLogin(true);
                    setSignUpData(prevState => ({
                        ...prevState,
                        isLoading: false,
                        signupUser: signupUser
                    }));
                    // navigation.setOptions({
                    //     title: 'Basic Profile'
                    // });
                    appCtx.setPropsObject();

                    navigation.navigate('BasicProfile',{
                        screenTitle: 'Basic Profile'
                    });
                }
            }
        } catch (error) {
            setSignUpData(prevState => ({
                ...prevState,
                isLoading: false,
                responseError: error
            }));
            Alert.alert("error in Google signup request", error)
        }
    }

    return (
        <>
            {isLoading ?
                <View style={{ paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#CDE0CE', backgroundColor: '#fff', height: '100%', justifyContent: 'center' }}>
                    <ActivityIndicator animating size="large" />
                </View>
                :
                <ScrollView style={styles.container1} keyboardShouldPersistTaps='always' >
                    <View style={[styles.centerAlign, { marginVertical: 7, paddingHorizontal: 20 }]}>
                        <Text style={[styles.lightText, styles.centerText, { fontFamily: fonts.regular }]}>
                            Please create an account to continue.
                        </Text>
                        <Text style={[styles.whiteLightText, { fontFamily: fonts.regular, color: signUpData.responseError === '' ? '#fff' : 'red' }]}>{signUpData.responseError}</Text>
                    </View>

                    <KeyboardAvoidingView behavior='padding'>
                        <View style={{ paddingHorizontal: 20 }}>
                            <TextInput
                                label="First Name"
                                value={firstName}
                                ref={firstnameRef}
                                onFocus={onFocus}
                                onKeyPress={onFocus}
                                error={errors.firstName}
                                onChangeText={(value) => handleChange('firstName', value)}
                                autoCorrect={false}
                                style={[styles.lightText, styles.inputField,
                                {
                                    fontFamily: fonts.regular
                                }]}
                                theme={{
                                    colors: {
                                        primary: '#00bac9'
                                    },
                                }}
                            />
                            {errors.firstName && (<Text style={styles.inputError}>{errors.firstName}</Text>)}

                            <TextInput
                                label="Last Name"
                                value={lastName}
                                ref={lastnameRef}
                                onFocus={onFocus}
                                onKeyPress={onFocus}
                                error={errors.lastName}
                                onChangeText={(value) => handleChange('lastName', value)}
                                autoCorrect={false}
                                style={[styles.lightText, styles.inputField,
                                {
                                    fontFamily: fonts.regular
                                }]}
                                theme={{
                                    colors: {
                                        primary: '#00bac9'
                                    },
                                }}
                            />
                            {errors.lastName && (<Text style={styles.inputError}>{errors.lastName}</Text>)}

                            <TextInput
                                label="Mobile"
                                value={mobile}
                                ref={mobileRef}
                                onFocus={onFocus}
                                onKeyPress={onFocus}
                                error={errors.mobile}
                                onChangeText={(value) => handleChange('mobile', value)}
                                keyboardType='numeric'
                                style={[styles.lightText, styles.inputField,
                                {
                                    fontFamily: fonts.regular
                                }]}
                                theme={{
                                    colors: {
                                        primary: '#00bac9'
                                    },
                                }}
                            />
                            {errors.mobile && (<Text style={styles.inputError}>{errors.mobile}</Text>)}

                            <TextInput
                                label="Email"
                                value={email}
                                ref={emailRef}
                                onFocus={onFocus}
                                onKeyPress={onFocus}
                                error={errors.email}
                                onChangeText={(value) => handleChange('email', value)}
                                autoCorrect={false}
                                keyboardType='email-address'
                                autoCapitalize='none'
                                style={[styles.lightText, styles.inputField,
                                {
                                    fontFamily: fonts.regular
                                }]}
                                theme={{
                                    colors: {
                                        primary: '#00bac9'
                                    },
                                }}
                            />
                            {errors.email && (<Text style={styles.inputError}>{errors.email}</Text>)}

                            <View style={styles.spacebetweenRow}>
                                <View style={{ width: '100%' }}>
                                    <TextInput
                                        label="Password"
                                        password={true}
                                        onTouchStart={() => setSignUpData(prevState => ({ ...prevState, cartHide: false }))}
                                        caretHidden={cartHide}
                                        secureTextEntry={showPassword}
                                        value={password}
                                        ref={passwordRef}
                                        onFocus={onFocus}
                                        onKeyPress={onFocus}
                                        error={errors.password}
                                        onChangeText={(value) => handleChange('password', value)}
                                        autoCorrect={false}
                                        maxLength={30}
                                        style={[styles.lightText, styles.inputField,
                                        {
                                            fontFamily: fonts.regular
                                        }]}
                                        theme={{
                                            colors: {
                                                primary: '#00bac9'
                                            },
                                        }}
                                    />

                                    {errors.password && (<Text style={styles.inputError}>{errors.password}</Text>)}

                                </View>
                                {signUpData.signupUser.password !== '' && (
                                    <TouchableOpacity
                                        onPress={passwordShowHideHandler}
                                        style={{ marginLeft: -50, marginTop: 28, height: 30 }}
                                    >
                                        {signUpData.showText === 'Show' && (<Ionicons name="eye-off" size={24} color="#606060" />)}
                                        {signUpData.showText === 'Hide' && (<Ionicons name="eye" size={24} color="#606060" />)}

                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </KeyboardAvoidingView>

                    <View style={{ marginVertical: 20 }}>
                        <View style={[styles.centerAlign, { marginVertical: 3 }]}>
                            <TouchableOpacity
                                onPress={createAccountHandler}
                                style={{ width: '60%', paddingVertical: 10, backgroundColor: '#00bac9', borderRadius: 30, }}
                            >
                                <Text style={[styles.whiteLightText, styles.centerText, { fontFamily: fonts.regular }]}>Create Account</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.centerAlign, { marginVertical: 3 }]}>
                            <TouchableOpacity
                                onPress={onFacebookSignupPress}
                                disabled={signUpData.isdisable}
                                style={{ width: '60%', paddingVertical: 8, backgroundColor: '#fff', borderRadius: 30, borderWidth: 1, borderColor: '#00bac9', }}
                            >
                                <Text style={[styles.lightText, styles.centerText, { fontFamily: fonts.regular, color: '#00bac9', }]}>Sign up with Facebook</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.centerAlign, { marginVertical: 3 }]}>
                            <TouchableOpacity
                                onPress={googleSignUp}
                                disabled={signUpData.isdisable}
                                style={{ width: '60%', paddingVertical: 8, backgroundColor: '#fff', borderRadius: 30, borderWidth: 1, borderColor: '#ff6f6f' }}
                            >
                                <Text style={[styles.lightText, styles.centerText, { fontFamily: fonts.regular, color: '#ff6f6f' }]}>Sign up with Google +</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.centerRow, { paddingVertical: 10 }]}>
                            <Text style={[styles.lightText, { fontFamily: fonts.regular }]}>Already have an account?</Text>
                            <TouchableOpacity
                                onPress={SigninEventHandler}
                                style={styles.signinOuter}
                            >
                                <Text style={[styles.lightText, { fontFamily: fonts.regular, color: '#00bac9', paddingHorizontal: 5 }]}>Sign in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView >
            }
        </>
    );
}

export default SignupScreen;