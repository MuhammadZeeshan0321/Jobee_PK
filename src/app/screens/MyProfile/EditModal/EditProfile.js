import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Platform, Modal } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SkillsForm from '../../../Forms/Skills/SkillsForm';
import EducationForm from '../../../Forms/Education/EducationForm';


function EditProfile({ stateData, addEditSingleObjectInState, closeModal, deletion }) {
    const [selectVal, setSelectVal] = useState('');
    const selectValRef = useRef(null);

    const editModalButtonHandler = () => {
        console.log("enter into editModalButtonHandler------------------- ", stateData.callFrom)
        switch (stateData.callFrom) {
            case 'Skills':
                setSelectVal('Skills');
                break;
            case 'WorkHistory':
                setSelectVal('WorkHistory');
                break;
            case 'Education':
                setSelectVal('Education');
                break;
            case 'References':
                setSelectVal('References');
                break;
            case 'Awards':
                setSelectVal('Awards');
                break;
            case 'Projects':
                setSelectVal('Projects');
                break;
            default:
                setSelectVal('Certifications');
                break;
        }
        // if (Platform.OS !== 'ios') {
        //     closeModal()
        // }

    }

    function closeInnerModal() {
        setSelectVal(null);
        closeModal();
    }

    const addAndEditButtonHandler = () => {
        console.log("enter into Fomr Function********************** ", selectVal)
        let pageTitle = `Edit ${selectVal}`;
        console.log("enter into Fomr Function pageTitle********************** ", pageTitle)
        return (
            <Modal
                visible={selectVal !== null}
                transparent={true}
                onRequestClose={closeInnerModal}
                animationType="fade"
            >
                {/* {selectVal === stateData.callFrom &&
                    <SkillsForm pageTitle={pageTitle} passProps={stateData.calledDataObject} saveUpdateSingleObject={addEditSingleObjectInState} closeModal={closeInnerModal} />
                } */}
                {selectVal === stateData.callFrom &&
                    <EducationForm pageTitle={pageTitle} passProps={stateData.calledDataObject} saveUpdateSingleObject={addEditSingleObjectInState} closeModal={closeInnerModal} action={'Edit'}/>}
            </Modal >
        );
    }

    const deleteModalButtonHandler = () => {
        deletion();
    }
    return (
        <>
            <View style={{
                position: 'absolute', width: '100%', bottom: 0,
                height: 200, backgroundColor: '#ffffff', borderTopWidth: 2, borderTopColor: '#00bac9'
            }}>
                <TouchableOpacity onPress={() => editModalButtonHandler()} style={styles.buttonStyle}>
                    <MaterialIcons name="more-vert" size={36} />
                    <Text style={styles.buttonTextStyle}>Edit </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteModalButtonHandler()} style={styles.buttonStyle}>
                    <MaterialIcons name="delete" size={36} />
                    <Text style={styles.buttonTextStyle}>Delete </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => closeModal()} style={styles.buttonStyle}>
                    <MaterialIcons name="cancel" size={36} />
                    <Text style={styles.buttonTextStyle}>Cancel </Text>
                </TouchableOpacity>
            </View>

            {selectVal !== '' && addAndEditButtonHandler()}
        </>
    );
}

export default EditProfile;

const styles = StyleSheet.create({
    buttonStyle: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    buttonTextStyle: {
        fontSize: 18,
        paddingHorizontal: 20,
        paddingVertical: 5,
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },

});