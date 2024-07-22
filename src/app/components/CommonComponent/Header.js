import { StyleSheet, View, Text, Platform } from "react-native";

function Header(props) {
    return (
        <View>
            <Text style={styles.Heading}>{props.headerText}</Text>
            {
                props.isDisplay && <Text style={styles.innerText}>{props.innerText}</Text>

            }
        </View>
    );
}

export default Header;

const styles = StyleSheet.create({
    Heading: {
        textAlign: "center",
        fontSize: 20,
        color: "#606060",
        backgroundColor: '#F2F2F2',
        paddingVertical: 5,
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
        shadowColor: '#F2F2F2',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 1.5,
        elevation: 1,
    },
    innerText: {
        fontSize: 16,
        padding: 20,
        color: "#606060",
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    }
});
