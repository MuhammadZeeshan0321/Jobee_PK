import { useEffect, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, Modal, Platform, StyleSheet, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import Checkbox from 'expo-checkbox';
import { Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


import skillList from '../../../assets/data/skillListMulti.json';
import Screen from '../../Constants/Screen';
import { styles as outerStyle } from '../../../assets/css/styles';
import { fonts } from '../../utility/auth';
import BasicProfileFiltersScreen from '../../screens/BasicProfile/BasicProfileFilters/BasicProfileFilters';




function SkillsForm(props) {

  const [skillFormData, setSkillFormData] = useState({
    suggestions: [],
    candidateSkillID: 0,
    Id: 0,
    skillName: '',
    skillLevel: 1,
    isPrimary: false,
    selectedSkills: [],
    PageTitle: 'Add Skills',
    modalVisible: false
  });
  const [selectedVal, setSelectedVal] = useState(null);
  const [visible, setVisible] = useState(false);
  const [checkedSkills, setCheckedSkills] = useState({});

  const { Id = 0, skillName = '', isPrimary = false, skillLevel = 1, PageTitle = 'Add Skills', modalVisible = false,
    selectedSkills = [] } = skillFormData;

  useEffect(() => {
    const skills = skillList;
    const screenAnalytics = new Screen();
    let _Skills = [];

    setSkillFormData((prevState) => ({
      ...prevState,
      suggestions: skills
    }));

    const initAnalytics = () => {
      screenAnalytics.googleAnalyticsView('User Profile/Skills');
    };

    const setInitialVal = () => {
      if (props.passProps.Id === -1) {
        setSkillFormData((prevState) => ({
          ...prevState,
          PageTitle: props.pageTitle
        }));
      } else {
        props.passProps.map(skill => {
          _Skills.push({
            Id: skill.Id,
            skillName: skill.skillName,
            skillLevel: skill.skillLevel,
            isPrimary: skill.isPrimary,
          });
        });
        setSkillFormData((prevState) => ({
          ...prevState,
          selectedSkills: _Skills,
          PageTitle: props.pageTitle
        }));
console.log("_Skills *********************** ", _Skills)
        const initialCheckedSkills = _Skills.reduce((acc, skill) => {
          acc[skill.Id] = skill.isPrimary;
          return acc;
        }, {});
        setCheckedSkills(initialCheckedSkills);
      }
    }

    initAnalytics();
    setInitialVal();
  }, []);

  const removeSkillsHandler = (skill, index) => {
    const skillList = [...skillFormData.selectedSkills.slice(0).reverse()];
    // const skillList = Object.assign([], skillFormData.selectedSkills.slice(0).reverse());
    skillList.splice(index, 1);
    const slillObj = skillList.slice(0).reverse();
    setSkillFormData((prevState) => ({
      ...prevState,
      selectedSkills: slillObj
    }));
  };

  const decreaseSkillHandler = (skill) => {
    if (skill.skillLevel > 1) {
      let ind = skillFormData.selectedSkills.findIndex((obj) => {
        if (skill.Id === 0) {
          return obj.skillName === skill.skillName;
        } else {
          return obj.Id === skill.Id;
        }
      });
      let skillObj = [...skillFormData.selectedSkills];
      skillObj[ind].skillLevel = skill.skillLevel - 1;
      setSkillFormData((prevState) => ({
        ...prevState,
        selectedSkills: skillObj
      }));
    }
  }

  const increaseSkillHandler = (skill) => {
    if (skill.skillLevel <= 4) {
      let ind = skillFormData.selectedSkills.findIndex((obj) => {
        if (skill.Id === 0) {
          return obj.skillName === skill.skillName;
        } else {
          return obj.Id === skill.Id;
        }
      });
      let skillObj = [...skillFormData.selectedSkills];
      // let skillObj = Object.assign([], skillFormData.selectedSkills);
      skillObj[ind].skillLevel = skill.skillLevel + 1;
      setSkillFormData((prevState) => ({
        ...prevState,
        selectedSkills: skillObj
      }));
    }
  }


  const handleCheckboxPress = (skillId, index) => {
    let newCheck;
    console.log("checkedSkills---------------------------- ", checkedSkills)
    console.log("skillId---------------------------- ", skillId)
    setCheckedSkills((prev) => {
      newCheck = !prev[skillId];
      return {
        ...prev,
        [skillId]: newCheck,
      }
    });
    console.log("newCheck---------------------------- ", newCheck)
    onChangeCheck(index, newCheck);
  };
  const childViewRender = (val) => {
    setSelectedVal(val);
    setVisible(true);
  };

  const closeModalComp = () => {
    setSelectedVal(null);
    setVisible(false);
  }

  const updateObjectState = (objName, objData) => {
    setSkillFormData((prevState) => ({
      ...prevState,
      Id: objData.ID, skillName: objData.Text
    }));
    addSkillHandler(objData);
  }

  const onChangeCheck = (index, check) => {
    setSkillFormData((prevState) => {
      let skillObj = [...prevState.selectedSkills.slice(0).reverse()];

      check = check ? check : false;
      skillObj[index].isPrimary = check;

      let skillObject = skillObj.slice(0).reverse();

      return {
        ...prevState,
        selectedSkills: skillObject,
      };
    });
  }

  const addSkillHandler = (objData) => {
    let _selectedSkills = [...skillFormData.selectedSkills];
    // let _selectedSkills = Object.assign([], skillFormData.selectedSkills);
    let regex = '';
    try {
      regex = new RegExp(`${objData.Text.trim()}`, 'i');
    } catch (error) {
      var invalid = /[°"§%()\[\]{}=\\?´`'#<>|,;.:+_-]+/g;
      regex = objData.Text.replace(invalid, "");
    };

    if (objData.ID === 0) {
      const { suggestions } = skillFormData;
      const sugestionMatch = suggestions.filter(
        sug => sug.Text.toLowerCase().match(regex) >= 0
      );
      if (sugestionMatch.length > 0) {
        setSkillFormData((prevState) => ({
          ...prevState,
          Id: sugestionMatch[0].ID
        }));
      }
    }
    const sName = objData.Text.replace(/\s+/g, ' ').trim();
    const matchList = _selectedSkills.filter(
      sel => sel.skillName.toLowerCase() === sName.toLowerCase()
    );
    if (matchList.length > 0) {
      setSkillFormData((prevState) => ({
        ...prevState,
        modalVisible: true
      }));
      setTimeout(() => {
        setSkillFormData((prevState) => ({
          ...prevState,
          Id: 0,
          skillName: '',
          modalVisible: false
        }));
      }, 3000);
    } else {
      _selectedSkills.push({
        Id: objData.ID,
        skillName: objData.Text.trim(),
        skillLevel: skillFormData.skillLevel,
        isPrimary: skillFormData.isPrimary
      });
      setSkillFormData((prevState) => ({
        ...prevState,
        selectedSkills: _selectedSkills,
        Id: 0,
        skillName: '',
        skillLevel: 1,
        isPrimary: false
      }));
    }
  };

  function closeModalFunc() {
    props.closeModal();
  }

  const doneActionFunc = async () => {
    props.saveUpdateMultipleObject('UserSkills', skillFormData.selectedSkills);
    props.closeModal();
  }

  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
          <View style={{ backgroundColor: '#00bac9', padding: 15 }}>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={closeModalFunc}>
                <Icon name="arrow-back" size={24} color="#ffffff" />
              </TouchableOpacity>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={styles.mainHeading}>{PageTitle}</Text>
              </View>
              <TouchableOpacity onPress={doneActionFunc}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.headerContainer, { flex: 1 }]}>
            <View>
              <Text style={{ textAlign: 'center', paddingBottom: 5, fontFamily: fonts.regular }}>Set your primary skills by checking the box.</Text>
              <View style={{ marginHorizontal: 20, paddingBottom: 10, paddingTop: -5 }}>
                <TouchableWithoutFeedback onPress={() => childViewRender('Skills')}>
                  <View>
                    <TextInput
                      label="Enter a skill" value={''} editable={false}
                      labelTextStyle={{ fontFamily: fonts.regular }} titleTextStyle={{ fontFamily: fonts.regular }}
                      style={[outerStyle.lightText, outerStyle.leftText, { backgroundColor: '#ffffff',fontFamily: fonts.regular }]}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <KeyboardAwareScrollView
              style={outerStyle.container1}
              enableOnAndroid
              //enableAutomaticScroll
              enableResetScrollToCoords={false}
              automaticallyAdjustContentInsets={false}
              keyboardShouldPersistTaps='always'
              keyboardOpeningTime={10}
              extraHeight={Platform.select({ android: 250 })} >
              <View>
                {selectedSkills.slice(0).reverse().map((skill, index) => {

                  return (
                    <View
                      key={skill.skillName}
                      style={styles.languageContainer}
                    >
                      <View style={{ width: '10%' }}>
                        <TouchableOpacity
                          onPress={() => removeSkillsHandler(skill, index)}>
                          <Icon
                            name="close-circle-outline"
                            size={30}
                            color="#900000"
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.languageText}>
                        <View style={styles.lableText}>
                          <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => handleCheckboxPress(skill.Id, index)}
                          >
                            <Checkbox
                              status={checkedSkills[skill.Id] ? 'checked' : 'unchecked'}
                              color='#00bac9'
                              checked={skill.isPrimary}
                            />
                            <Text style={styles.checkboxLabel}>{skill.skillName}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{ width: '25%', flexDirection: 'row', justifyContent: 'space-around' }} >
                        <TouchableOpacity onPress={() => decreaseSkillHandler(skill)} >
                          <MaterialCommunityIcons name="arrow-left-drop-circle-outline" size={30} color='#00bac9' />
                        </TouchableOpacity>
                        <Text style={{ marginTop: '2.5%', fontSize: 20, fontFamily: fonts.regular }}> {skill.skillLevel} </Text>
                        <TouchableOpacity onPress={() => increaseSkillHandler(skill)} >
                          <MaterialCommunityIcons name="arrow-right-drop-circle-outline" size={30} color='#00bac9' />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>

      </View>
      {/*----------------- Modal FOR check duplicates skills------------------ */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() =>
          setSkillFormData((prevState) => ({
            ...prevState,
            Id: 0,
            skillName: '',
            modalVisible: false
          }))}
        animationType="fade"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 40, borderRadius: 10 }}>
            <Text style={{ padding: 40, fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular', fontSize: 18, color: '#900000' }}>
              {skillName} already exist.
            </Text>
          </View>
        </View>
      </Modal>
      {/* -------Basic Profile Filter Modal-------------- */}
      <View>
        {selectedVal !== null && (
          <Modal
            visible={visible}
            transparent={true}
            onRequestClose={closeModalComp}
            animationType="fade"
          >
            <BasicProfileFiltersScreen PageTitle={selectedVal}
              ObjectVal={skillFormData.suggestions} UpdateObjectState={updateObjectState}
              canModify={true} closeModal={closeModalComp} />
          </Modal>
        )}
      </View>
    </>
  );
}

export default SkillsForm;

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
  headerContainer: {
    paddingTop: 15,
    backgroundColor: '#fff'
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 5,
    marginHorizontal: 20
  },
  languageText: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#eee',
    width: '55%',
    flexDirection: 'row',
    height: '100%', //35,
    paddingLeft: 10,
    paddingVertical: 7,
  },
  lableText: {
    paddingRight: 5,
    paddingTop: 2,
    flexDirection: 'row'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },

});