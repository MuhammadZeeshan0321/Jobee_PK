import axios from 'axios';
import { useState, useRef, useEffect, useContext } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken, Profile, Settings } from 'react-native-fbsdk-next';

import { styles } from '../../../assets/css/styles';
import { fonts } from '../../utility/auth';
import useSignInModel from '../../models/screenModels/SignInModels';
import { apiUrl } from '../../utility/auth';
import ForgotPasswordScreen from './ForgotPassword/ForgotPassword';
import Screen from '../../Constants/Screen';
import { AppContext } from '../../store/app-context';

function SignInScreen({ navigation }) {

    const [signInData, setSignInData] = useState({
        callFrom: '',
        isLoading: false,
        isdisable: false,
        email: '',
        password: '',
        showPassword: true,
        showText: 'Show',
        responseError: null,
        user: null,
        isLoggedIn: false,
        cartHide: false
    });
    const [errors, setErrors] = useState({});
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const [visible, setVisible] = useState(false);
    const mounted = useRef(true);

    const { isLoading, email, password, showPassword, showText, responseError, cartHide } = signInData;

    const screenAnalytics = new Screen();

    const appCtx = useContext(AppContext);

    useEffect(() => {
        const setObjects = () => {
            if (appCtx.callFrom !== undefined) {
                appCtx.setCallFrom(appCtx.callFrom);
                // appCtx.setPropsObject(appCtx.propsObject);
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
        setObjects();
        initAnalytics();
        initFacebookLogin();
        initGoogleSignIn();

        return () => {
            mounted.current = false;
        };
    }, [mounted]);


    const onFocus = () => {
        let { errors = {} } = signInData;
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
    };

    const handleChange = (name, value) => {
        setSignInData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const onSubmit = () => {
        console.log("onSubmit ----------")
        let newErrors = {};
        const { email, password } = signInData;
        if (!email.trim()) {
            newErrors.email = 'Should not be empty';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Email address is not valid.';
        }

        if (!password.trim()) {
            newErrors.password = 'Should not be empty';
        }
        setErrors(newErrors);
        console.log("newErrors----------", newErrors)
        return newErrors;
    };


    const updatePasswordIcon = () => {
        setSignInData(prevState => ({
            ...prevState,
            cartHide: true,
            showPassword: !prevState.showPassword,
            showText: prevState.showText === 'Show' ? 'Hide' : 'Show'
        }));
    }

    const createAccountHandler = () => {
        console.log("createAccountHandler-----");
        let errorObj = onSubmit();
        if (Object.keys(errorObj).length === 0) {
            makeRemoteRequest();
        }
    };

    const makeRemoteRequest = async () => {
        setSignInData(prevState => ({
            ...prevState,
            isLoading: true
        }));


        /* Check internet connection */
        const netInfoState = await NetInfo.fetch();
        if (!netInfoState.isConnected) {
            Alert.alert("No Internet Access", "No Internet connection. Make sure Wi-Fi or cellular data is turned on, then try again.");
            setSignInData(prevState => ({
                ...prevState,
                isLoading: false
            }));
        }
        else {
            const dataObject = JSON.stringify({
                email: signInData.email,
                password: signInData.password,
            });

            try {
                const response = await axios.post(`${apiUrl}/account/login`,
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

                    if (resData === 'Invalid login attempt.') {
                        setSignInData(prevState => ({
                            ...prevState,
                            isLoading: false,
                            responseError: resData
                        }));
                    }
                    else {
                        console.log("resData.accessTokenResponse----------", resData)

                        if (resData.userType == 1) {
                            appCtx.storeUserInfo(resData);
                            appCtx.setappLogin(true);
                            const screenAnalytics = new Screen();
                            switch (appCtx.callFrom) {
                                case 'findjobs':
                                    screenAnalytics.googleAnalyticsView('/Find Jobs');
                                    navigation.goBack();
                                    break;
                                case 'applications':
                                    screenAnalytics.googleAnalyticsView('/Applications');
                                    navigation.goBack();
                                    break;
                                case 'myprofile':
                                    screenAnalytics.googleAnalyticsView('/User Profile');
                                    navigation.goBack();
                                    break;
                                default:
                                    navigation.goBack();
                                    break;
                            }
                            setSignInData(prevState => ({
                                ...prevState,
                                isLoading: false
                            }));

                        }
                        else {
                            setSignInData(prevState => ({
                                ...prevState,
                                isLoading: false
                            }));
                            Alert.alert('Cannot login as Employer.');
                        }
                    }
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                setSignInData(prevState => ({
                    ...prevState,
                    isLoading: false,
                    responseError: errorMessage
                }));
                Alert.alert("error in signin request", errorMessage)
            }

        }
    };

    const externalLoginRequest = async (dataObject) => {
        const userDetail = JSON.parse(dataObject);
        console.log("userDetail----------", userDetail);
        setSignInData(prevState => ({
            ...prevState,
            isLoading: false
        }));

        try {
            const response = await axios.post(`${apiUrl}/account/loginexternal`,
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
                const resData = JSON.parse(response.config.data);
                console.log("resData---------------", resData);

                if (resData.ExternalAccessToken === undefined) {
                    setSignInData(prevState => ({
                        ...prevState,
                        isLoading: false,
                    }));
                    GoogleSignin.signOut((data) => {
                        setSignInData(prevState => ({
                            ...prevState,
                            responseError: 'This email is not registered with us.'
                        }));
                    });             
                }
                else {
                    console.log("resData.ExternalAccessToken----------", resData)
                        appCtx.storeUserInfo(resData);
                        appCtx.setappLogin(true);
                        const screenAnalytics = new Screen();
                        switch (appCtx.callFrom) {
                            case 'findjobs':
                                screenAnalytics.googleAnalyticsView('/Find Jobs');
                                navigation.goBack();
                                break;
                            case 'applications':
                                screenAnalytics.googleAnalyticsView('/Applications');
                                navigation.goBack();
                                break;
                            case 'myprofile':
                                screenAnalytics.googleAnalyticsView('/User Profile');
                                navigation.goBack();
                                break;
                            default:
                                navigation.goBack();
                                break;
                        }
                        setSignInData(prevState => ({
                            ...prevState,
                            isLoading: false
                        }));
                }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
            setSignInData(prevState => ({
                ...prevState,
                isLoading: false,
                responseError: errorMessage
            }));
            Alert.alert("Error in signin request using google/facebook", errorMessage)
        }
    }

    const googleSignIn = async () => {
        setSignInData(prevState => ({
            ...prevState,
            isLoading: true,
            isdisable: true
        }));
        const netInfoState = await NetInfo.fetch();
        if (netInfoState.isConnected) {
            try {
                await GoogleSignin.signOut();
                const data = await GoogleSignin.signIn();
                console.log("data-----", data)

                const user = data.user;
                console.log("user---------", user)

                const dataObject = JSON.stringify({
                    UserID: user.id,
                    Email: user.email,
                    Provider: 'google',
                    ExternalAccessToken: data.idToken
                });
                console.log("dataObject--------", dataObject)


                externalLoginRequest(dataObject);
            } catch (error) {
                if (error.code === 'CANCELED') {
                    setSignInData(prevState => ({
                        ...prevState,
                        isLoading: false,
                        isdisable: false
                    }));
                    Alert.alert(error.message);
                } else {
                    setSignInData(prevState => ({
                        ...prevState,
                        isLoading: false,
                        isdisable: false
                    }));
                }
            }

        }
        else {
            Alert.alert("No Internet Access", "No Internet connection. Make sure Wi-Fi or cellular data is turned on, then try again.");
            setSignInData(prevState => ({
                ...prevState,
                isLoading: false
            }));
        }
    };

    const forgotPasswordEventHandler = () => {
        setVisible(true);
    };

    const onFacebookSigninPress = async () => {
        setSignInData(prevState => ({
            ...prevState,
            isLoading: true,
            isdisable: true
        }));
        const netInfoState = await NetInfo.fetch();
        console.log("button is clicked---------");

        // if (!netInfoState.isConnected) {
        //     setSignInData(prevState => ({
        //         ...prevState,
        //         isLoading: false,
        //         isdisable: false
        //     }));
        //     Alert.alert("No Internet Access", "No Internet connection. Make sure Wi-Fi or cellular data is turned on, then try again.");
        //     // this.setState({ isLoading: false });
        // } else {
        //     console.log("enter into function -----------------")

        //     const loginBehavior = Platform.OS === 'ios' ? 'web' : 'native_with_fallback';
        //     LoginManager.setLoginBehavior(loginBehavior);

        //     let permissions = ['email', 'user_friends', 'public_profile'];

        //     LoginManager.logInWithPermissions(permissions).then(
        //         function (result) {
        //             if (result.isCancelled) {
        //                 console.log('Login cancelled');
        //                 setSignInData(prevState => ({
        //                     ...prevState,
        //                     isLoading: false,
        //                     isdisable: false
        //                 }));
        //             } else {
        //                 let grantPermissions = result.grantedPermissions.toString();
        //                 console.log('Login success with permissions: ' + grantPermissions);
        //                 login;
        //             }
        //         },
        //         function (error) {
        //             console.log('Login fail with error: ' + error);
        //         }
        //     );
        // }
    }

    const login = async () => {
        const accessToken = await AccessToken.getCurrentAccessToken();
        if (!accessToken) {
            console.error('Failed to get access token');
            setSignInData(prevState => ({
                ...prevState,
                isLoading: false,
                isdisable: false
            }));
            return;
        }

        const profile = await Profile.getCurrentProfile();
        if (!profile) {
            console.error('Failed to get user profile');
            setSignInData(prevState => ({
                ...prevState,
                isLoading: false,
                isdisable: false
            }));
            return;
        }

        // Send accessToken and profile information to your backend
        const user = {
            name: profile.name,
            userID: profile.userID,
            email: profile.email,
            accessToken: accessToken.accessToken,
        };

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

    const signupButtonEventHandler = () => {
        navigation.navigate('Signup');
    };

    return (
        <>
            {isLoading ?
                <View style={{ paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#CDE0CE', backgroundColor: '#fff', height: '100%', justifyContent: 'center' }}>
                    <ActivityIndicator animating size="large" />
                </View>
                :
                <ScrollView style={styles.container1} keyboardShouldPersistTaps='always'>
                    <View style={[styles.centerAlign, { marginVertical: 7 }]}>
                        <Text style={[styles.heading1, styles.centerText, { fontFamily: fonts.bold }]}>Sign In</Text>
                        <Text style={[styles.lightText, styles.centerText, { fontFamily: fonts.regular }]}>
                            Please log into your account to continue.
                        </Text>
                        <Text style={[styles.whiteLightText, { fontFamily: fonts.regular, color: signInData.responseError === '' ? '#fff' : 'red' }]}>{signInData.responseError}</Text>
                    </View>

                    <KeyboardAvoidingView behavior="padding">
                        <View style={{ paddingHorizontal: 30 }}>
                            <TextInput
                                label="Email"
                                value={email}
                                ref={emailRef}
                                onFocus={onFocus}
                                onKeyPress={onFocus}
                                error={errors.email}
                                onChangeText={(value) => handleChange('email', value)}
                                keyboardType='email-address'
                                autoCapitalize='none'
                                autoCorrect={false}
                                style={[styles.lightText, styles.inputField, { fontFamily: fonts.regular, width: '100%' }]}
                                theme={{
                                    colors: {
                                        primary: '#00bac9'
                                    },
                                }} />
                            {errors.email && (<Text style={styles.inputError}>{errors.email}</Text>)}

                            <View style={styles.spacebetweenRow}>
                                <View style={{ width: '100%' }}>
                                    <TextInput
                                        label="Password"
                                        password={true}
                                        onTouchStart={() => setSignInData(prevState => ({ ...prevState, cartHide: false }))}
                                        caretHidden={cartHide}
                                        secureTextEntry={showPassword}
                                        autoCapitalize='none'
                                        value={password}
                                        ref={passwordRef}
                                        onFocus={onFocus}
                                        onKeyPress={onFocus}
                                        error={errors.password}
                                        onChangeText={(value) => handleChange('password', value)}
                                        style={[styles.lightText, styles.inputField, { fontFamily: fonts.regular }]}
                                        theme={{
                                            colors: {
                                                primary: '#00bac9'
                                            },
                                        }} />
                                </View>
                                {signInData.password !== '' && (
                                    <TouchableOpacity
                                        onPress={updatePasswordIcon}
                                        style={{ marginLeft: -32, marginTop: 28, height: 30 }}
                                    >
                                        {signInData.showText === 'Show' && (<Ionicons name="eye-off" size={24} color="#606060" />)}
                                        {signInData.showText === 'Hide' && (<Ionicons name="eye" size={24} color="#606060" />)}
                                    </TouchableOpacity>
                                )}
                            </View>
                            {errors.password && (<Text style={styles.inputError}>{errors.password}</Text>)}

                            <View style={{ paddingVertical: 8 }}>
                                <TouchableOpacity
                                    onPress={forgotPasswordEventHandler}
                                >
                                    <Text style={[styles.lightText, styles.rightText, { fontFamily: fonts.regular, color: '#00bac9' }]}>Forgot password?</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>

                    <View style={[styles.centerAlign, { marginVertical: 3 }]}>
                        <TouchableOpacity
                            onPress={createAccountHandler}
                            style={{ width: '60%', paddingVertical: 10, backgroundColor: '#00bac9', borderRadius: 30, }}
                        >
                            <Text style={[styles.whiteLightText, styles.centerText, { fontFamily: fonts.regular }]}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.centerAlign, { marginVertical: 3 }]}>
                        <TouchableOpacity
                            onPress={onFacebookSigninPress}
                            disabled={signInData.isdisable}
                            style={{ width: '60%', paddingVertical: 8, backgroundColor: '#fff', borderRadius: 30, borderWidth: 1, borderColor: '#00bac9', }}
                        >
                            <Text style={[styles.lightText, styles.centerText, { fontFamily: fonts.regular, color: '#00bac9', }]}>Sign in with Facebook</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.centerAlign, { marginVertical: 3 }]}>
                        <TouchableOpacity
                            onPress={googleSignIn}
                            disabled={signInData.isdisable}
                            style={{ width: '60%', paddingVertical: 8, backgroundColor: '#fff', borderRadius: 30, borderWidth: 1, borderColor: '#ff6f6f' }}
                        >
                            <Text style={[styles.lightText, styles.centerText, { fontFamily: fonts.regular, color: '#ff6f6f' }]}>Sign in with Google +</Text>
                        </TouchableOpacity>
                    </View>
                    {appCtx.callFrom !== 'jobdetail' &&
                        <View style={[styles.centerRow, { paddingVertical: 5 }]}>
                            <Text style={[styles.lightText, { fontFamily: fonts.regular }]}>Don't have an account?</Text>
                            <TouchableOpacity
                                onPress={signupButtonEventHandler}
                                style={{ borderColor: '#00bac9' }}
                            >
                                <Text style={[styles.lightText, { fontFamily: fonts.regular, color: '#00bac9', paddingHorizontal: 5 }]}>Sign up</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </ScrollView>
            }

            {/* Forgot Password modal Screen */}
            <ForgotPasswordScreen visibleVal={visible} setVisibleVal={setVisible} />

        </>
    );


}

export default SignInScreen;