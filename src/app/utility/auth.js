import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Alert, Platform } from 'react-native';




export const apiUrl = 'http://192.168.0.3/jobee-api/api';

export const makeAjaxRequestAuth = async (url, accessTokken, bodyData, appCtx) => {

  const netInfoState = await NetInfo.fetch();
  if (!netInfoState.isConnected) {
    Alert.alert("No Internet Access", "No Internet connection. Make sure Wi-Fi or cellular data is turned on, then try again.");
    return null;
  }
  const response = await axios.post(url,
    JSON.stringify(bodyData),
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + accessTokken
      }
    }
  ).catch((error) => {
    console.log(error.message);
    Alert.alert('Error in Make Ajax request', error.message);
  });
  if (response.status === 200) {
    return await response.data;
  }
  const resJson = JSON.parse(response._bodyText).message;
  if (resJson === 'Authorization has been denied for this request.') {
    return appCtx.deleteInfo();
  }
  // const responseData = await response.json();    
  // return responseData;
};


export const getUserInfo = async () => {
  return new Promise((resolve, reject) => {
    let fetchedToken;
    AsyncStorage.getItem('ap:auth:user_info')
      .catch(err => reject(err))
      .then(tokenFromStorage => {
        fetchedToken = tokenFromStorage;
        if (!tokenFromStorage) {
          return reject();
        }
        resolve(fetchedToken);
      }).catch(err => reject(err));
  });
};

export const fonts = {
  regular: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
  bold: Platform.OS === 'ios' ? 'opensans-bold' : 'opensans_bold',
}


