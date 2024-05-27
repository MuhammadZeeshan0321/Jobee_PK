import { View, Text, StyleSheet } from "react-native";

function ApplicationsScreen () {
   return (
    <View style={ styles.root }>
        <Text>This is Applications Screen</Text>
    </View>
   );
}

export default ApplicationsScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center'
    }
});