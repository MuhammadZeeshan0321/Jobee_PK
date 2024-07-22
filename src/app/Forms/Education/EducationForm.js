import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
    TouchableWithoutFeedback, View, Text, TouchableOpacity, Platform, Keyboard, Modal,
    StyleSheet
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import RadioGroup from 'react-native-radio-buttons-group';
import MonthPicker from 'react-native-month-year-picker';

import { fonts } from '../../utility/auth';
import DegreeLevel from '../../../assets/data/DegreeLevel.json';
import CitiesList from '../../../assets/data/CitiesList.json';
import DegreeMajor from '../../../assets/data/DegreeMajor.json';
import InstituteList from '../../../assets/data/InstituteList.json';
import Screen from '../../Constants/Screen';
import { styles as globalStyle } from '../../../assets/css/styles';
import BasicProfileFiltersScreen from '../../screens/BasicProfile/BasicProfileFilters/BasicProfileFilters';

function EducationForm(props) {
    const [eduFormData, setEduFormData] = useState({
        Id: 0,
        degreeTitle: '',
        degreeLevel: {},
        major: {},
        institution: {},
        graduationDate: '',
        suggestedDate: '',
        city: {},
        gradingSystem: 1,
        gradeValue: '',
        isVisibldatepicker: false,
        PageTitle: 'Add Education',
    });

    const [errors, setErrors] = useState({});
    const [visible, setVisible] = useState(false);
    const [selectedVal, setSelectedVal] = useState(null);

    const degtitleRef = useRef(null);
    const deglevelRef = useRef(null);
    const majorRef = useRef(null);
    const institutionRef = useRef(null);
    const graduationdateRef = useRef(null);
    const cityRef = useRef(null);
    const gradeValueRef = useRef(null);

    const { Id = 0, degreeTitle = '', degreeLevel = {}, major = {}, institution = {}, graduationDate = '', city = {},
        gradingSystem = 1, gradeValue = '', isVisibldatepicker = false, PageTitle = 'Add Education' } = eduFormData;

    useEffect(() => {
        const screenAnalytics = new Screen();

        const initAnalytics = () => {
            screenAnalytics.googleAnalyticsView('User Profile/Education');
        };

        const setinitialVal = () => {
            if (props.passProps.Id === -1) {
                setEduFormData((prevState) => ({
                    ...prevState,
                    PageTitle: props.pageTitle
                }));
            } else {
                setEduFormData((prevState) => ({
                    ...prevState,
                    Id: props.passProps.Id,
                    degreeTitle: props.passProps.degreeTitle,
                    degreeLevel: props.passProps.degreeLevel,
                    major: props.passProps.major,
                    institution: props.passProps.institution,
                    graduationDate: props.passProps.graduationDate,
                    city: props.passProps.city,
                    gradingSystem: +props.passProps.gradingSystem,
                    gradeValue: props.passProps.gradeValue,
                    PageTitle: props.pageTitle
                }));
            }
        }

        initAnalytics();
        setinitialVal();
    }, [props.passProps,props.pageTitle]);

    const onFocus = (fieldName) => {
        let error = { ...errors };
        if (error[fieldName]) {
            delete error[fieldName];
            setErrors(error);
        }
    };

    const onSubmit = () => {
        let newErrors = {};
        const { degreeTitle, degreeLevel, major, institution, graduationDate, city, gradeValue } = eduFormData;
        const fields = { degreeTitle, degreeLevel, major, institution, graduationDate, city, gradeValue };

        Object.keys(fields).forEach((key) => {
            let value = fields[key];
            if (typeof value === 'string') {
                value = value.trim();
            } else if (typeof value === 'object') {
                value = JSON.stringify(value).trim();
            }

            if (!value || (typeof value === 'string' && value === '{}')) {
                if (key !== 'gradeValue') {
                    newErrors[key] = 'Required*';
                }
            } else {
                if ('gradeValue' === key) {
                    if ((isNaN(value)) || (!/^[0-9]+(\.[0-9]{1,2})?$/.test(parseFloat(value)))) {
                        newErrors[key] = 'Please enter a valid result value';
                    } else if ((eduFormData.gradingSystem === 1) && (parseFloat(value) < 2 || parseFloat(value) > 4)) {
                        newErrors[key] = 'Please enter a valid result value';
                    } else if ((eduFormData.gradingSystem === 0) && (parseFloat(value) < 33 || parseFloat(value) > 100)) {
                        newErrors[key] = 'Please enter a valid result value';
                    }
                }
            }
        });

        setErrors(newErrors);
        return newErrors;
    }


    const handleChange = (name, value) => {
        setEduFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const updateObjectState = (objName, objData) => {
        let error = { ...errors };
        switch (objName) {
            case 'City':
                delete error.city;
                handleChange('city', objData);
                setErrors(error);
                break;
            case 'Degree Level':
                delete error.degreeLevel;
                handleChange('degreeLevel', objData);
                setErrors(error);
                break;
            case 'Major':
                delete error.major;
                handleChange('major', objData);
                setErrors(error);
                break;
            default:
                delete error.institution;
                handleChange('institution', objData);
                setErrors(error);
                break;
        }
    };

    const childViewRender = (val) => {
        setSelectedVal(val);
        setVisible(true);
    };

    const getDataForSelectedVal = () => {
        switch (selectedVal) {
            case 'City':
                return CitiesList;
            case 'Degree Level':
                return DegreeLevel;
            case 'Major':
                return DegreeMajor;
            default:
                return InstituteList;
        }
    };

    const getModifyVal = () => {
        switch (selectedVal) {
            case 'City':
                return true;
            case 'Degree Level':
                return false;
            case 'Major':
                return false;
            default:
                return true;
        }
    };

    const showDateTimePicker = () => {
        Keyboard.dismiss();
        setEduFormData((prevState) => ({
            ...prevState,
            isVisibldatepicker: true
        }));
    };

    const hideDateTimePicker = () => {
        setEduFormData((prevState) => ({
            ...prevState,
            graduationDate: prevState.graduationDate,
            isVisibldatepicker: false
        }));
    };

    const handleDatePicked = useCallback((event, newDate) => {
        let error = { ...errors };
        delete error.educationDate;
        let formatDate = moment(newDate,'MM/YYYY').format('MM/YYYY')
        if (event === 'dismissedAction') {
            hideDateTimePicker();
        }
        else {
            setEduFormData((prevState) => ({
                ...prevState,
                graduationDate: formatDate,
                isVisibldatepicker: false,
            }));
        }
        setErrors(error);
    }, [eduFormData.graduationDate, isVisibldatepicker]);

    const GradeSystemButtons = useMemo(() => ([
        {
            id: 0,
            label: 'Percentage',
            value: 'percentage'
        },
        {
            id: 1,
            label: 'CGPA',
            value: 'cgpa'
        }
    ]), []);

    function closeModalFunc() {
        props.closeModal();
    }

    const doneActionFunc = async () => {
        let errorObj = onSubmit();
        if (Object.keys(errorObj).length === 0) {
            saveUpdateUserEducation();
        }
    }

    const closeInnerModal = () => {
        setSelectedVal(null);
        setVisible(false);
    };

    const saveUpdateUserEducation = () => {
        Keyboard.dismiss();
        const education = {
            Id: eduFormData.Id,
            degreeTitle: eduFormData.degreeTitle,
            degreeLevel: eduFormData.degreeLevel,
            major: eduFormData.major,
            institution: eduFormData.institution,
            graduationDate: eduFormData.graduationDate,
            city: eduFormData.city,
            gradingSystem: eduFormData.gradingSystem,
            gradeValue: eduFormData.gradeValue
        };
        console.log("education in saveUpdateUserEducation------------------ ", education)
        props.saveUpdateSingleObject('UserEducation', eduFormData.Id, education, props.action);
        props.closeModal();
    };

    return (
        <>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                    <View style={{ backgroundColor: '#00bac9', padding: 15 }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => closeModalFunc()}>
                                <Icon name="arrow-back" size={24} color="#ffffff" />
                            </TouchableOpacity>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={styles.mainHeading}>{PageTitle}</Text>
                            </View>
                            <TouchableOpacity onPress={() => doneActionFunc()}>
                                <Text style={styles.doneText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.headerContainer}>
                        <KeyboardAwareScrollView
                            style={globalStyle.container1}
                            enableOnAndroid
                            enableResetScrollToCoords={false}
                            automaticallyAdjustContentInsets={false}
                            keyboardShouldPersistTaps='always'
                            keyboardOpeningTime={0}
                            extraHeight={Platform.select({ android: 250 })} >
                            <View style={styles.textcontainer}>
                                <TextInput
                                    label="Degree Title"
                                    value={degreeTitle}
                                    maxLength={100}
                                    onChangeText={val => handleChange('degreeTitle', val)}
                                    onKeyPress={() => onFocus('degreeTitle')}
                                    keyboardType={Platform.OS === 'android' ? 'email-address' : 'ascii-capable'}
                                    ref={degtitleRef} onFocus={() => onFocus('degreeTitle')} error={errors.degreeTitle}
                                    labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }}
                                    style={{ backgroundColor: '#ffffff', flexDirection: 'row', flex: 1, fontFamily: fonts.regular }}
                                    theme={{
                                        colors: {
                                            primary: '#00bac9'
                                        },
                                    }}
                                />
                                <View>
                                    <TouchableWithoutFeedback onPress={() => childViewRender('Degree Level')}>
                                        <View>
                                            <TextInput
                                                label="Degree Level" value={degreeLevel === undefined ? '' : degreeLevel.Text === undefined ? '' : degreeLevel.Text}
                                                editable={false}
                                                ref={deglevelRef} onFocus={() => onFocus('degreeLevel')} error={errors.degreeLevel}
                                                labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }}
                                                style={{ backgroundColor: '#ffffff', fontFamily: fonts.regular, color: '#000000' }}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View>
                                    <TouchableWithoutFeedback onPress={() => childViewRender('Major')}>
                                        <View>
                                            <TextInput
                                                label="Major" value={major === undefined ? '' : major.Text === undefined ? '' : major.Text}
                                                editable={false}
                                                ref={majorRef} onFocus={() => onFocus('major')} error={errors.major} labelTextStyle={{ fontFamily: fonts.regular }}
                                                titleTextStyle={{ fontFamily: fonts.regular }} style={{ backgroundColor: '#ffffff', fontFamily: fonts.regular, color: '#000000' }}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View>
                                    <TouchableWithoutFeedback onPress={() => childViewRender('Institution')}>
                                        <View>
                                            <TextInput
                                                label="Institute" value={institution === undefined ? '' : institution.Text === undefined ? '' : institution.Text}
                                                editable={false}
                                                ref={institutionRef} onFocus={() => onFocus('institution')} error={errors.institution} labelTextStyle={{ fontFamily: fonts.regular }}
                                                titleTextStyle={{ fontFamily: fonts.regular }}
                                                style={{ backgroundColor: '#ffffff', fontFamily: fonts.regular, color: '#000000' }}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TouchableOpacity onPress={() => showDateTimePicker()}>
                                        <View>
                                            <TextInput
                                                label="Year Completion" editable={false}
                                                value={graduationDate}
                                                // value={graduationDate && graduationDate !== ''
                                                //     ? moment(graduationDate,'MM/YYYY').format('MM/YYYY')
                                                //     : ''}
                                                labelTextStyle={{ fontFamily: fonts.regular }}
                                                titleTextStyle={{ fontFamily: fonts.regular }}
                                                style={{ backgroundColor: '#ffffff', fontFamily: fonts.regular }}
                                                ref={graduationdateRef} onFocus={() => onFocus('graduationDate')} error={errors.graduationDate}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    {isVisibldatepicker && (
                                        <MonthPicker
                                            onChange={handleDatePicked}
                                            minimumDate={moment('01/1947', 'MM/YYYY').toDate()}
                                            maximumDate={moment().add(5, 'y').toDate()}
                                            value={graduationDate !== '' ? moment(graduationDate, 'MM/YYYY').toDate() : moment(new Date(), 'MM/YYYY').toDate()}
                                            locale="en"
                                        />
                                    )}
                                </View>
                                <View>
                                    <TouchableWithoutFeedback onPress={() => childViewRender('City')}>
                                        <View>
                                            <TextInput
                                                label="Location" value={city === undefined ? '' : city.Text === undefined ? '' : city.Text}
                                                editable={false}
                                                ref={cityRef} onFocus={() => onFocus('city')} error={errors.city} labelTextStyle={{ fontFamily: fonts.regular }}
                                                titleTextStyle={{ fontFamily: fonts.regular }}
                                                style={{ backgroundColor: '#ffffff', fontFamily: fonts.regular, color: '#000000' }}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: '#A9A9A9' }}>Result Type: </Text>
                                    <RadioGroup
                                        radioButtons={GradeSystemButtons}
                                        selectedId={gradingSystem}
                                        layout='row'
                                        buttonColor={'#00bac9'}
                                        buttonInnerColor={'#00bac9'}
                                        onPress={(val) => handleChange('gradingSystem', val)}
                                        labelStyle={{ fontSize: 18, fontFamily: fonts.regular }}
                                        style={[styles.confirmButtons, { fontFamily: fonts.regular }]}
                                        theme={{
                                            colors: {
                                                primary: '#00bac9'
                                            },
                                        }}
                                    />
                                </View>
                                <TextInput
                                    label='Result Value'
                                    onKeyPress={() => onFocus('gradeValue')}
                                    keyboardType='numeric'
                                    value={gradeValue === null ? '' : gradeValue.toString()}
                                    onChangeText={(val) => handleChange('gradeValue', val)}
                                    labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }}
                                    style={{ backgroundColor: '#ffffff', fontFamily: fonts.regular }}
                                    ref={gradeValueRef} onFocus={() => onFocus('gradeValue')} error={errors.gradeValue}
                                    theme={{
                                        colors: {
                                            primary: '#00bac9'
                                        },
                                    }}
                                />
                                <View style={{ marginBottom: 80 }}>
                                </View>

                            </View>

                        </KeyboardAwareScrollView>
                    </View>
                </View>

            </View>

            {/*----------Modal---------------  */}
            <View>
                {selectedVal !== null && (
                    <Modal
                        visible={visible}
                        transparent={true}
                        onRequestClose={() => closeInnerModal()}
                        animationType="fade"
                    >
                        <BasicProfileFiltersScreen PageTitle={selectedVal}
                            ObjectVal={getDataForSelectedVal()} UpdateObjectState={updateObjectState}
                            canModify={getModifyVal()} closeModal={closeInnerModal} />

                    </Modal>
                )}
            </View>
        </>
    );
};

export default EducationForm;

const styles = StyleSheet.create({
    mainHeading: {
        fontSize: 20,
        color: '#ffffff',
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    doneText: {
        fontSize: 16,
        color: '#ffffff',
    },
    headerContainer: {
        flex: 1,
        paddingTop: 5,
        backgroundColor: '#ffffff'
    },
    textcontainer: {
        paddingHorizontal: 20
    },
    headingText: {
        textAlign: 'center',
        fontSize: 30,
        marginBottom: 10,
        fontFamily: fonts.regular,
        color: '#00bac9'
    },
    confirmButtons: {
        justifyContent: 'space-around',
        marginTop: 20,
        marginLeft: '-10%'
    },
    buttonStyle: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    buttonTextStyle: {
        fontSize: 18,
        paddingHorizontal: 20,
        paddingVertical: 5,
        fontFamily: fonts.regular,
    },
    deleteButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: 'silver'
    },
});