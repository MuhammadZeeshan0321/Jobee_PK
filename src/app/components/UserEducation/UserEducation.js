
import { StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

import Header from "../CommonComponent/Header";
import Button from "../CommonComponent/Button";
import DataHeader from "../CommonComponent/DataHeader";


function UserEducation(props) {
    const userEducationHandler = () => {
        props.ButtonEvent();
    }

    const moreButtonHandler = (education) => {
        props.moreButtonEvent('Education', education);
    };

    return (
        <View style={styles.container}>
            {
                props.isEmptyState ? (
                    <View>
                        <Header headerText="Education" innerText="What's your educational background?" isDisplay={true} />
                        <Button buttonText="Add Education" buttonEvent={() => userEducationHandler()} />
                    </View>
                ) : (
                    <View>
                        <DataHeader headerText="Education" buttonText="Add" buttonEvent={() => userEducationHandler()} />
                        <View>
                            {
                                props.UserEducation.map((education, i) => {
                                    return (
                                        <View key={`${education.Id}_${i}`}>
                                            <View style={styles.educationContainer}>
                                                <View style={{ width: '80%' }}>
                                                    <Text style={styles.degreeTitleText}>{education.degreeTitle}</Text>
                                                    <Text style={styles.degreeTitleText}>{education.major.Text}</Text>
                                                    <Text style={styles.institutionText}>{education.institution.Text}</Text>
                                                    <Text style={styles.educationText}>{education.city.Text} - Pakistan</Text>
                                                    <Text style={styles.educationText}>{education.graduationDate}</Text>
                                                </View>
                                                <View style={{ width: '15%' }}>
                                                    <TouchableOpacity onPress={() => moreButtonHandler(education)} style={{ width: '100%', paddingTop: 5, paddingLeft: 5 }} >
                                                        <Icon name="more-vert" size={40} color='#00bac9' style={{ textAlign: 'center' }} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            {
                                                !(i === props.UserEducation.length - 1) &&
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

export default UserEducation;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingTop: 20,
    },
    educationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 5,
        marginLeft: 10
    },
    separator: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        marginHorizontal: 10
    },
    degreeTitleText: {
        fontSize: 16,
        paddingVertical: 2,
        color: "#606060",
        fontFamily: Platform.OS === 'ios' ? 'opensans_regular' : 'opensans_regular',
    },
    institutionText: {
        fontSize: 16,
        paddingVertical: 2,
        color: "#606060",
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    educationText: {
        fontSize: 14,
        paddingVertical: 2,
        color: 'gray',
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    }
});