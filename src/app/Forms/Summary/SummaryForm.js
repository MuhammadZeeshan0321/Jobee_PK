import React, { useState, useEffect } from 'react';
import { Platform, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import Icon from 'react-native-vector-icons/Ionicons';

import Screen from '../../Constants/Screen';

function SummaryForm({ pageTitle, passProps, saveUpdateMultipleObject, closeModal }) {
    const [summFormData, setSummFormData] = useState({
        isdisable: true,
        PageTitle: 'Add Summary',
    });
    const [editorContent, setEditorContent] = useState('');
    const richText = React.useRef()

    useEffect(() => {
        const screenAnalytics = new Screen();
        if (passProps !== '') {
            setEditorContent(passProps);
            setSummFormData((prevState) => ({
                ...prevState,
                PageTitle: pageTitle,
            }));
        }

        const initAnalytics = () => {
            screenAnalytics.googleAnalyticsView('User Profile/Summary');
            setSummFormData((prevState) => ({
                ...prevState,
                isdisable: false
            }));
        };

        initAnalytics();

    }, []);

    function closeModalFunc() {
        closeModal();
    }
    const doneActionFunc = async () => {
        saveUpdateMultipleObject('ProfileSummary', editorContent);
        closeModal();
    }
    const handleHead = ({ tintColor }) => <Text style={{ color: tintColor }}>H1</Text>
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                <View style={{ backgroundColor: '#00bac9', padding: 15 }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={closeModalFunc}>
                            <Icon name="arrow-back" size={24} color="#ffffff" />
                        </TouchableOpacity>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={styles.mainHeading}>{summFormData.PageTitle}</Text>
                        </View>
                        <TouchableOpacity onPress={doneActionFunc}>
                            <Text style={styles.doneText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <RichEditor
                        ref={richText}
                        style={styles.editor}
                        placeholder='Add profile summary'
                        initialContentHTML={editorContent}
                        onChange={text => {
                            setEditorContent(text);
                        }}
                    />
                    <RichToolbar
                        editor={richText}
                        actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1,
                        actions.insertBulletsList, actions.insertOrderedList]}
                        iconMap={{ [actions.heading1]: handleHead }}
                    />
                </View>
            </View>

        </View>
    );
}

export default SummaryForm;

const styles = StyleSheet.create({
    mainHeading: {
        fontSize: 20,
        color: '#ffffff',
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    doneText: {
        fontSize: 16,
        color: '#ffffff',
    },
    editor: {
        flex: 1,
        padding: 0,
        backgroundColor: 'white',
    },
});