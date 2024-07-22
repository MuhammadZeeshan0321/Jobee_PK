import axios from 'axios';
import React, { useState, useRef, useEffect, useContext, useMemo, useLayoutEffect } from 'react';
import {
    ScrollView, ActivityIndicator, View, Text,
    TouchableOpacity, Alert, Platform, KeyboardAvoidingView, Keyboard,
    Modal
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { TextInput } from 'react-native-paper';
import moment from 'moment';
import { useNavigation, useRoute } from "@react-navigation/native";
import Swiper from 'react-native-swiper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from 'react-native-element-dropdown';
import RadioGroup from 'react-native-radio-buttons-group';


import { styles } from '../../../assets/css/styles';
import { AppContext } from '../../store/app-context';
import Screen from '../../Constants/Screen';
import { apiUrl, fonts } from '../../utility/auth';
import Header from '../../components/CommonComponent/Header';
import Button from '../../components/CommonComponent/Button';
import BasicProfileFiltersScreen from './BasicProfileFilters/BasicProfileFilters';
import TitleList from '../../../assets/data/TitleList.json';
import CurrentCompanyFiltersScreen from './BasicProfileFilters/CurrentCompanyFilter';

function BasicProfileScreen() {
    const [basicProfileData, setBasicProfileData] = useState({
        footerHeight: false,
        isEnable: true,
        parentIndex: 0,
        buttonText: 'Next',
        prevButtonText: '',
        showPage: true,
        countryList: [],
        citiesList: [],
        salaryRangeList: [],
        experienceList: [],
        maxdate: new Date(),
        isSaved: true,
        isLoading: false,
    });
    const [basicProfile, setBasicProfile] = useState({
        firstName: '',
        lastName: '',
        birthDate: 'Date of birth',
        martialStatus: '',
        gender: '0',
        email: '',
        mobile: '',
        seconderyNumber: '',
        addressLine1: '',
        addressLine2: '',
        zipCode: '',
        city: {},
        country: {},
        ProfilePercentage: 0,
        ProfileImage: '',
        isFromSignup: false
    });

    const [basicWorkExpData, setBasicWorkExpData] = useState({
        isExperienced: '0',
        currentDesignation: {},
        currentCompany: {},
        currentExperience: {},
        currentSalary: {},
        currentJobCity: {},
        preferredJobDesignation: {},
        preferredJobCity: {},
        expectedSalary: {}
    })
    const [isVisibledatepicker, setIsVisibledatepicker] = useState(false);
    const [isDropDownFocus, setIsDropDownFocus] = useState(false);
    const [errors, setErrors] = useState({});
    const [visible, setVisible] = useState(false);
    const [selectedVal, setSelectedVal] = useState(null);


    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const birthDateRef = useRef(null);
    const martialStatusRef = useRef(null);
    const mobileRef = useRef(null);
    const emailRef = useRef(null);
    const seconderyNumberRef = useRef(null);
    const zipCodeRef = useRef(null);
    const addressline1Ref = useRef(null);
    const cityRef = useRef({});
    const countryRef = useRef({});
    const preferredjobdesignationRef = useRef({});
    const preferredjobcityRef = useRef({});
    const expectedsalaryRef = useRef({});
    const currentdesignationRef = useRef({});
    const currentcompanyRef = useRef({});
    const currentexperienceRef = useRef({});
    const currentsalaryRef = useRef({});
    const currentjobcityRef = useRef({});
    const basicProfileDataRef = useRef(basicWorkExpData);

    const swiperRef = useRef(null);
    const parentIndexRef = useRef(0);
    const [, forceUpdate] = useState();

    const appCtx = useContext(AppContext);

    const navigation = useNavigation();
    const route = useRoute();
    const {
        firstName = '', lastName = '', mobile = '', email = '', birthDate = 'Date of birth', martialStatus = '', gender = '0', seconderyNumber = '', addressLine1 = '',
        addressLine2 = '', zipCode = '', city = {}, country = {} } = basicProfile || {};
    const { isExperienced = '0', currentDesignation = {}, currentCompany = {}, currentExperience = {}, currentSalary = {},
        currentJobCity = {}, preferredJobDesignation = {}, preferredJobCity = {}, expectedSalary = {} } = basicProfileDataRef.current || {};


    useLayoutEffect(() => {
        const screenAnalytics = new Screen();
        const mdate = moment(new Date()).subtract(12, 'years').format('YYYY-MM-DD');
        setBasicProfileData((prevState) => ({
            ...prevState,
            maxdate: mdate
        }));

        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

        const initAnalytics = () => {
            screenAnalytics.googleAnalyticsView('/Basic Profile');
        };

        const setInitialVal = () => {
            if (appCtx && appCtx.propsObject) {
                const fromSignup = appCtx.propsObject.isFromSignup;
                if (fromSignup) {

                    setBasicProfile(prevState => ({
                        ...prevState,
                        firstName: appCtx.propsObject.firstName,
                        lastName: appCtx.propsObject.lastName,
                        mobile: appCtx.propsObject.mobile,
                        email: appCtx.propsObject.email,
                        country: {
                            ID: 166,
                            Text: 'Pakistan'
                        },
                        city: {
                            ID: 58,
                            Text: 'Lahore'
                        },
                        isFromSignup: appCtx.propsObject.isFromSignup
                    }));
                } else {
                    const basicWorkExperience = appCtx.propsObject.BasicWorkExperience || {};
                    if (basicWorkExperience.isExperienced === undefined) {
                        setBasicProfile(appCtx.propsObject.BasicProfile);

                        setBasicWorkExpData(prevState => ({
                            ...prevState,
                            ...appCtx.propsObject.BasicWorkExperience,
                            isExperienced: '0'
                        }));
                    } else {
                        setBasicProfile(appCtx.propsObject.BasicProfile);
                        setBasicWorkExpData(appCtx.propsObject.BasicWorkExperience);
                    }
                    setBasicProfile(prevState => ({
                        ...prevState,
                        firstName: appCtx.userInfo?.firstName,
                        lastName: appCtx.userInfo?.lastName,
                        mobile: appCtx.userInfo?.phoneNumber,
                        email: appCtx.userInfo?.userName,
                        country: {
                            ID: 166,
                            Text: 'Pakistan'
                        },
                        city: {
                            ID: 58,
                            Text: 'Lahore'
                        },
                    }));
                }
            }
        }

        const callGetApi = async () => {
            setBasicProfileData(prevState => ({
                ...prevState,
                isLoading: true
            }));
            try {
                const response = await axios.get(`${apiUrl}/candidate/basicprofile`,
                    {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'bearer ' + appCtx.userInfo.access_token
                        }
                    }
                );
                const objData = JSON.parse(response.data);
                const countryLst = [];
                const cityList = [];
                const salaryRangeLst = [];
                const expList = [];

                objData.Countries.map((obj) => {
                    countryLst.push({
                        ID: obj.CountryID,
                        Text: obj.country
                    });
                });

                objData.Cities.map((obj) => {
                    cityList.push({
                        ID: obj.CityID,
                        Text: obj.city
                    });
                });

                objData.Experiences.map((obj) => {
                    expList.push({
                        ID: obj.ExperienceID,
                        Text: obj.experience
                    });
                });

                objData.SalaryRanges.map((obj) => {
                    salaryRangeLst.push({
                        ID: obj.SalaryRangeID,
                        Text: obj.salaryRange
                    });
                });

                setBasicProfileData(prevState => ({
                    ...prevState,
                    isLoading: false,
                    countryList: countryLst,
                    citiesList: cityList,
                    salaryRangeList: salaryRangeLst,
                    experienceList: expList,
                }));
            } catch (error) {
                setBasicProfileData(prevState => ({
                    ...prevState,
                    isLoading: false,
                }));
                Alert.alert("Error in Basic Profile request", error.message)
            }
        }

        initAnalytics();
        // onNavigatorEvent();
        setInitialVal();
        callGetApi();

        // Cleanup listeners on unmount
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        if (Object.keys(basicProfile).length > 0) {
            setHeaderVal();
        }
    }, [basicProfile]);

    useEffect(() => {
        basicProfileDataRef.current = basicWorkExpData;
    }, [basicWorkExpData]);

    const setHeaderVal = () => {
        if (route.params?.screenTitle) {
            navigation.setOptions({
                title: route.params.screenTitle,
                headerStyle: { backgroundColor: '#00bac9' },
                headerTintColor: 'white',
                headerRight: ({ tintColor }) => (
                    <TouchableOpacity onPress={() => {
                        goToNext()
                    }}>
                        <Text color={tintColor}>
                            Done
                        </Text>
                    </TouchableOpacity>
                )
            });
        }
    }

    async function onNavigatorEvent() {
        const netInfoState = await NetInfo.fetch();
        setBasicProfileData(prevState => ({
            ...prevState,
            isLoading: true
        }));
        if (!netInfoState.isConnected) {
            Alert.alert("No Internet Access", "No Internet connection. Make sure Wi-Fi or cellular data is turned on, then try again.");
            setBasicProfileData(prevState => ({
                ...prevState,
                isLoading: false
            }));
        } else {
            if (basicProfileData.parentIndex === 0) {
                const errorObj = onSubmit();
                setBasicProfileData(prevState => ({
                    ...prevState,
                    isLoading: false
                }));
                if (Object.keys(errorObj).length !== 0) {
                    return false;
                }
                if (!basicWorkExpData.isExperienced) {
                    const errorObj = onDoneWithNoExp();
                    if (Object.keys(errorObj).length !== 0) {
                        swiperRef.current.scrollBy(1);
                        return false;
                    }
                } else {
                    const errorObj = onDoneWithExp();
                    if (Object.keys(errorObj).length !== 0) {
                        swiperRef.current.scrollBy(1);
                        return false;
                    }
                }
            } else if (basicProfileData.parentIndex === 1) {
                setBasicProfileData(prevState => ({
                    ...prevState,
                    isLoading: false
                }));
                if (!basicWorkExpData.isExperienced) {
                    const errorObj = onDoneWithNoExp();
                    if (Object.keys(errorObj).length !== 0) {
                        return false;
                    }
                } else {
                    const errorObj = onDoneWithExp();
                    if (Object.keys(errorObj).length !== 0) {
                        return false;
                    }
                }
            }
            makeRemoteRequest(appCtx.userInfo);
        }
    }


    function keyboardDidShow() {
        setBasicProfileData((prevState) => ({
            ...prevState,
            footerHeight: true
        }));
    }
    function keyboardDidHide() {
        setBasicProfileData((prevState) => ({
            ...prevState,
            footerHeight: false
        }));
    }
    const onFocus = (prop) => {
        if (prop === 'martialStatus') {
            setIsDropDownFocus(true);
        }
        else {
            setIsDropDownFocus(false);
        }
        if (errors[prop]) {
            let newErrors = { ...errors };
            delete newErrors[prop];
            setErrors(newErrors);
        }
    };
    const onSubmit = () => {
        let fieldErrors = {};

        const { firstName, lastName, birthDate, martialStatus, mobile, seconderyNumber, addressLine1, city, country, zipCode } = basicProfile || {};
        const fields = { firstName, lastName, birthDate, martialStatus, mobile, seconderyNumber, addressLine1, city, country, zipCode };

        fieldErrors = basicProfileSubmit(fields);
        setErrors(fieldErrors);
        return fieldErrors;
    };

    const workFieldSubmit = () => {
        let workErrors = {};
        if (basicProfileDataRef.current.isExperienced === '0') {
            workErrors = onDoneWithNoExp();
        }
        else {
            workErrors = onDoneWithExp();
        }

        setErrors(workErrors);
        return workErrors;
    }

    const onNameChange = (obj, val) => {
        setBasicProfile(prevState => ({
            ...prevState,
            [obj]: val
        }));
    }

    const onDoneWithExp = () => {
        let errors = {};
        const { currentDesignation, currentCompany, currentExperience, currentSalary, currentJobCity } = basicProfileDataRef.current || {};
        const fields = { currentDesignation, currentCompany, currentExperience, currentSalary, currentJobCity };

        errors = basicProfileSubmit(fields);

        setErrors(errors);
        return errors;
    };

    const onDoneWithNoExp = () => {
        let errors = {};
        const { preferredJobDesignation, preferredJobCity, expectedSalary } = basicProfileDataRef.current || {};
        const fields = { preferredJobDesignation, preferredJobCity, expectedSalary };

        errors = basicProfileSubmit(fields);
        setErrors(errors);
        return errors;
    };

    // const basicProfileSubmit = (fields) => {
    //     let newErrors = {};
    //     Object.keys(fields).forEach((key) => {
    //         let value = '';
    //         if (fields[key] !== undefined && fields[key] !== null) {
    //             if (typeof fields[key] === 'string') {
    //                 value = fields[key].trim();
    //             } else {
    //                 value = fields[key].toString().trim();
    //             }
    //         }
    //         if (key === 'birthDate' && value === 'Birth Date') {
    //             value = '';
    //         }

    //         console.log("value in----------------@@@@@@@@@@@@@@@@@@@@@", value)
    //         if (!value) {
    //             if (key !== 'seconderyNumber' && key !== 'zipCode') {
    //                 newErrors[key] = 'Should not be empty';
    //             }
    //         } else {
    //             if (key === 'mobile' && !/^\+?\d+$/.test(value)) {
    //                 newErrors[key] = 'Only numbers and + sign allowed in mobile';
    //             } else if (key === 'seconderyNumber' && !/^\+?\d+$/.test(value)) {
    //                 newErrors[key] = 'Only numbers and + sign allowed in Home Contact #';
    //             } else if (key === 'zipCode' && !/^[0-9]*$/.test(value)) {
    //                 newErrors[key] = 'Only numbers allowed in Zip Code';
    //             }
    //         }
    //     });
    //     return newErrors;
    // }

    const basicProfileSubmit = (fields) => {
        let newErrors = {};
        Object.keys(fields).forEach((key) => {
            let value = fields[key];

            if (typeof value === 'string') {
                value = value.trim();
            } else if (typeof value === 'object') {
                value = JSON.stringify(value).trim();
            }

            if (!value || (typeof value === 'string' && value === '{}')) {
                if (key !== 'seconderyNumber' && key !== 'zipCode') {
                    newErrors[key] = 'Should not be empty';
                }
            } else {
                if (key === 'mobile' && !/^\+?\d+$/.test(value)) {
                    newErrors[key] = 'Only numbers and + sign allowed in mobile';
                } else if (key === 'seconderyNumber' && !/^\+?\d+$/.test(value)) {
                    newErrors[key] = 'Only numbers and + sign allowed in Home Contact #';
                } else if (key === 'zipCode' && !/^[0-9]*$/.test(value)) {
                    newErrors[key] = 'Only numbers allowed in Zip Code';
                }
            }
        });
        return newErrors;
    }



    // function onMomentumScrollEnd(e, state, context) {
    //     setBasicProfileData(prevState => ({
    //         ...prevState,
    //         parentIndex: state.index
    //     }));
    // }

    const showDateTimePicker = () => {
        delete errors.birthDate;
        setErrors(errors);

        Keyboard.dismiss();
        setIsVisibledatepicker(true);
    };

    const handleDatePicked = date => {
        delete errors.birthDate;
        setErrors(errors);

        setBasicProfile(prevState => ({
            ...prevState,
            birthDate: formatDate(date)
        }));
        setIsVisibledatepicker(false);
    };

    const hideDateTimePicker = () => {
        if (basicProfile.birthDate !== 'Date of birth') {
            setBasicProfile(prevState => ({
                ...prevState,
                birthDate: prevState.birthDate
            }));
        }
        setIsVisibledatepicker(false);
    };

    const formatDate = date => {
        return moment(date).format('MM-DD-YYYY');
    };

    const makeRemoteRequest = async (userinfo) => {
        setBasicProfileData(prevState => ({
            ...prevState,
            isLoading: false
        }));
        const ProfileOverView = JSON.stringify({
            userAccountID: userinfo.userId,
            firstName: basicProfile.firstName,
            lastName: basicProfile.lastName,
            dob: basicProfile.birthDate,
            martialStatus: basicProfile.martialStatus,
            gender: basicProfile.gender === '0' ? 'M' : 'F',
            email: basicProfile.email,
            mobile: basicProfile.mobile,
            homePhone: basicProfile.seconderyNumber,
            addressLine1: basicProfile.addressLine1,
            addressLine2: basicProfile.addressLine2,
            zipCode: basicProfile.zipCode,
            cityID: basicProfile.city.ID,
            cityText: basicProfile.city.Text,
            Nationality: basicProfile.country.ID,
            countryText: basicProfile.country.Text,
            haveWorkExp: basicProfileDataRef.current.isExperienced,
            currentDesignation: basicProfileDataRef.current.isExperienced === '0' ? basicProfileDataRef.current.preferredJobDesignation.Text : basicProfileDataRef.current.currentDesignation.Text,
            currentCompanyText: basicProfileDataRef.current.isExperienced === '0' ? '' : basicProfileDataRef.current.currentCompany.Text,
            CurrentCompanyID: basicProfileDataRef.current.isExperienced === '0' ? '0' : basicProfileDataRef.current.currentCompany.ID,
            experienceID: basicProfileDataRef.current.isExperienced === '0' ? '0' : basicProfileDataRef.current.currentExperience.ID,
            jobCityID: basicProfileDataRef.current.isExperienced === '0' ? basicProfileDataRef.current.preferredJobCity.ID : basicProfileDataRef.current.currentJobCity.ID,
            jobCityText: basicProfileDataRef.current.isExperienced === '0' ? basicProfileDataRef.current.preferredJobCity.Text : basicProfileDataRef.current.currentJobCity.Text,
            salayRangeID: basicProfileDataRef.current.isExperienced === '0' ? basicProfileDataRef.current.expectedSalary.ID : basicProfileDataRef.current.currentSalary.ID
        });
        console.log("ProfileOverview in edit Profile-------------------", ProfileOverView)
        try {
            const response = await axios.post(`${apiUrl}/candidate/savebasicprofile`,
                ProfileOverView,
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + userinfo.access_token
                    }
                }
            );
            console.log("Save basic Profile-----------------------", response)
            if (response.status === 200) {
                setBasicProfileData(prevState => ({
                    ...prevState,
                    isLoading: false
                }));
                let res = JSON.parse(response.data);
                console.log("appCtx.propsObject.isFromSignup-----------------------", appCtx.propsObject.isFromSignup)
                if (appCtx.propsObject.isFromSignup) {
                    appCtx.setIsProfileCreated(true);
                    switch (appCtx.callFrom) {
                        case 'findjobs':
                            appCtx.propsObject.UpdateObjectState(false);
                            navigation.goBack();
                            break;
                        case 'applications':
                            appCtx.propsObject.UpdateObjectState(false);
                            navigation.goBack();
                            break;
                        default:
                            appCtx.propsObject.UpdateObjectState(true);
                            navigation.goBack();
                            break;
                    }
                } else {
                    const ProfileOverview = {
                        BasicProfile: basicProfile,
                        BasicWorkExperience: basicWorkExpData
                    };

                    appCtx.setSaveUpdateMultiple({
                        dataObj: 'ProfileOverview',
                        objState: ProfileOverview
                    })
                    navigation.goBack();
                }
            }
        } catch (error) {
            setBasicProfileData(prevState => ({
                ...prevState,
                isLoading: false,
            }));
            Alert.alert("Error in Remote Request of basic Profile---------", error.message)
        }
    }

    const updateObjectState = (objName, objData) => {
        let profileErrors = { ...errors };
        let errorObj = objName.replace(/\s+/g, '').toLowerCase();

        switch (objName) {
            case 'Country':
                delete profileErrors.country;
                setBasicProfile(prevState => ({
                    ...prevState,
                    country: objData
                }));
                setErrors(profileErrors);
                break;
            case 'City':
                delete profileErrors.city;
                setBasicProfile(prevState => ({
                    ...prevState,
                    city: objData
                }));
                setErrors(profileErrors);
                break;
            default:
                delete profileErrors[errorObj];
                setErrors(profileErrors);
                break;
        }
    };

    const updateObjectExpState = (objName, objData) => {
        let errorObj = objName.replace(/\s+/g, '').toLowerCase();

        setBasicWorkExpData((prevState) => {
            let expErrors = { ...errors };

            let newState = prevState;
            switch (objName) {
                case 'Preferred Job Designation':
                    delete expErrors.preferredJobDesignation;
                    newState = {
                        ...prevState,
                        preferredJobDesignation: objData
                    };
                    break;
                case 'Preferred Job City':
                    delete expErrors.preferredJobCity;
                    newState = {
                        ...prevState,
                        preferredJobCity: objData
                    };
                    break;
                case 'Expected Salary':
                    delete expErrors.expectedSalary;
                    newState = {
                        ...prevState,
                        expectedSalary: objData
                    };
                    break;
                case 'Current Designation':
                    delete expErrors.currentDesignation;
                    newState = {
                        ...prevState,
                        currentDesignation: objData
                    };
                    break;
                case 'Current Company':
                    delete expErrors.currentCompany;
                    newState = {
                        ...prevState,
                        currentCompany: objData
                    };
                    break;
                case 'Current Salary':
                    delete expErrors.currentSalary;
                    newState = {
                        ...prevState,
                        currentSalary: objData
                    };
                    break;
                case 'Current Job City':
                    delete expErrors.currentJobCity;
                    newState = {
                        ...prevState,
                        currentJobCity: objData
                    };
                    break;
                default:
                    delete expErrors[errorObj];
                    newState = {
                        ...prevState,
                        currentExperience: objData
                    };
                    break;

            }
            basicProfileDataRef.current = newState;
            setErrors(expErrors);
            return newState;
        });
    };


    const childViewRender = (val) => {
        Keyboard.dismiss();
        setVisible(true);
        setSelectedVal(val);
    }

    const closeModal = () => {
        setSelectedVal(null);
        setVisible(false);
    };

    const getDataForSelectedVal = () => {
        switch (selectedVal) {
            case 'Country':
                return basicProfileData.countryList;
            case 'City':
                return basicProfileData.citiesList;
            case 'Preferred Job Designation':
                return TitleList;
            case 'Preferred Job City':
                return basicProfileData.citiesList;
            case 'Expected Salary':
                return basicProfileData.salaryRangeList;
            case 'Current Designation':
                return TitleList;
            case 'Current Salary':
                return basicProfileData.salaryRangeList;
            case 'Current Job City':
                return basicProfileData.citiesList;
            default:
                return basicProfileData.experienceList;
        }
    };
    const getModifyVal = () => {
        switch (selectedVal) {
            case 'Country':
                return false;
            case 'City':
                return true;
            case 'Preferred Job Designation':
                return true;
            case 'Preferred Job City':
                return false;
            case 'Expected Salary':
                return false;
            case 'Current Designation':
                return true;
            case 'Current Salary':
                return false;
            case 'Current Job City':
                return false;

            default:
                return false;
        }
    };

    const onCityTextChange = (text) => {
        setBasicProfile(prevState => ({
            ...prevState,
            city: {
                ID: 0,
                Text: text
            }
        }));
    }

    const workExperienceChange = (prop, val) => {
        setBasicWorkExpData(prevState => ({
            ...prevState,
            [prop]: val
        }));
    }

    const viewMyProfile = () => {
        if (basicProfileData.isSaved) {
            setBasicProfileData(prevState => ({
                ...prevState,
                isSaved: false
            }));
            makeRemoteRequest(appCtx.userInfo);
        }
    };

    const MartialStatusList = [
        { value: 'S', label: 'Single' },
        { value: 'M', label: 'Married' },
        { value: 'W', label: 'Widowed' },
        { value: 'D', label: 'Divorced' }
    ];
    const GenderButtons = useMemo(() => ([
        {
            id: '0',
            label: 'Male',
            value: 'male'
        },
        {
            id: '1',
            label: 'Female',
            value: 'female'
        }
    ]), []);
    const WorkExperienceButtons = useMemo(() => ([
        {
            id: '0',
            label: 'No',
            value: 'no'
        },
        {
            id: '1',
            label: 'Yes',
            value: 'yes'
        }
    ]), []);

    const validatePageOne = () => {
        let errObj = onSubmit();
        if (Object.keys(errObj).length === 0) {
            return true;
        }
        else {
            return false;
        }
    };


    const validatePageTwo = () => {
        let workErrObj = workFieldSubmit();
        if (Object.keys(workErrObj).length === 0) {
            return true;
        }
        else {
            return false;
        }
    };

    const goToNext = () => {
        if (validatePageOne() && parentIndexRef.current === 0) {
            parentIndexRef.current = 1;
            swiperRef.current.scrollBy(1);
            forceUpdate({});
        }
        else if (parentIndexRef.current === 1) {
            if (validatePageTwo()) {
                console.log("for API Call-----------------------");
                makeRemoteRequest(appCtx.userInfo);
            }
        }
    }

    const goToPrev = () => {
        swiperRef.current.scrollBy(-1);
        parentIndexRef.current = 0;
    };

    const renderSwiperFirstView = () => {

        return (
            <View style={styles.container1} key={1}>
                <ScrollView style={styles.container1} keyboardShouldPersistTaps='always' key={1}>
                    <KeyboardAvoidingView>
                        <View style={{ paddingHorizontal: 20 }}>
                            <TextInput
                                label="First Name"
                                // animationDuration={10}
                                value={firstName}
                                ref={firstNameRef}
                                onFocus={() => onFocus('firstName')}
                                onKeyPress={() => onFocus('firstName')}
                                error={errors.firstName}
                                onChangeText={(value) => onNameChange('firstName', value)}
                                labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }}
                                style={[styles.lightText, styles.inputField, { fontFamily: fonts.regular }]}
                                theme={{
                                    colors: {
                                        primary: '#00bac9'
                                    },
                                }}
                            />
                            {errors.firstName && (<Text style={styles.inputError}>{errors.firstName}</Text>)}

                            <TextInput
                                label="Last Name"
                                // animationDuration={10}
                                value={lastName}
                                ref={lastNameRef}
                                onFocus={() => onFocus('lastName')}
                                onKeyPress={() => onFocus('lastName')}
                                error={errors.lastName}
                                onChangeText={(value) => onNameChange('lastName', value)}
                                labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }}
                                style={[styles.lightText, styles.inputField, { fontFamily: fonts.regular }]}
                                theme={{
                                    colors: {
                                        primary: '#00bac9'
                                    },
                                }}
                            />
                            {errors.lastName && (<Text style={styles.inputError}>{errors.lastName}</Text>)}

                            <View style={{ flex: 1 }}>
                                <TouchableOpacity
                                    onPress={showDateTimePicker}
                                >
                                    <View>
                                        <TextInput
                                            label="Date of birth" value={birthDate} disabled
                                            ref={birthDateRef} onFocus={() => onFocus('dateOfBirth')} error={errors.birthDate}
                                            disabledLineType={'solid'}
                                            disabledLineWidth={0.5}
                                            labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }}
                                            style={[styles.lightText, styles.inputField, { fontFamily: fonts.regular }]}
                                            theme={{
                                                colors: {
                                                    primary: '#00bac9'
                                                },
                                            }}
                                        />
                                        {errors.birthDate && (<Text style={styles.inputError}>{errors.birthDate}</Text>)}

                                    </View>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={isVisibledatepicker}
                                    maximumDate={new Date(basicProfileData.maxdate)}
                                    onConfirm={handleDatePicked}
                                    onCancel={hideDateTimePicker}
                                    mode='date'
                                    datePickerModeAndroid='calendar'
                                />
                            </View>
                            <View style={{
                                borderBottomWidth: 1,
                                borderBottomColor: '#ddd',
                                marginTop: 10
                            }}>
                                <Text style={[isDropDownFocus && styles.dropDownLabel]}>
                                    Martial Status
                                </Text>
                                <Dropdown
                                    data={MartialStatusList}
                                    value={martialStatus}
                                    labelField="label"
                                    valueField="value"
                                    ref={martialStatusRef}
                                    onFocus={() => onFocus('martialStatus')}
                                    onBlur={() => setIsDropDownFocus(false)}
                                    error={errors.martialStatus}
                                    onChange={(value) => onNameChange('martialStatus', value.value)}
                                    selectedTextStyle={{ fontFamily: fonts.regular }}
                                    containerStyle={{ fontFamily: fonts.regular }}
                                    style={[styles.dropdown, isDropDownFocus && { borderColor: '#00bac9' }, styles.lightText, { fontFamily: fonts.regular }]}
                                />
                                {errors.martialStatus && (<Text style={styles.inputError}>{errors.martialStatus}</Text>)}

                            </View>
                            <View
                                style={{
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#ddd',
                                    marginTop: 5
                                }}
                            >
                                <Text style={[styles.lightText, { fontFamily: fonts.regular, color: '#A9A9A9' }]}>Gender</Text>
                                <RadioGroup
                                    radioButtons={GenderButtons}
                                    selectedId={gender}
                                    layout='row'
                                    color={'#2196f3'}
                                    onPress={(val) => onNameChange('gender', val)}
                                    labelStyle={[styles.lightText, { fontFamily: fonts.regular }]}
                                    style={[styles.spacebetweenRow, { paddingVertical: 10 }]}
                                    theme={{
                                        colors: {
                                            primary: '#00bac9'
                                        },
                                    }}
                                />
                            </View>
                            <TextInput
                                label="Email"
                                value={email}
                                disabled={true}
                                disabledLineType={'solid'}
                                disabledLineWidth={0.5}
                                ref={emailRef}
                                onChangeText={(value) => onNameChange('email', value)}
                                labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }}
                                style={[styles.lightText, styles.inputField, { fontFamily: fonts.regular }]}
                                theme={{
                                    colors: {
                                        primary: '#00bac9'
                                    },
                                }}
                            />

                            <TextInput
                                label="Mobile"
                                // animationDuration={10}
                                value={mobile === null ? '' : mobile}
                                ref={mobileRef}
                                keyboardType='numeric'
                                onFocus={() => onFocus('mobile')}
                                onKeyPress={() => onFocus('mobile')}
                                error={errors.mobile}
                                onChangeText={(value) => onNameChange('mobile', value)}
                                labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }}
                                style={[styles.lightText, styles.inputField, { fontFamily: fonts.regular }]}
                                theme={{
                                    colors: {
                                        primary: '#00bac9'
                                    },
                                }}
                            />
                            {errors.mobile && (<Text style={styles.inputError}>{errors.mobile}</Text>)}

                            <TextInput
                                label="Home Contact #"
                                // animationDuration={10}
                                keyboardType='numeric'
                                value={seconderyNumber}
                                ref={seconderyNumberRef}
                                onFocus={() => onFocus('seconderyNumber')}
                                onKeyPress={() => onFocus('seconderyNumber')}
                                // error={errors.seconderyNumber}
                                onChangeText={(value) => onNameChange('seconderyNumber', value)}
                                labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }}
                                style={[styles.lightText, styles.inputField, { fontFamily: fonts.regular }]}
                                theme={{
                                    colors: {
                                        primary: '#00bac9'
                                    },
                                }}
                            />

                            <TextInput
                                label="Address Line 1"
                                maxLength={255}
                                // animationDuration={10}
                                keyboardType={Platform.OS === 'android' ? 'email-address' : 'ascii-capable'}
                                value={addressLine1}
                                ref={addressline1Ref}
                                onFocus={() => onFocus('addressLine1')}
                                onKeyPress={() => onFocus('addressLine1')}
                                error={errors.addressLine1}
                                onChangeText={(value) => onNameChange('addressLine1', value)}
                                labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }}
                                style={[styles.lightText, styles.inputField, { fontFamily: fonts.regular }]}
                                theme={{
                                    colors: {
                                        primary: '#00bac9'
                                    },
                                }}
                            />
                            {errors.addressLine1 && (<Text style={styles.inputError}>{errors.addressLine1}</Text>)}

                            <TextInput
                                label="Address Line 2"
                                // animationDuration={10}
                                maxLength={255}
                                keyboardType={Platform.OS === 'android' ? 'email-address' : 'ascii-capable'}
                                value={addressLine2}
                                onChangeText={(value) => onNameChange('addressLine2', value)}
                                labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }}
                                style={[styles.lightText, styles.inputField, { fontFamily: fonts.regular }]}
                                theme={{
                                    colors: {
                                        primary: '#00bac9'
                                    },
                                }}
                            />

                            <View>
                                <TouchableOpacity onPress={() => childViewRender('Country')}>
                                    <View>
                                        <TextInput
                                            label="Country" value={country === undefined ? '' : country.Text}
                                            editable={false}
                                            // disabledLineType={'solid'}
                                            disabledLineWidth={0.5}
                                            labelTextStyle={{ fontFamily: fonts.regular }}
                                            ref={countryRef} onFocus={() => onFocus('country')} onKeyPress={() => onFocus('country')} error={errors.country}
                                            style={[styles.lightText, { backgroundColor: '#ffffff', fontFamily: fonts.regular }]}
                                            theme={{
                                                colors: {
                                                    primary: '#00bac9'
                                                },
                                            }}
                                        />
                                        {errors.country && (<Text style={styles.inputError}>{errors.country}</Text>)}

                                    </View>
                                </TouchableOpacity>
                            </View>
                            {
                                basicProfile.country === undefined || basicProfile.country.Text === undefined || basicProfile.country.Text.trim().toLowerCase() !== 'pakistan' ?
                                    <View>
                                        <TextInput
                                            label="City" value={city === undefined ? '' : city.Text}
                                            // animationDuration={10}
                                            maxLength={150}
                                            keyboardType={Platform.OS === 'android' ? 'email-address' : 'ascii-capable'}
                                            onChangeText={onCityTextChange}
                                            ref={cityRef} onFocus={() => onFocus('city')} onKeyPress={() => onFocus('city')} error={errors.city}
                                            labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }}
                                            style={[styles.lightText, { backgroundColor: '#ffffff', fontFamily: fonts.regular }]}
                                            theme={{
                                                colors: {
                                                    primary: '#00bac9'
                                                },
                                            }}
                                        />
                                        {errors.city && (<Text style={styles.inputError}>{errors.city}</Text>)}
                                    </View>
                                    :
                                    <View>
                                        <TouchableOpacity onPress={() => childViewRender('City')} >
                                            <View>
                                                <TextInput
                                                    label="City" value={city === undefined ? '' : city.Text}
                                                    // disabledLineType={'solid'}
                                                    disabledLineWidth={0.5}
                                                    editable={false}
                                                    labelTextStyle={{ fontFamily: fonts.regular }}
                                                    ref={cityRef} onFocus={() => onFocus('city')} onKeyPress={() => onFocus('city')}
                                                    error={errors.city}
                                                    style={[styles.lightText, { backgroundColor: '#ffffff', fontFamily: fonts.regular }]}
                                                    theme={{
                                                        colors: {
                                                            primary: '#00bac9'
                                                        },
                                                    }}
                                                />

                                                {errors.city && (<Text style={styles.inputError}>{errors.city}</Text>)}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                            }
                            <TextInput
                                label="Zip / Postal Code"
                                keyboardType='number-pad'
                                // animationDuration={10}
                                value={zipCode}
                                ref={zipCodeRef}
                                onFocus={() => onFocus('zipCode')}
                                onKeyPress={() => onFocus('zipCode')}
                                // error={errors.zipCode}
                                onChangeText={(value) => onNameChange('zipCode', value)}
                                maxLength={30}
                                //characterRestriction={30}
                                labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }}
                                style={[styles.lightText, styles.inputField, { fontFamily: fonts.regular }]}
                                theme={{
                                    colors: {
                                        primary: '#00bac9'
                                    },
                                }}
                            />
                            {/* 
                    </View> */}
                        </View>
                        <View style={{ height: 80 }} />
                    </KeyboardAvoidingView>
                </ScrollView>

            </View >
        );
    }

    const renderSwiperSecondView = () => {

        return (
            <ScrollView style={styles.container1} key={2} keyboardShouldPersistTaps="always" >
                <View style={{ padding: 20 }}>
                    <Text style={[styles.lightText, styles.centerText, { fontFamily: fonts.bold }]}>
                        Add your latest work experience
                    </Text>
                    <Text style={[styles.lightText, styles.centerText, { fontFamily: fonts.regular }]}>
                        Do you have professional work experience?
                    </Text>
                </View>
                <View style={{ padding: 20 }}>
                    <View
                        style={{
                            borderBottomWidth: 1,
                            borderBottomColor: '#ddd',
                            marginTop: 5
                        }}
                    >
                        <RadioGroup
                            radioButtons={WorkExperienceButtons}
                            selectedId={isExperienced}
                            // formHorizontal={true}
                            layout='row'
                            // labelHorizontal={true}
                            color={'#2196f3'}
                            // animation={true}
                            onPress={(val) => workExperienceChange('isExperienced', val)}
                            // borderWidth={1}
                            // buttonInnerColor={'#e74c3c'}
                            // buttonSize={20}
                            // buttonOuterSize={30}
                            labelStyle={[styles.lightText, { fontFamily: fonts.regular }]}
                            style={[styles.spacebetweenRow, { paddingVertical: 10 }]}
                            theme={{
                                colors: {
                                    primary: '#00bac9'
                                },
                            }}
                        />
                    </View>
                    {isExperienced === '0' ? (
                        <View style={styles.container1}>
                            <View>
                                <TouchableOpacity onPress={() => {
                                    onFocus('preferredJobDesignation')
                                    childViewRender('Preferred Job Designation')
                                }}>
                                    <View>
                                        <TextInput
                                            label="Preferred Job Designation" value={preferredJobDesignation === undefined ?
                                                '......' : preferredJobDesignation.Text === undefined ? '......'
                                                    : preferredJobDesignation.Text}
                                            editable={false}
                                            labelTextStyle={{ width: 200, fontFamily: fonts.regular }}
                                            ref={preferredjobdesignationRef}
                                            error={errors.preferredJobDesignation}
                                            style={[styles.lightText, { backgroundColor: '#ffffff', fontFamily: fonts.regular }]}
                                            theme={{
                                                colors: {
                                                    primary: '#00bac9'
                                                },
                                            }}
                                        />
                                        {errors.preferredJobDesignation && (<Text style={styles.inputError}>{errors.preferredJobDesignation}</Text>)}
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => {
                                    onFocus('preferredJobCity')
                                    childViewRender('Preferred Job City')
                                }}>
                                    <View>
                                        <TextInput
                                            label="Preferred Job City" value={preferredJobCity === undefined ? '......' : preferredJobCity.Text === undefined ? '......' : preferredJobCity.Text}
                                            // disabledLineType={'solid'} disabledLineWidth={0.5}
                                            editable={false}
                                            labelTextStyle={{ width: 200, fontFamily: fonts.regular }}
                                            ref={preferredjobcityRef} error={errors.preferredJobCity}
                                            style={[styles.lightText, { backgroundColor: '#ffffff', fontFamily: fonts.regular }]}
                                            theme={{
                                                colors: {
                                                    primary: '#00bac9'
                                                },
                                            }}
                                        />
                                        {errors.preferredJobCity && (<Text style={styles.inputError}>{errors.preferredJobCity}</Text>)}
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => {
                                    onFocus('expectedSalary')
                                    childViewRender('Expected Salary')
                                }}>
                                    <View>
                                        <TextInput
                                            label="Expected Salary" value={expectedSalary === undefined ? '......' : expectedSalary.Text === undefined ? '......' : expectedSalary.Text}
                                            editable={false}
                                            labelTextStyle={{ width: 200, fontFamily: fonts.regular }}
                                            ref={expectedsalaryRef} error={errors.expectedSalary}
                                            style={[styles.lightText, { backgroundColor: '#ffffff', fontFamily: fonts.regular }]}
                                            theme={{
                                                colors: {
                                                    primary: '#00bac9'
                                                },
                                            }}
                                        />
                                        {errors.expectedSalary && (<Text style={styles.inputError}>{errors.expectedSalary}</Text>)}
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginBottom: 80 }}></View>
                        </View>
                    ) : (
                        <View style={styles.container1}>
                            <View>
                                <TouchableOpacity onPress={() => {
                                    onFocus('currentDesignation')
                                    childViewRender('Current Designation')
                                }}>
                                    <View>
                                        <TextInput
                                            label="Current Designation" value={currentDesignation === undefined ? '......' : currentDesignation.Text === undefined ? '......' : currentDesignation.Text}
                                            editable={false}
                                            labelTextStyle={{ width: 200, fontFamily: fonts.regular }}
                                            ref={currentdesignationRef} error={errors.currentDesignation} style={[styles.lightText, { backgroundColor: '#ffffff', fontFamily: fonts.regular }]}
                                            theme={{
                                                colors: {
                                                    primary: '#00bac9'
                                                },
                                            }}
                                        />
                                        {errors.currentDesignation && (<Text style={styles.inputError}>{errors.currentDesignation}</Text>)}
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => {
                                    onFocus('currentCompany')
                                    childViewRender('Current Company')
                                }}>
                                    <View>
                                        <TextInput
                                            label="Current Company" value={currentCompany === undefined ? '......' : currentCompany.Text === undefined ? '......' : currentCompany.Text}
                                            editable={false}
                                            labelTextStyle={{ width: 200, fontFamily: fonts.regular }}
                                            ref={currentcompanyRef} error={errors.currentCompany} style={[styles.lightText, { backgroundColor: '#ffffff', fontFamily: fonts.regular }]}
                                            theme={{
                                                colors: {
                                                    primary: '#00bac9'
                                                },
                                            }}
                                        />
                                        {errors.currentCompany && (<Text style={styles.inputError}>{errors.currentCompany}</Text>)}
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => {
                                    onFocus('currentExperience')
                                    childViewRender('Current Experience')
                                }}>
                                    <View>
                                        <TextInput
                                            label="Current Experience" value={currentExperience === undefined ? '......' : currentExperience.Text === undefined ? '......' : currentExperience.Text}
                                            editable={false}
                                            labelTextStyle={{ width: 200, fontFamily: fonts.regular }}
                                            ref={currentexperienceRef} error={errors.currentExperience} style={[styles.lightText, { backgroundColor: '#ffffff', fontFamily: fonts.regular }]}
                                            theme={{
                                                colors: {
                                                    primary: '#00bac9'
                                                },
                                            }}
                                        />
                                        {errors.currentExperience && (<Text style={styles.inputError}>{errors.currentExperience}</Text>)}
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => {
                                    onFocus('currentSalary')
                                    childViewRender('Current Salary')
                                }}>
                                    <View>
                                        <TextInput
                                            label="Current Salary" value={currentSalary === undefined ? '......' : currentSalary.Text === undefined ? '......' : currentSalary.Text}
                                            editable={false}
                                            labelTextStyle={{ width: 200, fontFamily: fonts.regular }}
                                            ref={currentsalaryRef} error={errors.currentSalary} style={[styles.lightText, { backgroundColor: '#ffffff', fontFamily: fonts.regular }]}
                                            theme={{
                                                colors: {
                                                    primary: '#00bac9'
                                                },
                                            }}
                                        />
                                        {errors.currentSalary && (<Text style={styles.inputError}>{errors.currentSalary}</Text>)}
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => {
                                    onFocus('currentJobCity')
                                    childViewRender('Current Job City')
                                }}>
                                    <View>
                                        <TextInput
                                            label="Current Job City" value={currentJobCity === undefined ? '......' : currentJobCity.Text === undefined ? '......' : currentJobCity.Text}
                                            editable={false}
                                            labelTextStyle={{ width: 200, fontFamily: fonts.regular }}
                                            ref={currentjobcityRef} error={errors.currentJobCity} style={[styles.lightText, { backgroundColor: '#ffffff', fontFamily: fonts.regular }]}
                                            theme={{
                                                colors: {
                                                    primary: '#00bac9'
                                                },
                                            }}
                                        />
                                        {errors.currentJobCity && (<Text style={styles.inputError}>{errors.currentJobCity}</Text>)}
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 80 }}>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView >
        )
    }
    const renderSwiperThirdView = () => {
        return (
            <View key={3}>
                <View style={{ marginTop: '30%' }}>
                    <Header
                        headerText="Congratulations."
                        innerText="Your profile has been created. Go find Jobs Now or wait to get Jobee Matched! Click below to view your profile."
                        isDisplay={true}
                    />
                    <Button
                        buttonText="View my profile"
                        buttonEvent={viewMyProfile}
                    />
                </View>
            </View>
        );
    }

    const renderSwiperMainView = () => {
        let sViews = [];
        sViews[0] = renderSwiperFirstView();
        sViews[1] = renderSwiperSecondView();
        return sViews;
    }

    return (
        (basicProfileData.isLoading ?
            <View style={{ paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#CDE0CE', backgroundColor: '#ffffff', height: '100%', justifyContent: 'center' }}>
                <ActivityIndicator animating size="large" />
            </View>
            :
            <View style={[styles.container1, { flex: 1 }]}>
                <Swiper
                    showsButtons={true}
                    ref={swiperRef}
                    loop={false} // Disable looping
                    showsPagination={false} // Show pagination dots
                    scrollEnabled={false}
                    buttonWrapperStyle={{
                        backgroundColor: '#eee',
                        height: 70,
                        flexDirection: 'row',
                        position: 'absolute',
                        top: '93%',
                        left: 0,
                        paddingHorizontal: 9,
                        paddingTop: -6,
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                    nextButton={
                        <Text style={[styles.regularText, { fontFamily: fonts.regular, color: '#606060' }]}
                            onPress={goToNext}>Next</Text>
                    }
                    prevButton={
                        <Text style={[styles.regularText, { fontFamily: fonts.regular, color: '#606060' }]}
                            onPress={goToPrev}>Prev</Text>
                    }
                >
                    {
                        renderSwiperMainView().map((view, index) => (
                            <React.Fragment key={index}>
                                {view}
                            </React.Fragment>
                        ))
                    }
                </Swiper>

                {/*----------------------For Showing Modal--------------------------- */}
                <View>
                    {selectedVal !== null && (
                        <Modal
                            visible={visible}
                            transparent={true}
                            onRequestClose={closeModal}
                            animationType="fade"
                        >
                            {selectedVal === 'Current Company' ? (
                                <CurrentCompanyFiltersScreen PageTitle={selectedVal}
                                    ObjectVal={basicWorkExpData.currentCompany} UpdateObjectState={updateObjectExpState}
                                    canModify={false} closeModal={closeModal} />
                            ) : (selectedVal === 'City' || selectedVal === 'Country' ? (
                                <BasicProfileFiltersScreen PageTitle={selectedVal}
                                    ObjectVal={getDataForSelectedVal()} UpdateObjectState={updateObjectState}
                                    canModify={getModifyVal()} closeModal={closeModal} />
                            ) : (<BasicProfileFiltersScreen PageTitle={selectedVal}
                                ObjectVal={getDataForSelectedVal()} UpdateObjectState={updateObjectExpState}
                                canModify={getModifyVal()} closeModal={closeModal} />))}

                        </Modal>
                    )}
                </View>
            </View>
        )
    );
}

export default BasicProfileScreen;


