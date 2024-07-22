import { useState } from "react";

import Screen from "../../Constants/Screen";

class SignInModels extends Screen {
    constructor(props) {
        super(props);
        this.onFocus = this.onFocus.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.usernameRef = this.updateRef.bind(this, 'username');
        this.passwordRef = this.updateRef.bind(this, 'password');

        this.state = {
            callFrom: '',
            isLoading: false,
            userName: '',
            password: '',
            showPassword: true,
            showText: 'Show',
            responseError: '',
            user: null,
            isLoggedIn: false,
            cartHide: false,
        };
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
    };
    onSubmit = () => {
        let errors = {};
        ['username', 'password']
            .forEach((name) => {
                const value = this[name].value().trim();
                if (!value) {
                    errors[name] = 'Should not be empty';
                } else if ((name === 'username') && (!this.validateEmail(value))) {
                    errors[name] = 'Email address is not valid.';
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

    updateCardHide = () => {
        this.state.cartHide = false;
    }

    updatePasswordIcon = () => {
        console.log("icons is pressed")
        this.state(prevState => ({
            cartHide: true,
            showPassword: !this.state.showPassword,
            showText: prevState.showText === 'Show' ? 'Hide' : 'Show'
        }));
    }
}

const useSignInModel = () => {
    const [signInModel] = useState(new SignInModels());

    return signInModel;
};

export default useSignInModel;