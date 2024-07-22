import { View, StyleSheet } from 'react-native';
import ProfileInfo from './ProfileInfo/ProfileInfo';

function ProfileOverView(props) {

    const editProfileOverviewHandler = () => {
        props.EditButtonEvent();
    }

    const { firstName, lastName, birthDate, city, country } = props.ProfileOverview.BasicProfile;
    const { isExperienced, currentDesignation, currentCompany, preferredJobDesignation, currentExperience } = props.ProfileOverview.BasicWorkExperience;
    return (
        <View >
            <ProfileInfo
                name={`${firstName} ${lastName}`}
                designation={isExperienced ? `${currentDesignation === undefined ? '' : currentDesignation.Text} at ${currentCompany === undefined ? '' : currentCompany.Text}` : `${preferredJobDesignation === undefined ? '' : preferredJobDesignation.Text}`}
                companyName={isExperienced ? `${currentCompany === undefined ? '' : currentCompany.Text}` : `${preferredJobDesignation === undefined ? '' : preferredJobDesignation.Text}`}
                experience={isExperienced ? `${currentExperience.Text} Experience` : 'Fresh'}
                age={birthDate} //moment().diff(DOB, 'years',false)
                address={`${city === undefined ? '' : city.Text}, ${country === undefined ? '' : country.Text}`}
                isDisabled={props.isDisable}
                buttonEvent={editProfileOverviewHandler}
            />
        </View>
    );
}

export default ProfileOverView;

const styles = StyleSheet.create({
    container: {    
     marginTop: '10%' 
    }  
  });