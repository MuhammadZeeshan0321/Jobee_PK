
import { StyleSheet, View, Text, Platform } from "react-native";

import Header from "../../CommonComponent/Header";
import Button from "../../CommonComponent/Button";
import DataHeader from "../../CommonComponent/DataHeader";
import ProgressBar from "../../CommonComponent/ProgressBar";


function Skills(props) {
    const UserSkillsHandler = () => {
        props.ButtonEvent();
    }
    const editUserSkillsHandler = () => {
        props.EditButtonEvent();
    };
    return (
        <View style={styles.container}>
            {
                props.isEmptyState ? (
                    <View>
                        <Header headerText="Skills" innerText="What kind of skills do you have?" isDisplay={true} />
                        <Button buttonText="Add Skills" buttonEvent={UserSkillsHandler} />
                    </View>
                ) : (
                    <View>
                        <DataHeader headerText="Skills" buttonText="Edit" buttonEvent={editUserSkillsHandler} />
                        <View>
                            {
                                props.UserSkills.map((skill) => {
                                    return (
                                        <View key={skill.Id} style={styles.skillContainer}>
                                            <View style={{ width: '90%' }}>
                                                <Text style={styles.skillText}>{skill.skillName}</Text>
                                                <View style={{ paddingTop: 5 }}>
                                                    <ProgressBar
                                                        row
                                                        borderRadius={10}
                                                        progress={skill.skillLevel}
                                                        barColor={skill.isPrimary ? '#00bac9' : '#4E4E4E'}
                                                        borderColor={skill.isPrimary ? '#00bac9' : '#4E4E4E'}
                                                        fillColor='#fff'
                                                        borderWidth={1}
                                                        height={8}//{Platform.OS === 'ios'? 8 : 10 }
                                                        maxRange={5}
                                                    />
                                                </View>
                                            </View>
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
export default Skills;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingTop: 20,
    },
    skillContainer: {
        paddingVertical: 5,
        marginHorizontal: 10
    },
    skillText: {
        fontSize: 14,
        color: "#606060",
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
        marginLeft: 5
    }
});