import { useState, useRef } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { Modal, Portal, TextInput, Appbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import { fonts } from '../../../utility/auth';
import { styles as outerStyles } from '../../../../assets/css/styles';


function ForgotPasswordScreen({ visibleVal, setVisibleVal }) {

    const [forgotData, setForgotData] = useState({
        isLoading: false,
        mail: true,
        email: '',
        responseError: '',
        successRes: '',
        showText: 'show'
    });

    const [errors, setErrors] = useState({});
    const emailRef = useRef(null);
    const { isLoading, email, mail } = forgotData;

    const onFocus = () => {
        let { errors = {} } = forgotData;
        for (let name in errors) {
            let ref = this[name];
            if (ref && ref.isFocused()) {
                delete errors[name];
            }
        }
        setErrors({ errors });
    }

    const validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    const handleChange = (name, value) => {
        setForgotData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const onSubmit = () => {
        console.log("onSubmit ----------")
        let newErrors = {};
        const email = forgotData.email || '';
        if (!email.trim()) {
            console.log("trim-------")
            newErrors.email = 'Required*';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Email address is not valid.';
        }
        setErrors(newErrors);
        console.log("newErrors----------", newErrors)
        return newErrors;
    };

    const verifyEmailHandler = () => {
        let errorObj = onSubmit();
        if (Object.keys(errorObj).length === 0) {
            makeRemoteRequest();
        }
    };

    const makeRemoteRequest = () => {
        console.log("forgotData Email----", forgotData.email)
        // this.setState({ isLoading: true });  
        // fetch(`${apiUrl}/account/forgotpassword`, {
        //   method: 'POST',
        //   headers: {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(this.state.email)
        // })
        // .then((response) => {
        //   if (response.status === 200) {
        //     return response.json();
        //   }
        // })
        // .then((res) => {
        //   let errors = {};   
        //   responseError = '';   
        //   if (res === 'true') {
        //     this.setState({ mail: false, isLoading: false });
        //     //this.props.navigator.dismissModal();
        //    } else {  
        //     errors['email']= 'Please enter your registered email address.';
        //     this.setState({ mail: true, errors, isLoading: false });
        //   }      
        // })
        // .catch((error) => {
        //   this.setState({        
        //     isLoading: false 
        //   });
        //   console.log(error.message);
        // });
    };

    const hideModal = () => {
        setErrors({});
        setVisibleVal(false)
    }
    return (
        <Portal>
            <Modal visible={visibleVal} contentContainerStyle={styles.containerStyle}>
                <Appbar.Header style={styles.closeForgot}>
                    <Appbar.Action icon={() => <Ionicons name="close" size={24} color="#00bac9" />} onPress={hideModal} />
                </Appbar.Header>
                <ScrollView style={styles.headerContainer} keyboardShouldPersistTaps='always'>
                    <View style={styles.forgotContainer}>
                        <Text style={styles.forgotHeading}>Reset your password</Text>
                        <Text style={{ fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular', textAlign: 'center' }}>Please enter your registered email to reset your password. You will receive a reset password link on your registered email.</Text>
                    </View>
                    <View style={styles.textcontainer}>
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
                            style={[outerStyles.lightText, outerStyles.inputField, { fontFamily: fonts.regular, width: '100%' }]}
                            theme={{
                                colors: {
                                    primary: '#00bac9'
                                },
                            }} />
                        {errors.email && (<Text style={outerStyles.inputError}>{errors.email}</Text>)}
                    </View>

                    <View style={styles.btnContainer}>
                        <TouchableOpacity
                            onPress={verifyEmailHandler}
                            style={styles.btnOuter}
                        >
                            <Text style={styles.btnText}>Reset Password</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Modal>
        </Portal>
    );

}

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 15
    },
    closeForgot: {
        justifyContent: 'flex-end',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        overflow: 'hidden',
    },
    headerContainer: {
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    forgotContainer: {
        marginHorizontal: 20,
        alignItems: 'center'
    },
    forgotHeading: {
        textAlign: 'center',
        fontSize: 30,
        marginBottom: 10,
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    textcontainer: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    btnContainer: {
        alignItems: 'center',
        marginVertical: 20
    },
    btnOuter: {
        width: '60%',
        margin: 5,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#00bac9',
        borderRadius: 30,
    },
    btnText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
});