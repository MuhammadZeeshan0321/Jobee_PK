import { StyleSheet, TouchableOpacity, View, Text, Platform } from "react-native";


function DataHeader(props) {
    return (
        <View style={styles.headercontainer}>
            <Text style={styles.Heading}>{props.headerText}</Text>
            <TouchableOpacity onPress={props.buttonEvent} disabled={props.isDisabled}>
                <Text style={styles.buttonText}>{props.buttonText}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default DataHeader;

const styles = StyleSheet.create({
    headercontainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: '#F2F2F2',
        paddingVertical: 5,
        shadowColor: '#F2F2F2',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 1.5,
        elevation: 1,
    },
    Heading: {
        textAlign: "left",
        fontSize: 20,
        color: "#606060",
        paddingLeft: 10,
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    buttonText: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingTop: 2.5,
        color: '#00bac9',
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    }
});