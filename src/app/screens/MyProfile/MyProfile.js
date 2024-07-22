import axios from "axios";
import { useEffect, useState, useContext, useRef } from "react";
import {
    ScrollView, StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Alert,
    RefreshControl, ActivityIndicator, Platform, PermissionsAndroid, BackHandler, StatusBar,
    Modal
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from "moment";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import ImagePicker from 'react-native-image-crop-picker';



import { apiUrl, makeAjaxRequestAuth, getUserInfo } from "../../utility/auth";
import NetworkErrorScreen from "../DefaultScreen/NetworkError";
import DefaultScreen from "../DefaultScreen/DefaultScreen";
import ProfileOverView from "../../components/UserProfile/ProfileOverview/ProfileOverview";
import ProfilePicture from "../../components/UserProfile/ProfileOverview/ProfileInfo/ProfilePicture";
import ProfileControls from "../../components/UserProfile/ProfileOverview/DropDownListItems/ProfileControls";
import defaultProfileImage from '../../../assets/img/defaultProfile.png';
import { AppContext } from "../../store/app-context";
import Header from "../../components/CommonComponent/Header";
import Button from "../../components/CommonComponent/Button";
import { fonts } from "../../utility/auth";
import defaultProfilePic from '../../../assets/img/userProfile.jpg';
import ProfileSummary from "../../components/UserProfile/ProfileSummary/ProfileSummary";
import SummaryForm from "../../Forms/Summary/SummaryForm";
import Skills from "../../components/UserProfile/Skills/Skills";
import SkillsForm from "../../Forms/Skills/SkillsForm";
import UserEducation from "../../components/UserEducation/UserEducation";
import EducationForm from "../../Forms/Education/EducationForm";
import EditProfile from "./EditModal/EditProfile";
import WorkExperience from "../../components/UserProfile/WorkExperience/WorkExperience";

function MyProfileScreen({ navigation }) {

    const [profileData, setProfileData] = useState({
        isdisable: false,
        isLoading: false,
        editProfileClicked: false,
        showImagePicker: false,
        netStatus: true,
        candidateId: 0,
        refreshing: false,
        isEmailConfirmed: true,
        islogin: false,
        visibleModal: null,
        deleteModal: false,
        callFrom: '',
        calledDataObject: null,
        publicProfileName: '',
        ProfileSummary: '',
        ProfileOverview: {
            BasicProfile: {
                ProfileImage: getdefaultUrl
            },
            BasicWorkExperience: {
                //isExperienced: 0          
            },
        },
        UserSkills: [],
        WorkHistory: [],
        UserEducation: [],
        FunctionalArea: [],
        IndustryList: [],
        HobbiesList: [],
        ReferencesList: [],
        AwardsList: [],
        ProjectsList: [],
        CertificationsList: [],
        LanguagesList: [],
        visible: false,
    });
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [isVisiblePopUp, setIsVisiblePopUp] = useState(false);
    const [formVal, setFormVal] = useState(null);

    const appCtx = useContext(AppContext);

    const getdefaultUrl = () => {
        return getProfileUrl(defaultProfilePic);
    }

    useEffect(() => {
        const initializeData = () => {
            setProfileData(prevState => ({
                ...prevState,
                islogin: appCtx.appLogin,
                isLoading: true
            }));
        }

        initializeData();
        getUserData();
        // Cleanup function to remove the event listener, similar to componentWillUnmount
        return () => {
        };
    }, []);

    const getUserData = async () => {
        const netInfoState = await NetInfo.fetch();
        setProfileData((prevState) => ({
            ...prevState,
            netStatus: netInfoState.isConnected
        }));
        if (netInfoState.isConnected) {
            try {
                const res = await getUserInfo();
                if (res === undefined) {
                    if (profileData.islogin) {
                        setProfileData(prevState => ({
                            ...prevState,
                            islogin: false,
                            isLoading: false
                        }));
                        appCtx.setappLogin(false);
                    }
                } else {
                    const uinfo = JSON.parse(res);
                    console.log("uinfo---", uinfo)
                    setProfileData(prevState => ({
                        ...prevState,
                        islogin: true,
                    }));
                    appCtx.setappLogin(true);
                    appCtx.setUserInfo(uinfo);
                    handleConnectionChange(true, uinfo);
                }
            } catch (error) {
                if (profileData.islogin) {
                    setProfileData(prevState => ({
                        ...prevState,
                        islogin: false,
                        isLoading: false
                    }));
                    appCtx.setappLogin(false);
                }
            }
        }
        else {
            Alert.alert("No Internet Access", "No Internet connection. Make sure Wi-Fi or cellular data is turned on, then try again.");
            setProfileData(prevState => ({
                ...prevState,
                isLoading: false
            }));
        }
    }

    const handleConnectionChange = (appLogin, userInfo) => {
        console.log("in Handle Connection Change appCtx appLogin-----------------", appLogin)
        if (appLogin) {
            setProfileData((prevState) => ({
                ...prevState,
                islogin: true,
                ProfileOverview: {
                    BasicProfile: {
                        ...prevState.ProfileOverview.BasicProfile,
                        email: userInfo.userName
                    },
                    BasicWorkExperience: {
                        ...prevState.ProfileOverview.BasicWorkExperience
                    }
                }
            }));
            makeRemoteRequest(userInfo);
        } else {
            setProfileData(prevState => ({
                ...prevState,
                isLoading: false
            }));
        }
    }


    const reloadThePage = () => {
        getUserData();
        // NetInfo.fetch().then(state => {
        //     if (state.isConnected) {
        //         handleConnectionChange();
        //     }
        // });
    };

    const onRefreshControl = () => {
        setProfileData((prevState) => ({
            ...prevState,
            isdisable: false, refreshing: true
        }));
        console.log("onRefresh Control in appCtx appLogin----------------- ", appCtx.appLogin)
        if (appCtx.appLogin) {
            setProfileData((prevState) => ({
                ...prevState, islogin: true
            }));
            makeRemoteRequest(appCtx.userInfo);
        } else {
            if (appCtx.ismyproTabViewed) {
                appCtx.setMyProTabViewed(false);
            }
            setProfileData((prevState) => ({
                ...prevState,
                islogin: false, refreshing: false, isLoading: false
            }));
        }
    };

    const signOutView = () => {
        onRefreshControl();
    };

    const makeRemoteRequest = (userInfo) => {
        makeAjaxRequestAuth(`${apiUrl}/candidate/userprofile`, userInfo.access_token, userInfo.userId, appCtx).then((resp) => {

            const objData = JSON.parse(resp);
            if (objData.CandidateID === 0) {
                if (appCtx.ismyproTabViewed) {
                    appCtx.setMyProTabViewed(false);
                }
                if (appCtx.isProfileCreated) {
                    appCtx.setIsProfileCreated(false);
                }
                setProfileData((prevState) => ({
                    ...prevState,
                    candidateId: objData.CandidateID,
                    ProfileOverview: {
                        BasicProfile:
                        {
                            firstName: userInfo.firstName === null ? '' : userInfo.firstName,
                            lastName: userInfo.lastName === null ? '' : userInfo.lastName,
                            email: userInfo.userName,
                            mobile: userInfo.phoneNumber === null ? '' : userInfo.phoneNumber,
                            country: {
                                ID: 166,
                                Text: 'Pakistan'
                            },
                            city: {
                                ID: 58,
                                Text: 'Lahore'
                            },
                            ProfileImage: objData.Picture ? objData.Picture : getdefaultUrl
                        },
                        BasicWorkExperience: {},
                    },
                    isLoading: false,
                }));
            } else {
                let skillArray = [],
                    workHistoryArray = [],
                    userEducation = [],
                    functionalArea = [],
                    industoryList = [],
                    hobbiesList = [],
                    referencesList = [],
                    awardsList = [],
                    projectsList = [],
                    certificationsList = [],
                    languagesList = [];
                const profileSummary = objData.Summary === null ? '' : objData.Summary;
                const basicProfile = {
                    firstName: objData.FirstName === null ? '' : objData.FirstName,
                    lastName: objData.LastName === null ? '' : objData.LastName,
                    birthDate: moment(objData.DOB).format('MM/DD/YYYY'),
                    maritalStatus: objData.MaritalStatus,
                    gender: objData.Gender === 'M' ? 0 : 1,
                    email: objData.Email === '' ? userInfo.userName : objData.Email,
                    mobile: objData.Mobile,
                    secondryNumber: objData.HomePhone,
                    addressLine1: objData.AddressLine1,
                    addressLine2: objData.AddressLine2,
                    country: {
                        ID: objData.Nationality,
                        Text: objData.CountryText
                    },
                    city: {
                        ID: objData.CityID,
                        Text: objData.CityText
                    },
                    zipCode: objData.ZipCode,
                    ProfilePercentage: objData.ProfileStrength,
                    ProfileImage: objData.Picture
                };
                const basicWorkExperience = {
                    isExperienced: +objData.haveWorkExp,
                    currentDesignation: objData.haveWorkExp ? { Text: objData.CurrentDesignation } : {},
                    currentCompany: objData.haveWorkExp ? { ID: objData.CurrentCompanyID, Text: objData.CurrentCompanyText } : {},
                    currentExperience: objData.haveWorkExp ? { ID: objData.ExperienceID, Text: objData.ExperienceText } : {},
                    currentSalary: objData.haveWorkExp ? { ID: objData.SalaryRangeID, Text: objData.SalaryRange } : {},
                    currentJobCity: objData.haveWorkExp ? { ID: objData.JobCityID, Text: objData.JobCityText } : {},
                    preferredJobDesignation: objData.haveWorkExp ? {} : { Text: objData.CurrentDesignation },
                    preferredJobCity: objData.haveWorkExp ? {} : { ID: objData.JobCityID, Text: objData.JobCityText },
                    expectedSalary: objData.haveWorkExp ? {} : { ID: objData.SalaryRangeID, Text: objData.SalaryRange }
                };
                objData.CandidateSkills.map((obj) => {
                    skillArray.push({
                        Id: obj.SkillID,
                        skillName: obj.SkillText,
                        skillLevel: obj.Strength,
                        isPrimary: obj.isPrimary
                    });
                });
                objData.CandidateJobHistory.map((obj) => {
                    workHistoryArray.push({
                        Id: obj.CandidateJobHistoryID,
                        jobTitle: { Text: obj.JobTitle },
                        companyName: { ID: obj.CompanyID, Text: obj.CompanyText },
                        durationFrom: obj.StartDate,
                        durationTo: obj.EndDate,
                        referenceEmail: obj.ReferenceEmail,
                        referenceNumber: obj.ReferenceMobile,
                        country: { Text: obj.CountryText },
                        city: { ID: obj.CityID, Text: obj.CityText },
                        discription: obj.Description
                    });
                });
                objData.CandidateDegree.map((obj) => {
                    userEducation.push({
                        Id: obj.CandidateDegreeID,
                        degreeTitle: obj.DegreeTitle,
                        degreeLevel: { ID: obj.DegreeLevelID, Text: obj.DegreeLevel },
                        major: { ID: obj.DegreeMajorID, Text: obj.Major },
                        institution: { ID: obj.InstituteID, Text: obj.InstituteText },
                        graduationDate: `${obj.DegreeMonth.trim()}/${obj.DegreeYear}`,
                        city: { ID: obj.CityID, Text: obj.CityText },
                        gradingSystem: obj.isCGPA,
                        gradeValue: obj.Value
                    });
                });
                objData.CandidateFunctionalArea.map((obj) => {
                    functionalArea.push({
                        Id: obj.FunctionalAreaID,
                        funcAreaName: obj.FunctionalAreaText
                    });
                });
                objData.CandidateIndustry.map((obj) => {
                    industoryList.push({
                        Id: obj.IndustryID,
                        industoryName: obj.IndustryText
                    });
                });
                objData.CandidateReferences.map((obj) => {
                    referencesList.push({
                        Id: obj.CandidateReferenceID,
                        name: obj.Name,
                        company: obj.Company,
                        email: obj.Email,
                        contactNo: obj.PhoneNumber
                    });
                });
                objData.CandidateCertificate.map((obj) => {
                    awardsList.push({
                        Id: obj.CandidateCertificateID,
                        awardTitle: obj.Title,
                        authority: obj.Authority,
                        awardDate: `${obj.StartMonth}/${obj.StartYear}`,
                        awardURL: obj.URL
                    });
                });
                objData.CandidateProjects.map((obj) => {
                    projectsList.push({
                        Id: obj.ProjectID,
                        projectTitle: obj.project,
                        companyName: { ID: obj.CompanyID, Text: obj.CompanyText },
                        projectURL: obj.ProjectURL,
                        customer: obj.Customer,
                        customerURL: obj.CustomerURL,
                        tools: obj.Tools,
                        description: obj.Description
                    });
                });
                objData.CandidateCertification.map((obj) => {
                    certificationsList.push({
                        Id: obj.CandidateCertificationID,
                        certificationName: obj.Title,
                        licenseNumber: obj.Code,
                        certificationAuthority: obj.CertifiedBy,
                        certificationURL: obj.URL,
                        completionDate: moment(obj.DateCompletion).format('MM/DD/YYYY'),
                        isExpire: obj.DateExpiry === '' ? false : true,
                        expiryDate: moment(obj.DateExpiry).format('MM/DD/YYYY')
                    });
                });
                objData.CandidateLanguages.map((obj) => {
                    languagesList.push({
                        Id: obj.LanguageID,
                        languageName: obj.LanguageText,
                        languageLevel: obj.Strength,
                    });
                });
                if (objData.Hobby !== '') {
                    objData.Hobby.split(',').map((obj) => {
                        hobbiesList.push({
                            hobbyName: obj.trim()
                        });
                    });
                }
                if (appCtx.ismyproTabViewed) {
                    appCtx.setMyProTabViewed(false);
                }
                if (appCtx.isProfileCreated) {
                    appCtx.setIsProfileCreated(false);
                }
                setProfileData((prevState) => ({
                    ...prevState,
                    candidateId: objData.CandidateID,
                    publicProfileName: objData.UserName,
                    isEmailConfirmed: objData.EmailConfirmed,
                    ProfileSummary: profileSummary,
                    ProfileOverview: {
                        BasicProfile: basicProfile,
                        BasicWorkExperience: basicWorkExperience,
                    },
                    UserSkills: skillArray,
                    WorkHistory: workHistoryArray,
                    FunctionalArea: functionalArea,
                    UserEducation: userEducation,
                    IndustryList: industoryList,
                    HobbiesList: hobbiesList,
                    ReferencesList: referencesList,
                    AwardsList: awardsList,
                    ProjectsList: projectsList,
                    CertificationsList: certificationsList,
                    LanguagesList: languagesList,
                    isLoading: false,
                    refreshing: false,
                }));
            }
        }).catch((error) => {
            setProfileData((prevState) => ({
                ...prevState,
                isLoading: false, refreshing: false
            }));
            console.log('Error in Candidate UserProfile------', error.message);
        });
    }

    const addMultipleObjectInState = (dataObject, objectState) => {
        const userinfo = appCtx.userInfo;
        console.log("userinfo in addMultiple--------", userinfo)
        console.log("dataObject in addMultiple--------", dataObject)
        console.log("objectState in addMultiple--------", objectState)

        let url = '';
        let ObjectData = {};
        const arrayObject = [];
        switch (dataObject) {
            case 'ProfileOverview':
                makeRemoteRequest(appCtx.userInfo);
                break;
            case 'UserSkills':
                url = `${apiUrl}/candidate/modifyskills`;
                objectState.map((skill) => {
                    arrayObject.push({
                        candidateSkillID: skill.candidateSkillID,
                        skillID: skill.Id,
                        skillText: skill.skillName,
                        strength: skill.skillLevel,
                        isPrimary: skill.isPrimary
                    });
                });
                ObjectData = {
                    userAccountID: userinfo.userId,
                    candidateSkill: arrayObject
                };
                makeAjaxRequest(url, userinfo.access_token, ObjectData, 'UserSkills');
                break;
            case 'FunctionalArea':
                url = `${apiUrl}/candidate/modifyfunctionalarea`;
                objectState.map((func) => {
                    arrayObject.push({
                        FunctionalAreaID: func.Id,
                        CandidateFunctionalAreaID: func.candidateFunctionalAreasID,
                        FunctionalAreaText: func.funcAreaName
                    });
                });
                ObjectData = {
                    userAccountID: userinfo.userId,
                    candidateFunctionalAreas: arrayObject
                };
                makeAjaxRequest(url, userinfo.access_token, ObjectData, 'FunctionalArea');
                break;
            case 'IndustryList':
                url = `${apiUrl}/candidate/modifyIndustry`;
                objectState.map((industry) => {
                    arrayObject.push({
                        IndustryID: industry.Id,
                        candidateIndustryID: industry.candidateIndustryID,
                        IndustryText: industry.industoryName
                    });
                });
                ObjectData = {
                    userAccountID: userinfo.userId,
                    candidateIndustries: arrayObject
                };
                makeAjaxRequest(url, userinfo.access_token, ObjectData, 'IndustryList');
                break;
            case 'LanguagesList':
                url = `${apiUrl}/candidate/modifylanguage`;
                objectState.map((lang) => {
                    arrayObject.push({
                        LanguageID: lang.Id,
                        CandidateLanguageID: lang.candidateLanguageID,
                        LanguageText: lang.languageName,
                        Strength: lang.languageLevel
                    });
                });
                ObjectData = {
                    userAccountID: userinfo.userId,
                    candidateLanguages: arrayObject
                };
                makeAjaxRequest(url, userinfo.access_token, ObjectData, 'LanguagesList');
                break;
            case 'HobbiesList':
                url = `${apiUrl}/candidate/updatehobby`;
                ObjectData = {
                    userAccountID: userinfo.userId,
                    hobbies: Array.prototype.map.call(objectState, s => s.hobbyName).toString()
                };
                makeAjaxRequest(url, userinfo.access_token, ObjectData, 'HobbiesList');
                break;
            default:
                url = `${apiUrl}/candidate/UpdateSummary`;
                ObjectData = {
                    userAccountID: userinfo.userId,
                    Summary: objectState
                };
                makeAjaxRequest(url, userinfo.access_token, ObjectData, 'ProfileSummary');
                break;
        }
        setProfileData((prevState) => ({
            ...prevState,
            [dataObject]: objectState
        }));
    }

    const addEditSingleObjectInState = (dataObject, objectId, objectState, action) => {
        const userinfo = appCtx.userInfo;
        console.log("action in Add Edit Single Object State------------------", action)
        setFormVal(null);
        if (action === 'Add') {
            let _dataobject = [...profileData[dataObject]];
            _dataobject.push(objectState);
            setProfileData((prevState) => ({
                ...prevState,
                [dataObject]: _dataobject
            }));
        } else {
            const index = profileData[dataObject].findIndex((obj) => {
                return obj.Id === objectId;
            });
            const _dataobject = [...profileData[dataObject]];
            _dataobject[index] = objectState;
            setProfileData((prevState) => ({
                ...prevState,
                [dataObject]: _dataobject
            }));
        }
        let url = '';
        let arrayObject = {};
        switch (dataObject) {
            case 'WorkHistory':
                url = `${apiUrl}/candidate/candidateexperience`;
                arrayObject = {
                    UserAccountID: userinfo.userId,
                    CandidateJobHistoryID: objectState.Id,
                    JobTitle: objectState.jobTitle.Text,
                    CompanyID: objectState.companyName.ID,
                    CompanyText: objectState.companyName.Text,
                    StartMonth: objectState.durationFrom.split('/')[0],
                    StartYear: objectState.durationFrom.split('/')[1],
                    EndMonth: objectState.durationTo.split('/')[0],
                    EndYear: objectState.durationTo.split('/')[1],
                    ReferenceEmail: objectState.referenceEmail,
                    ReferenceMobile: objectState.referenceNumber,
                    CountryText: objectState.country.Text,
                    CityID: objectState.city.ID,
                    CityText: objectState.city.Text,
                    Description: objectState.discription
                };
                makeAjaxRequest(url, userinfo.access_token, arrayObject, 'WorkHistory');
                break;
            case 'UserEducation':
                url = `${apiUrl}/candidate/candidatedegree`;
                arrayObject = {
                    UserAccountID: userinfo.userId,
                    CandidateDegreeID: objectState.Id,
                    DegreeTitle: objectState.degreeTitle,
                    DegreeLevelID: objectState.degreeLevel.ID,
                    DegreeMajorID: objectState.major.ID,
                    InstituteID: objectState.institution.ID,
                    InstituteText: objectState.institution.Text,
                    DegreeMonth: objectState.graduationDate.split('/')[0],
                    DegreeYear: objectState.graduationDate.split('/')[1],
                    CityID: objectState.city.ID,
                    CityText: objectState.city.Text,
                    isCGPA: objectState.gradingSystem,
                    Value: objectState.gradeValue
                };
                makeAjaxRequest(url, userinfo.access_token, arrayObject, 'UserEducation');
                break;
            case 'ReferencesList':
                url = `${apiUrl}/candidate/references`;
                arrayObject = {
                    UserAccountID: userinfo.userId,
                    CandidateReferenceID: objectState.Id,
                    Name: objectState.name,
                    Company: objectState.company,
                    Email: objectState.email,
                    PhoneNumber: objectState.contactNo
                };
                makeAjaxRequest(url, userinfo.access_token, arrayObject, 'ReferencesList');
                break;
            case 'AwardsList':
                url = `${apiUrl}/candidate/certificate`;
                arrayObject = {
                    UserAccountID: userinfo.userId,
                    CandidateCertificateID: objectState.Id,
                    Title: objectState.awardTitle,
                    Authority: objectState.authority,
                    StartMonth: objectState.awardDate.split('/')[0],
                    StartYear: objectState.awardDate.split('/')[1],
                    URL: objectState.awardURL
                };
                makeAjaxRequest(url, userinfo.access_token, arrayObject, 'AwardsList');
                break;
            case 'ProjectsList':
                url = `${apiUrl}/candidate/candidateproject`;
                arrayObject = {
                    UserAccountID: userinfo.userId,
                    ProjectID: objectState.Id,
                    Project: objectState.projectTitle,
                    CompanyID: objectState.companyName.ID,
                    CompanyText: objectState.companyName.Text,
                    //StartMonth: objectState.projectDate.split('/')[0],
                    //StartYear: objectState.projectDate.split('/')[1],                   
                    ProjectURL: objectState.projectURL,
                    Customer: objectState.customer,
                    CustomerURL: objectState.customerURL,
                    Tools: objectState.tools,
                    Description: objectState.description
                };
                makeAjaxRequest(url, userinfo.access_token, arrayObject, 'ProjectsList');
                break;
            default:
                url = `${apiUrl}/candidate/Certification`;
                arrayObject = {
                    UserAccountID: userinfo.userId,
                    CandidateCertificationID: objectState.Id,
                    Title: objectState.certificationName,
                    Code: objectState.licenseNumber,
                    CertifiedBy: objectState.certificationAuthority,
                    URL: objectState.certificationURL,
                    DateCompletion: objectState.completionDate,
                    DateExpiry: objectState.expiryDate
                };
                makeAjaxRequest(url, userinfo.access_token, arrayObject, 'CertificationsList');
                break;
        }
    }

    const makeAjaxRequest = async (url, access_token, dataObject, callFrom) => {
        setProfileData((prevState) => ({
            ...prevState, isLoading: true
        }));

        try {
            const response = await axios.post(url,
                dataObject,
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + access_token
                    }
                }
            );
            if (response.status === 200) {
                const resData = JSON.parse(response.data);
                setProfileData((prevState) => ({
                    ...prevState, isLoading: false
                }));
                const objResponse = [];
                let index = null;
                switch (callFrom) {
                    case 'UserSkills':
                        resData.candidateSkill.map((obj) => {
                            objResponse.push({
                                candidateSkillID: obj.candidateSkillID,
                                Id: obj.skillID,
                                skillName: obj.skillText,
                                skillLevel: obj.strength,
                                isPrimary: obj.isPrimary
                            });
                        });
                        setProfileData((prevState) => ({
                            ...prevState,
                            ProfileOverview: {
                                BasicProfile: {
                                    ...prevState.ProfileOverview.BasicProfile,
                                    ProfilePercentage: resData.profileStrength
                                },
                                BasicWorkExperience: {
                                    ...prevState.ProfileOverview.BasicWorkExperience
                                }
                            },
                            UserSkills: objResponse,
                        }));
                        break;
                    case 'WorkHistory':
                        index = profileData.WorkHistory.findIndex((obj) => {
                            return obj.Id === 0;
                        });
                        if (index !== -1) {
                            const dataobject = Object.assign([], profileData.WorkHistory);
                            dataobject[index].Id = resData.CandidateJobHistoryID;
                            setProfileData((prevState) => ({
                                ...prevState,
                                ProfileOverview: {
                                    BasicProfile: {
                                        ...prevState.ProfileOverview.BasicProfile,
                                        ProfilePercentage: resData.ProfileStrength
                                    },
                                    BasicWorkExperience: {
                                        ...prevState.ProfileOverview.BasicWorkExperience
                                    }
                                },
                                WorkHistory: dataobject
                            }));
                        }
                        break;
                    case 'UserEducation':
                        index = profileData.UserEducation.findIndex((obj) => {
                            return obj.Id === 0;
                        });
                        if (index !== -1) {
                            // const dataobject = Object.assign([], profileData.UserEducation);
                            const dataobject = [...profileData.UserEducation];
                            dataobject[index].Id = resData.CandidateDegreeID;
                            setProfileData((prevState) => ({
                                ...prevState,
                                ProfileOverview: {
                                    BasicProfile: {
                                        ...prevState.ProfileOverview.BasicProfile,
                                        ProfilePercentage: resData.ProfileStrength
                                    },
                                    BasicWorkExperience: {
                                        ...prevState.ProfileOverview.BasicWorkExperience
                                    }
                                },
                                UserEducation: dataobject
                            }));
                        }
                        break;
                    case 'FunctionalArea':
                        resData.CandidateFunctionalAreas.map((obj) => {
                            objResponse.push({
                                Id: obj.FunctionalAreaID,
                                candidateFunctionalAreasID: obj.CandidateFunctionalAreaID,
                                funcAreaName: obj.FunctionalAreaText
                            });
                        });
                        setProfileData((prevState) => ({
                            ...prevState,
                            ProfileOverview: {
                                BasicProfile: {
                                    ...prevState.ProfileOverview.BasicProfile,
                                    ProfilePercentage: resData.ProfileStrength
                                },
                                BasicWorkExperience: {
                                    ...prevState.ProfileOverview.BasicWorkExperience
                                }
                            },
                            FunctionalArea: objResponse
                        }));
                        break;
                    case 'IndustryList':
                        resData.CandidateIndustries.map((obj) => {
                            objResponse.push({
                                Id: obj.IndustryID,
                                candidateIndustryID: obj.CandidateIndustryID,
                                industoryName: obj.IndustryText
                            });
                        });
                        setProfileData((prevState) => ({
                            ...prevState,
                            ProfileOverview: {
                                BasicProfile: {
                                    ...prevState.ProfileOverview.BasicProfile,
                                    ProfilePercentage: resData.ProfileStrength
                                },
                                BasicWorkExperience: {
                                    ...prevState.ProfileOverview.BasicWorkExperience
                                }
                            },
                            IndustryList: objResponse
                        }));
                        break;
                    case 'ProjectsList':
                        index = profileData.ProjectsList.findIndex((obj) => {
                            return obj.Id === 0;
                        });
                        if (index !== -1) {
                            // const dataobject = Object.assign([], profileData.ProjectsList);
                            const dataobject = [...profileData.ProjectsList];
                            dataobject[index].Id = resData.projectID;
                            setProfileData((prevState) => ({
                                ...prevState,
                                ProfileOverview: {
                                    BasicProfile: {
                                        ...prevState.ProfileOverview.BasicProfile,
                                        ProfilePercentage: resData.ProfileStrength
                                    },
                                    BasicWorkExperience: {
                                        ...prevState.ProfileOverview.BasicWorkExperience
                                    }
                                },
                                ProjectsList: dataobject
                            }));
                        }
                        break;
                    case 'ReferencesList':
                        index = profileData.ReferencesList.findIndex((obj) => {
                            return obj.Id === 0;
                        });
                        if (index !== -1) {
                            // const dataobject = Object.assign([], profileData.ReferencesList);
                            const dataobject = [...profileData.ReferencesList];
                            dataobject[index].Id = resData;
                            setProfileData((prevState) => ({
                                ...prevState, ReferencesList: dataobject
                            }));
                        }
                        break;
                    case 'AwardsList':
                        index = profileData.AwardsList.findIndex((obj) => {
                            return obj.Id === 0;
                        });
                        if (index !== -1) {
                            // const dataobject = Object.assign([], profileData.AwardsList);
                            const dataobject = [...profileData.AwardsList];
                            dataobject[index].Id = resData;
                            setProfileData((prevState) => ({
                                ...prevState, AwardsList: dataobject
                            }));
                        }
                        break;
                    case 'CertificationsList':
                        index = profileData.CertificationsList.findIndex((obj) => {
                            return obj.Id === 0;
                        });
                        if (index !== -1) {
                            // const dataobject = Object.assign([], profileData.CertificationsList);
                            const dataobject = [...profileData.CertificationsList];
                            dataobject[index].Id = resData;
                            setProfileData((prevState) => ({
                                ...prevState, CertificationsList: dataobject
                            }));
                        }
                        break;
                    case 'HobbiesList':
                        //console.log(resData);
                        break;
                    case 'ProfileSummary':
                        setProfileData((prevState) => ({
                            ...prevState,
                            ProfileOverview: {
                                BasicProfile: {
                                    ...prevState.ProfileOverview.BasicProfile,
                                    ProfilePercentage: resData.ProfileStrength
                                },
                                BasicWorkExperience: {
                                    ...prevState.ProfileOverview.BasicWorkExperience
                                }
                            },
                            ProfileSummary: resData.Summary
                        }));
                        break;
                    default:
                        resData.map((obj) => {
                            objResponse.push({
                                Id: obj.LanguageID,
                                candidateIndustryID: obj.CandidateIndustryID,
                                languageName: obj.LanguageText,
                                languageLevel: obj.Strength
                            });
                        });
                        setProfileData((prevState) => ({
                            ...prevState, LanguagesList: objResponse
                        }));
                        break;
                }
            }
        } catch (error) {
            setProfileData(prevState => ({
                ...prevState,
                isLoading: false,
            }));
            Alert.alert("Error in My Profile request", error)
        }
    }

    const editProfileOverviewButtonHandler = () => {
        setProfileData((prevState) => ({
            ...prevState,
            isLoading: true, editProfileClicked: true
        }));
        appCtx.setPropsObject({
            PropsObject: profileData.ProfileOverview || {},
        });
        navigation.navigate('BasicProfile', {
            screenTitle: 'Edit My Profile'
        });
        if (appCtx && appCtx.saveUpdateMultiVal) {
            const dataObj = appCtx.saveUpdateMultiVal.dataObj;
            const objState = appCtx.saveUpdateMultiVal.objState;
            addMultipleObjectInState(dataObj, objState);
        }
        setProfileData((prevState) => ({
            ...prevState,
            isLoading: false, editProfileClicked: false
        }));
    };

    const SignupEventHandler = () => {
        //this.setState({isdisable: true});   
        appCtx.setCallFrom('myprofile');
        // appCtx.setPropsObject(updateObject);
        navigation.navigate('Signup');
    };

    const SigninEventHandler = () => {
        //this.setState({isdisable: true});
        const data = updateObject;
        appCtx.setCallFrom('myprofile');
        console.log("data-------", data)
        // appCtx.setPropsObject(data);
        navigation.navigate('Signin');
    };

    const updateObject = (objVal) => {
        setProfileData((prevState) => ({
            ...prevState,
            islogin: objVal
        }));

        makeRemoteRequest(appCtx.userInfo);
    }

    const selectPhotoTapped = () => {
        setShowImagePicker(true);
    }

    const selectPhotoTypeEventHandler = (photoFrom) => {
        getPermissionForPhoto(photoFrom);
    }
    const getPermissionForPhoto = (photo) => {
        if (Platform.OS === 'android') {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA).then(response => {
                if (response) {
                    selectPhoteFromMobile(photo);
                } else {
                    requestCameraPermission();
                }
            });
        } else {
            selectPhoteFromMobile(photo);
        }
    }

    const selectPhoteFromMobile = (from) => {
        var options = {
            width: 200,
            height: 200,
            cropping: true,
            freeStyleCropEnabled: false,
            // compressImageMaxWidth: 640,
            // compressImageMaxHeight: 480,
            compressImageQuality: 0.5,
            //cropperToolbarTitle: 'My Profile Photo',      
            includeBase64: true,
            includeExif: true,
        }
        if (from === 'camera') {
            ImagePicker.openCamera(options).then(image => selectedPhotoCallBack(image)).catch(e => {
                console.log(e.message);
            });
        } else {
            ImagePicker.openPicker(options).then(image => selectedPhotoCallBack(image)).catch(e => {
                console.log(e.message);
            });
        }
    }
    const selectedPhotoCallBack = (image) => {
        const imageString = image.data;
        setProfileData((prevState) => ({
            ...prevState,
            ProfileOverview: {
                BasicProfile: {
                    ...prevState.ProfileOverview.BasicProfile,
                    ProfileImage: image.path
                },
                BasicWorkExperience: {
                    ...prevState.ProfileOverview.BasicWorkExperience
                }
            }
        }));
        const dataObject = {
            userAccountID: appCtx.userInfo.userId,
            email: appCtx.userInfo.userName,
            image: imageString
        };
        const url = 'changeprofileimage';
        makeRequestForProfileImage(appCtx.userInfo, dataObject, url);
    }

    const makeRequestForProfileImage = (uinfo, dataobject, url) => {
        makeAjaxRequestAuth(`${apiUrl}/candidate/${url}`, uinfo.access_token, dataobject, appCtx).then((resp) => {
            const imageResp = JSON.parse(resp);
            console.log("resp in profile image changing ------------------", imageResp)
            setProfileData((prevState) => ({
                ...prevState,
                ProfileOverview: {
                    BasicProfile: {
                        ...prevState.ProfileOverview.BasicProfile,
                        ProfileImage: getProfileUrl(imageResp)
                    },
                    BasicWorkExperience: {
                        ...prevState.ProfileOverview.BasicWorkExperience
                    }
                }
            }));
        });
    }

    async function requestCameraPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA);
            // if(granted === PermissionsAndroid.RESULTS.GRANTED){
            //     this.downloadResumeWithPermissions();
            // }
        } catch (err) {
            console.log(err.message);
        }
    }
    const downloadResumeEventHandler = () => {
        //this.setState({isdisable: true});
        // this.disable = true;
        // let objResume = { Id: -2 };
        // this.addAndEditButtonHandler(
        //     'Jobee.ResumeDownloadFormScreen',
        //     'Resume Formats',
        //     objResume,
        //     this.updateObjectState,
        //     null,
        //     null
        // );
    }
    const shareProfileEventHandler = () => {
        //this.setState({isdisable: true});
        // let objshareProfile = { Id: -2, userName: this.state.publicProfileName };
        // this.addAndEditButtonHandler(
        //     'Jobee.ShareProfileFormScreen',
        //     'Share Public Profile Links',
        //     objshareProfile,
        //     this.updateObjectState,
        //     null,
        //     this.updateObjectInState
        // );
    }

    const closeModal = () => {
        setShowImagePicker(false);
    }
    const getProfileUrl = (url) => {
        if (!url) return '';
        const newUrl = `${url}?time=${new Date().getTime()}`;
        return newUrl;
    }

    const addSummaryButtonHandler = () => {
        setIsVisiblePopUp(true);
        setFormVal('Add Summary')
    };

    const editSummaryButtonHandler = () => {
        setIsVisiblePopUp(true);
        setFormVal('Edit Summary');
    };

    const showModal = () => {
        console.log("enter into Modal--------------------", isVisiblePopUp)
        return (
            <Modal
                visible={isVisiblePopUp}
                transparent={true}
                onRequestClose={closePopUpModal}
                animationType="fade"
            >
                {(formVal === 'Add Summary' || formVal === 'Edit Summary') &&
                    <SummaryForm pageTitle={formVal} passProps={profileData.ProfileSummary}
                        saveUpdateMultipleObject={addMultipleObjectInState} closeModal={closePopUpModal} />
                }
                {/* {formVal === 'Edit Summary' &&
                    <SummaryForm pageTitle={formVal} passProps={profileData.ProfileSummary}
                        saveUpdateMultipleObject={addMultipleObjectInState} closeModal={closePopUpModal} />
                } */}
                {(formVal === 'Add Skill' || formVal === 'Edit Skill') &&
                    <SkillsForm pageTitle={formVal} passProps={formVal.split(' ')[0] === 'Add' ? { Id: -1 } :
                        profileData.UserSkills} saveUpdateMultipleObject={addMultipleObjectInState}
                        closeModal={closePopUpModal} />
                }
                {/* {formVal === 'Edit Skill' &&
                    <SkillsForm pageTitle={formVal} passProps={profileData.UserSkills}
                        saveUpdateMultipleObject={addMultipleObjectInState} closeModal={closePopUpModal} />
                } */}
                {formVal === 'Add Education' &&
                    <EducationForm pageTitle={formVal} passProps={{ Id: -1 }}
                        saveUpdateSingleObject={addEditSingleObjectInState} closeModal={closePopUpModal} action={'Add'}/>
                }
            </Modal >
        )

    }

    function closePopUpModal() {
        setFormVal(null);
        setIsVisiblePopUp(false);
    }

    const addSkillButtonHandler = () => {
        setIsVisiblePopUp(true);
        setFormVal('Add Skill');
    };
    const editSkillButtonHandler = () => {
        setIsVisiblePopUp(true);
        setFormVal('Edit Skill');
    }

    const addUserEducationButtonHandler = () => {
        setIsVisiblePopUp(true);
        setFormVal('Add Education');
    };

    const addWorkHistoryButtonHandler = () => {
        setIsVisiblePopUp(true);
        setFormVal('Add Work History');
        // let workHistory = { Id: -1 };
        // this.addAndEditButtonHandler(
        //   'Jobee.WorkHistoryFormScreen',
        //   'Add Work History',
        //   workHistory,
        //   null,
        //   null,
        //   this.addEditSingleObjectInState
        // );
      };

    const moreButtonHandler = (callfrom, dataObject) => {
        setProfileData((prevState) => ({
            ...prevState,
            visibleModal: 5,
            callFrom: callfrom,
            calledDataObject: dataObject
        }));
    };

    const closeInnerModal = () => {
        setProfileData(prevState => ({
            ...prevState,
            visibleModal: null
        }))
    }

    const deleteRocordOnConfirmation = () => {
        let delUrl = '';
        let userInfo = appCtx.userInfo;
        switch (profileData.callFrom) {
            case 'WorkHistory':
                delUrl = `${apiUrl}/candidate/deletecandidateexperience`;
                deleteObjectFromState(delUrl, 'WorkHistory', profileData.calledDataObject, userInfo);
                break;
            case 'Education':
                delUrl = `${apiUrl}/candidate/deletecandidatedegree`;
                deleteObjectFromState(delUrl, 'UserEducation', profileData.calledDataObject, userInfo);
                break;
            case 'References':
                delUrl = `${apiUrl}/candidate/deletereferencebyid`;
                deleteObjectFromState(delUrl, 'ReferencesList', profileData.calledDataObject, userInfo);
                break;
            case 'Awards':
                delUrl = `${apiUrl}/candidate/deletecertificatebyid`;
                deleteObjectFromState(delUrl, 'AwardsList', profileData.calledDataObject, userInfo);
                break;
            case 'Projects':
                delUrl = `${apiUrl}/candidate/deletecandidateproject`;
                deleteObjectFromState(delUrl, 'ProjectsList', profileData.calledDataObject, userInfo);
                break;
            default:
                delUrl = `${apiUrl}/candidate/deletecertificationbyid`;
                deleteObjectFromState(delUrl, 'CertificationsList', profileData.calledDataObject, userInfo);
                break;
        }
    }

    const deleteObjectFromState = (delUrl, dataObject, deleteObject, userInfo) => {
        const ObjData = {
            UserAccountID: userInfo.userId,
            Id: deleteObject.Id
        }
        makeDeleteAjaxRequest(delUrl, userInfo.access_token, ObjData);
        let _index = profileData[dataObject].findIndex((obj) => {
            return obj.Id === deleteObject.Id
        })
        // let _dataobject = Object.assign([], this.state[dataObject]);
        let _dataobject = [...profileData[dataObject]];
        _dataobject.splice(_index, 1);
        setProfileData((prevState) => ({
            ...prevState,
            [dataObject]: _dataobject,
            deleteModal: false
        }));
    }

    const makeDeleteAjaxRequest = (url, uinfo, dataObject) => {
        makeAjaxRequestAuth(url, uinfo, dataObject, appCtx).then((resp) => {
            let resData = JSON.parse(resp);
            if (resData.ProfileStrength !== undefined) {
                setProfileData((prevState) => ({
                    ...prevState,
                    ProfileOverview: {
                        BasicProfile: {
                            ...prevState.ProfileOverview.BasicProfile,
                            ProfilePercentage: resData.ProfileStrength
                        },
                        BasicWorkExperience: {
                            ...prevState.ProfileOverview.BasicWorkExperience
                        }
                    }
                }));
            }
        });
    }

    const closeDelModal = () => {
        setProfileData((prevState) => ({
            ...prevState,
            deleteModal: false,
        }))
    }

    return (
        <>
            {profileData.netStatus ?
                (profileData.isLoading ?
                    (<View style={{ paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#CDE0CE', backgroundColor: '#fff', height: '100%', justifyContent: 'center' }}>
                        <ActivityIndicator animating size="large" />
                    </View>)
                    :
                    (<ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={profileData.refreshing}
                                onRefresh={onRefreshControl}
                            />
                        }
                        style={(profileData.islogin && profileData.candidateId !== 0) ? styles.container : styles.containerStyle}
                    >
                        {
                            !profileData.islogin ?
                                <View style={{ marginTop: 75 }}>
                                    <DefaultScreen
                                        imagePath={defaultProfileImage}
                                        menuText="Create your CV to get Jobee Matched or find your dream job in less than 10 minutes."
                                        profileInstraction="Create your profile now to increase your chance of finding the best job for free on jobee.pk"
                                        buttonEvent={SignupEventHandler}
                                        signinButtonEvent={SigninEventHandler}
                                    />
                                </View>
                                :
                                profileData.candidateId === 0 ?
                                    <View style={{ marginTop: '50%', marginLeft: 10 }}>
                                        <View style={{ position: 'relative' }}>
                                            <Header headerText="Please Add Basic Profile Info" innerText="Please add your basic profile info for further proceeding on jobee.pk." isDisplay={true} />
                                            <Button buttonText="Add Basic Profile" buttonEvent={editProfileOverviewButtonHandler} />
                                        </View>
                                    </View>
                                    :
                                    <View style={{ marginTop: (Platform.OS == 'ios') ? 20 : 0 }}>
                                        {
                                            Platform.OS === 'ios' && <StatusBar
                                                barStyle="dark-content"
                                                hidden={false}
                                                backgroundColor='#00bac9'
                                                translucent={true}
                                            />
                                        }
                                        {!profileData.isEmailConfirmed &&
                                            <View style={{ flexDirection: 'row', backgroundColor: '#d93025', justifyContent: 'center', paddingVertical: 5 }}>
                                                <Icon name="information-circle-outline" size={25} color='#fff' style={{ paddingVertical: 2 }} />
                                                <Text style={{ color: '#fff', paddingLeft: 7, paddingVertical: 5, fontFamily: fonts.regular }}>Please confirm your email address.</Text>
                                            </View>
                                        }
                                        <View style={{ backgroundColor: '#fff', flex: 1, marginBottom: -50, flexDirection: 'column', justifyContent: 'flex-start' }}>
                                            <View style={{ backgroundColor: '#00bac9', height: Platform.OS === 'ios' ? '55%' : '55%', width: '100%' }}>
                                                <View style={{ paddingTop: Platform.OS === 'ios' ? '5%' : '3%', paddingLeft: '30%' }}>
                                                    <ProfileOverView
                                                        ProfileOverview={profileData.ProfileOverview}
                                                        isDisable={profileData.isdisable}
                                                        EditButtonEvent={editProfileOverviewButtonHandler}
                                                    />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: '20%' }}>
                                                <View style={{ position: 'relative', top: -85, marginLeft: 7 }}>
                                                    <View style={styles.profileImageContainer}>
                                                        <TouchableWithoutFeedback onPress={selectPhotoTapped}>
                                                            <Image style={styles.profileImage} key={(new Date()).getTime()}
                                                                source={{ uri: profileData.ProfileOverview.BasicProfile.ProfileImage }}
                                                            />
                                                        </TouchableWithoutFeedback>
                                                    </View>
                                                    <View style={{ backgroundColor: 'transparent' }}>
                                                        <Modal
                                                            visible={showImagePicker}
                                                            transparent={true}
                                                            onRequestClose={closeModal}
                                                            animationType="fade"
                                                        >
                                                            <ProfilePicture SelectPhotoTypeEvent={selectPhotoTypeEventHandler}
                                                                closeModal={closeModal}
                                                            />
                                                        </Modal>
                                                    </View>
                                                </View>
                                                <View style={{ backgroundColor: '#fff', paddingLeft: 5, paddingTop: 5, borderTopLeftRadius: 30, height: 60, width: 60, position: 'relative', top: -55, }}>
                                                    <AnimatedCircularProgress
                                                        size={50}
                                                        width={10}
                                                        fill={profileData?.ProfileOverview?.BasicProfile?.ProfilePercentage}
                                                        tintColor="#00bac9"
                                                        // onAnimationComplete={() => console.log('onAnimationComplete')}
                                                        backgroundColor="#756b6b" >
                                                        {
                                                            (fill) => (
                                                                <Text style={styles.circleText}>
                                                                    {fill}%
                                                                </Text>
                                                            )
                                                        }
                                                    </AnimatedCircularProgress>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={{ marginTop: -20 }}>
                                            <ProfileControls
                                                // onRef={ref => (this.childComponent = ref)}
                                                updateUsingPdf=''
                                                isDisable={profileData.isdisable}
                                                downloadResume={downloadResumeEventHandler}
                                                shareProfile={shareProfileEventHandler}
                                            />
                                        </View>

                                        <ProfileSummary isEmptyState={profileData.ProfileSummary === '' ? true : false} ProfileSummary={profileData.ProfileSummary} isDisable={profileData.isdisable} ButtonEvent={addSummaryButtonHandler} EditButtonEvent={editSummaryButtonHandler} />
                                        <Skills isEmptyState={profileData.UserSkills.length === 0 ? true : false} ButtonEvent={addSkillButtonHandler} UserSkills={profileData.UserSkills} EditButtonEvent={editSkillButtonHandler} moreButtonEvent={moreButtonHandler} />
                                        <UserEducation isEmptyState={profileData.UserEducation.length === 0 ? true : false} UserEducation={profileData.UserEducation} ButtonEvent={addUserEducationButtonHandler} moreButtonEvent={moreButtonHandler} />
                                        <WorkExperience isEmptyState={profileData.WorkHistory.length === 0 ? true : false} WorkHistory={profileData.WorkHistory} ButtonEvent={addWorkHistoryButtonHandler} moreButtonEvent={moreButtonHandler} />
                                    {/* <Projects isEmptyState={this.state.ProjectsList.length === 0 ? true : false} ProjectsList={this.state.ProjectsList} ButtonEvent={this.addProjectsButtonHandler} moreButtonEvent={this.moreButtonHandler} />
                                    <FuncationalArea isEmptyState={this.state.FunctionalArea.length === 0 ? true : false} ButtonEvent={this.addFuncAreaButtonHandler} FunctionalArea={this.state.FunctionalArea} EditButtonEvent={this.editFuncAreaButtonHandler} />
                                    <Industry isEmptyState={this.state.IndustryList.length === 0 ? true : false} ButtonEvent={this.addIndustoryButtonHandler} IndustryList={this.state.IndustryList} EditButtonEvent={this.editIndustoryButtonHandler} />
                                    <Languages isEmptyState={this.state.LanguagesList.length === 0 ? true : false} ButtonEvent={this.addLanguagesButtonHandler} LanguagesList={this.state.LanguagesList} EditButtonEvent={this.editLanguagesButtonHandler} />
                                    <Hobbies isEmptyState={this.state.HobbiesList.length === 0 ? true : false} ButtonEvent={this.addHobbiesButtonHandler} HobbiesList={this.state.HobbiesList} EditButtonEvent={this.editHobbiesButtonHandler} />
                                    <Awards isEmptyState={this.state.AwardsList.length === 0 ? true : false} AwardsList={this.state.AwardsList} ButtonEvent={this.addAwardsButtonHandler} moreButtonEvent={this.moreButtonHandler} />
                                    <Certifications isEmptyState={this.state.CertificationsList.length === 0 ? true : false} CertificationsList={this.state.CertificationsList} ButtonEvent={this.addCertificationsButtonHandler} moreButtonEvent={this.moreButtonHandler} />
                                    <References isEmptyState={this.state.ReferencesList.length === 0 ? true : false} ReferencesList={this.state.ReferencesList} ButtonEvent={this.addReferencesButtonHandler} moreButtonEvent={this.moreButtonHandler} /> */}

                                    </View>

                        }

                    </ScrollView>))
                :
                (<NetworkErrorScreen
                    Retry={reloadThePage}
                />)
            }
            {(formVal !== null) &&
                (
                    showModal()
                )
            }

            {/*-------------- for Edit Modal------------------------ */}
            <Modal
                visible={profileData.visibleModal === 5}
                transparent={true}
                onRequestClose={() => closeInnerModal()}
                animationType="fade">
                <EditProfile stateData={profileData} addEditSingleObjectInState={addEditSingleObjectInState}
                    closeModal={closeInnerModal} deletion={() =>
                        setTimeout(() => {
                            setProfileData((prevState) => ({
                                ...prevState,
                                deleteModal: true,
                                visibleModal: null
                            }));
                        }, 250)} />
            </Modal>

            {/*----------------------- Delete Modal----------------------------- */}
            <Modal visible={profileData.deleteModal}
                onRequestClose={() => closeDelModal()}
                animationType="fade" transparent={true}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, width: '90%', height: '20%', paddingVertical: 10 }}>
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => closeDelModal()}>
                                <Icon name='close-circle' size={40} color='red' style={{ textAlign: 'center' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop: 10}}>
                            <Text style={{ fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular', fontSize: 18, textAlign: 'center', paddingHorizontal: 5 }}>Are you sure you want to delete this record?</Text>
                        </View>
                        <View style={styles.delHeaderContainer}>
                            <View style={styles.deleteButtonContainer}>
                                <TouchableOpacity onPress={() => deleteRocordOnConfirmation()} style={styles.buttonStyle}>
                                    <Text style={[styles.buttonTextStyle, { color: 'red' }]}>Delete </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => closeDelModal()} style={styles.buttonStyle}>
                                    <Text style={styles.buttonTextStyle}>Cancel </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

export default MyProfileScreen;

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 5,
    },
    container: {
        flex: 1,
        backgroundColor: '#eeeeee'
    },
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
    imageWithPercentage: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingHorizontal: 20
    },
    circleText: {
        textAlign: 'center',
        fontSize: 10,
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    profileImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 100,
        borderColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1
    },
    profileImage: {
        flex: 1,
        width: null,
        alignSelf: 'stretch',
        borderRadius: 50,
        borderColor: '#fff'
    },
    imageBackContainer: {
        flex: 1,
        width: undefined,
        height: undefined,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: 'silver',
    },
    delHeaderContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
});