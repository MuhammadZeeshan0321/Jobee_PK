import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import LinkBreak from '../../../assets/img/linkBreak-80.png';

function NetworkErrorScreen(props) {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image style={styles.imageLogo} source={LinkBreak} />
                <Text style={{ fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular', fontSize: 20, textAlign: 'center' }}>No internet connection</Text>
            </View>
            <View style={styles.signinContainer}>
                <TouchableOpacity onPress={props.Retry} style={styles.signinOuter}>
                    <Text style={styles.signinText}>
                        retry
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default NetworkErrorScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: "center",
    },
    imageContainer: {
        alignItems: "center",
        marginBottom: 20
    },
    imageLogo: {
        width: 120,
        height: 120
    },
    menuTextContainer: {
        marginBottom: 20
    },
    menuText: {
        fontSize: 20,
        fontFamily: Platform.OS === 'ios' ? 'opensans-bold' : 'opensans_bold',
        textAlign: "center"
    },
    profileInstructionContainer: {
        marginBottom: 20
    },
    profileInstruction: {
        fontSize: 16,
        textAlign: "center",
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    btnContainer: {
        alignItems: "center"
    },
    btnOuter: {
        width: "60%",
        margin: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#1D8BDF",
        borderRadius: 30
    },
    btnText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 18,
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    signinContainer: {
        alignItems: "center",
        marginBottom: 20
    },
    signinOuter: {
        paddingTop: 10,
        width: "18%",
        borderBottomWidth: 1,
        borderColor: "#1D8BDF"
    },
    signinText: {
        color: "#1D8BDF",
        textAlign: "center",
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    }
});