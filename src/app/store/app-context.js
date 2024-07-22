import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState } from 'react';

export const AppContext = createContext({
    callFrom: '',
    propsObject: {},
    userInfo: null,
    appLogin: false,
    isappTabViewed: false,
    ismyproTabViewed: false,
    isSignOut: false,
    isProfileCreated: false,
    saveUpdateMultiVal: {},

    setCallFrom: (val) => { },
    setPropsObject: (val) => { },
    setappLogin: (val) => { },
    setUserInfo: (val) => { },
    setAppTabViewed: (val) => { },
    setMyProTabViewed: (val) => { },
    storeUserInfo: (accessToken) => { },
    setSignOut: (val) => { },
    deleteInfo: () => { },
    setIsProfileCreated: (val) => { },
    setSaveUpdateMultiple: (val) => { },
});

function AppContextProvider({ children }) {
    const [callFromVal, setCallFromVal] = useState('');
    const [propsObjVal, setpropsObjVal] = useState({});
    const [appLoginVal, setAppLoginVal] = useState(false);
    const [isAppTabVal, setIsAppTabVal] = useState(false);
    const [isMyProTabVal, setIsMyProTabVal] = useState(false);
    const [userInfoVal, setUserInfoVal] = useState(null);
    const [isSignOutVal, setIsSignOutVal] = useState(false);
    const [isProfileCreatedVal, setIsProfileCreatedVal] = useState(false);
    const [saveUpdateMultipleVal, setSaveUpdateMultipleVal] = useState({});

    function setCallFrom(val) {
        setCallFromVal(val);
        // callFrom = val;
    };
    function setPropsObject(val) {
        setpropsObjVal(val);
        // propsObject = val;
    };
    function setappLogin(val) {
        setAppLoginVal(val);
        // appLogin = val;
    };
    function setUserInfo(val) {
        setUserInfoVal(val)
    };
    function setAppTabViewed(val) {
        setIsAppTabVal(val);
        // isappTabViewed = val;
    };
    function setMyProTabViewed(val) {
        setIsMyProTabVal(val);
        // ismyproTabViewed = val;
    };
    function setSignOut(val) {
        setIsSignOutVal(val);
    };
    function setIsProfileCreated(val) {
        setIsProfileCreatedVal(val);
    }
    function storeUserInfo(accessToken) {
        try {
            setAppLoginVal(true);
            setUserInfoVal(accessToken)
            console.log("appLogin in app-context---------", appLoginVal)
            AsyncStorage.setItem('ap:auth:user_info', JSON.stringify(accessToken));
            console.log('Token was stored successfull ');
        } catch (error) {
            console.log('error in storing AsyncStorage-------------', error);
        }
    };

    async function deleteInfo() {
        try {
            setAppLoginVal(false);
            setUserInfoVal(null);
            setIsSignOutVal(true);
            setAppTabViewed(true);
            setIsMyProTabVal(true);
            await AsyncStorage.removeItem('ap:auth:user_info').catch(err => console.log(err));
        } catch (error) {
            Alert.alert('Error In delete Info from ContextApi', error.message);
        }
    }

    function setSaveUpdateMultiple(val) {
        setSaveUpdateMultipleVal(val);
    }

    const value = {
        callFrom: callFromVal,
        propsObject: propsObjVal,
        appLogin: appLoginVal,
        isappTabViewed: isAppTabVal,
        ismyproTabViewed: isMyProTabVal,
        userInfo: userInfoVal,
        isSignOut: isSignOutVal,
        isProfileCreated: isProfileCreatedVal,
        saveUpdateMultiVal: saveUpdateMultipleVal,
        setCallFrom: setCallFrom,
        setPropsObject: setPropsObject,
        setappLogin: setappLogin,
        setUserInfo: setUserInfo,
        setAppTabViewed: setAppTabViewed,
        setMyProTabViewed: setMyProTabViewed,
        setSignOut: setSignOut,
        storeUserInfo: storeUserInfo,
        deleteInfo: deleteInfo,
        setIsProfileCreated: setIsProfileCreated,
        setSaveUpdateMultiple: setSaveUpdateMultiple
    }
    console.log("app Context Value---------------",value)
    console.log("app Context AppLogin---------------",appLoginVal)

    return <AppContext.Provider value={value} >{children}</AppContext.Provider>

}

export default AppContextProvider;