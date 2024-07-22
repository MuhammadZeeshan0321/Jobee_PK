import { View, StyleSheet } from "react-native";
import RadioGroup from 'react-native-radio-buttons-group';

function ConfirmExperience(props) {
    return (
        <View style={styles.confirmContainer}>
            <RadioGroup
                radioButtons={props.radioButtons}
                selectedId={props.initialVal}
                layout='row'
                onPress={props.onRadioButtonChange}
                containerStyle={{justifyContent: 'space-around'}}
                labelStyle={{ fontSize: 18, marginLeft: 5 }}
            />
        </View>
    );

}

export default ConfirmExperience;

const styles = StyleSheet.create({
    confirmContainer: {
        marginTop: 15,
        marginBottom: 15
    }
});