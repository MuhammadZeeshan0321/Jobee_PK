import { StyleSheet, Text, Platform, TouchableOpacity } from 'react-native';

function Button({ buttonEvent, buttonText, isDisabled }) {
    return (
        <TouchableOpacity
            style={styles.btnOuter}
            onPress={buttonEvent}
            disabled={isDisabled}
            underlayColor="#fff"
        >
            <Text style={styles.btnText}>
                {buttonText}
            </Text>
        </TouchableOpacity>
    );
}

export default Button;

const styles = StyleSheet.create({
    btnOuter: {
        width: '90%',
        marginHorizontal: 20,
        marginVertical: 10,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#00bac9'
    },
    btnText: {
        color: '#00bac9',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    }
});