
import { StyleSheet, View, Platform } from "react-native";

import Header from "../../CommonComponent/Header";
import Button from "../../CommonComponent/Button";
import DataHeader from "../../CommonComponent/DataHeader";
import Html from 'react-native-html-component';

function ProfileSummary({isEmptyState, ProfileSummary, isDisable, ButtonEvent, EditButtonEvent }) {

    const addSummaryHandler = () => {
        ButtonEvent();
    };
    const editSummaryHandler = () => {
        EditButtonEvent();
    };

    return (
        <View style={styles.container}>
            {
                isEmptyState ? (
                    <View>
                        <Header headerText="Summary" innerText="Adding a summary is a quick and easy way to highlight your experience and interests." isDisplay={true} />
                        <Button buttonText="Add Summary" buttonEvent={addSummaryHandler} isDisabled={isDisable} />
                    </View>
                ) : (
                    <View>
                        <DataHeader headerText="Summary" buttonText="Edit" isDisabled={isDisable} buttonEvent={editSummaryHandler} />
                        <View style={styles.summary}>
                            <Html html={ProfileSummary} baseFontStyle={styles.summaryText} tagsStyles={styles.summaryText} />
                        </View>
                    </View>
                )}
        </View>
    );
}

export default ProfileSummary;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingTop: 20,
    },
    summaryText: {
        fontSize: 14,
        textAlign: 'justify',
        color: "#606060",
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    summary: {
        paddingHorizontal: 10,
        paddingTop: 5
    }
});