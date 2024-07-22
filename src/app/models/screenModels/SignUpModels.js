import { useState } from "react";
import Screen from "../../Constants/Screen";

class SignUpModels extends Screen {
    constructor(props) {
        super(props);
        this.onFocus = this.onFocus.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.firstnameRef = this.updateRef.bind(this, 'firstname');
        this.lastnameRef = this.updateRef.bind(this, 'lastname');
        this.mobileRef = this.updateRef.bind(this, 'mobile');
        this.emailRef = this.updateRef.bind(this, 'email');
        this.passwordRef = this.updateRef.bind(this, 'password');

        this.state = {
            isLoading: false,
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
        };
        //Navigation.events().bindComponent(this);
    }

    onFocus = () => {
        let { errors = {} } = this.state;
        if (Object.keys(errors).length > 0) {
            for (let name in errors) {
                let ref = this[name];
                if (ref && ref.isFocused()) {
                    delete errors[name];
                }
            }
            this.setState({ errors });
        }
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    onSubmit = () => {
        let errors = {};
        ['firstname', 'lastname', 'mobile', 'email', 'password']
            .forEach((name) => {
                let value = this[name].value().trim();
                if (!value) {
                    errors[name] = 'Should not be empty';
                } else if (('mobile' === name) && (!/^\+?\d+$/.test(value))) {
                    errors[name] = 'Only numbers and + sign allowed in mobile';
                } else if (('email' === name) && (!this.validateEmail(value))) {
                    errors[name] = 'Email address is not valid.';
                } else if ('password' === name && value.length < 8) {
                    errors[name] = 'Too short password, min length is 8';
                }
            });
        this.setState({ errors });
        return errors;
    };

    updateRef(name, ref) {
        this[name] = ref;
    }
    handleChange = (name, value) => {
        this.setState(prevState => ({
            signupUser: {
                ...prevState.signupUser,
                [name]: value
            }
        }));
    }
    // updateSignupUser(field, value) {
    //     this.state.signupUser = {...this.state.signupUser , [field]: value}
    //     console.log("this.setState.state.signupUser",this.state.signupUser)
    //     console.log("firstName", this.state.signupUser.firstName)
    // }
 
    updateCardHide = () => {
        this.state.cartHide = false;
    }

    updatePasswordIcon = () => {
        console.log("icons is pressed")
        this.state(prevState => ({
            cartHide: true,
            showPassword: !this.state.showPassword,
            showText: prevState.showText === 'Show' ? 'Hide' : 'Show',
          }));
    }
   
}

const useSignUpModel = () => {
    const [signUpModel] = useState(new SignUpModels());

    return signUpModel;
};

export default useSignUpModel;