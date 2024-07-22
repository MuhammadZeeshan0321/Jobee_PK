import {View, Text, StyleSheet} from 'react-native';


function AppliedJobStatus(props) {
    return (
        <View style={styles.root}>
            <Text>This is Applied Job status Component</Text>
        </View>
    );
}

export default AppliedJobStatus;

const styles = StyleSheet.create({
    root: {
        flex:1,
        padding: 10
    }
});