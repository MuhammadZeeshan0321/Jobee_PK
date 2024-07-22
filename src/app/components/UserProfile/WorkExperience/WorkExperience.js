import { useState, useMemo } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, Platform } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

import ConfirmExperience from './ConfirmExperience/ConfirmExperience';
import Header from '../../CommonComponent/Header';
import Button from '../../CommonComponent/Button';
import DataHeader from '../../CommonComponent/DataHeader';
import Html from 'react-native-html-component';

function WorkExperience(props) {
    const [radioVal, setRadioVal] = useState(0);

    const setRadioButtons = useMemo(() => ([
        {
            id: 0,
            label: 'No',
            value: 'no',
            color: '#00bac9', // Radio button color
            borderColor: '#00bac9', // Border color
        },
        {
            id: 1,
            label: 'Yes',
            value: 'yes',
            color: '#00bac9', // Radio button color
            borderColor: '#00bac9', // Border color
        }
    ]), []);

    const radioButtonChangeHandler = (value) => {
        setRadioVal(value);
    }

    const workExperienceHandler = () => {
        props.ButtonEvent();
    }

    const moreButtonHandler = (work) => {
        props.moreButtonEvent('WorkHistory', work);
    }

    return (
        <View style={styles.container}>
            {
                props.isEmptyState ? (
                    <View>
                        <Header headerText="Work History" innerText="Do you have a prior work experience?" isDisplay={true} />
                        <ConfirmExperience
                            radioButtons={setRadioButtons}
                            onRadioButtonChange={radioButtonChangeHandler}
                            initialVal={radioVal}
                        />
                        {
                            radioVal === 1 && <Button buttonText="Add Work Experience" buttonEvent={workExperienceHandler} />
                        }
                    </View>
                ) : (
                    <View>
                        <DataHeader headerText="Work History" buttonText="Add" buttonEvent={workExperienceHandler} />
                        <View>
                            {
                                props.WorkHistory.map((work, i) => {
                                    return (
                                        <View key={work.Id}>
                                            <View style={styles.workHistoryContainer}>
                                                <View style={{ width: '80%' }}>
                                                    <Text style={styles.jobTitleText}>{work.jobTitle.Text}</Text>
                                                    <Text style={styles.companyNameText}>{work.companyName.Text}</Text>
                                                    <Text style={styles.workHistoryText}>{work.city.Text}, {work.country.Text}</Text>
                                                    <Text style={styles.workHistoryText}>{work.durationFrom} - {work.durationTo === '' ? 'Continue' : work.durationTo}</Text>
                                                    {work.discription === '' ? <Text /> : <Html html={work.discription} baseFontStyle={styles.descriptionText} tagsStyles={styles.descriptionText} />}

                                                </View>
                                                <View style={{ width: '15%' }}>
                                                    <TouchableOpacity onPress={(work) => moreButtonHandler(work)} style={{ width: '100%', paddingTop: 5, paddingLeft: 5 }} >
                                                        <Icon name="more-vert" size={40} color='#00bac9' style={{ textAlign: 'center' }} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            {
                                                !(i === props.WorkHistory.length - 1) &&
                                                <View style={styles.separator} />
                                            }
                                        </View>
                                    );
                                })
                            }
                        </View>
                    </View>
                )}
        </View>
    );
}

export default WorkExperience;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingTop: 20,
    },
    workHistoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 5,
        marginLeft: 10
    },
    jobTitleText: {
        fontSize: 16,
        paddingVertical: 2,
        color: "#606060",
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    companyNameText: {
        fontSize: 16,
        paddingVertical: 2,
        color: "#606060",
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    workHistoryText: {
        fontSize: 14,
        paddingVertical: 2,
        color: 'gray',
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    descriptionText: {
        fontSize: 14,
        paddingVertical: 5,
        textAlign: 'justify',
        color: "#606060",
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    separator: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        marginHorizontal: 10
    },
});