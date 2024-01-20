import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {Platform} from 'react-native';

import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';

import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export default function Registration(props) {
  const [FullName, SetFullName] = useState('');
  const [Email, SetEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Phone, setPhone] = useState('');
  const [functioncall, Setfunctioncall] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [profile, setProfile] = useState(null);

  const CreateUser = async () => {
    Setfunctioncall(true);
    uploadfile();
    if (
      FullName != '' &&
      Email != '' &&
      Password != '' &&
      Phone != '' &&
      profile != null
    ) {
      auth()
        .createUserWithEmailAndPassword(Email, Password)
        .then(() => {
          console.warn('User account created & signed in!');
          addData(Phone);
          setProfile(null);
          setImageData(null);
          console.log(profile);

          props.navigation.navigate('Home', {userEmail: Email});
          Setfunctioncall(false);
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.warn('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            console.warn('That email address is invalid!');
          }

          console.error(error);
        });
    }
  };

  const addData = async () => {
    firestore()
      .collection('users')
      .doc(Email)
      .set({
        name: FullName,
        Email: Email,
        mobile: Phone,
        profilePic: profile,
      })
      .then(() => {
        console.log('Data added!');
      });
  };

  const openCamera = async () => {
    const result = await launchCamera({mediaType: 'photo'});
    console.log(result);
    setImageData(result.assets[0].uri);
  };

  const uploadfile = async () => {
    const reference = storage().ref(FullName + Phone);
    const pathToFile = imageData;
    await reference.putFile(pathToFile);

    const url = await storage()
      .ref(FullName + Phone)
      .getDownloadURL();
    setProfile(url);
    setImageData(null);
  };

  const imageUploadViaFile = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      console.log(response);
      setImageData(response.uri);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <ScrollView>
      <View style={{marginTop: 70}}>
        <Text
          style={{
            fontSize: 40,
            fontWeight: 'bold',
            color: '#000',
            textAlign: 'center',
          }}>
          Register
        </Text>
        <Text style={{fontSize: 20, textAlign: 'center', marginTop: 8}}>
          Create your New Account
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 30,
        }}>
        {imageData !== null ? (
          <Image
            source={{uri: imageData}}
            style={{width: 70, height: 70, borderRadius: 10}}
          />
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
            borderWidth: 1,
            borderColor: '#0275d8',
            borderRadius: 10,
            marginBottom: 10,
            marginTop: 30,
          }}>
          <TextInput
            placeholder="Full name"
            value={FullName}
            onChangeText={text => SetFullName(text)}
            style={{
              height: 50,
              width: '90%',
              paddingLeft: 20,
            }}
          />
          <AntDesign
            name="user"
            style={{
              fontSize: 25,
              paddingRight: 20,
            }}
          />
        </View>
        {functioncall && FullName === '' ? (
          <View style={{width: '90%', marginBottom: 10}}>
            <Text style={{textAlign: 'left', color: 'red'}}>
              Please enter your name
            </Text>
          </View>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
            borderWidth: 1,
            borderColor: '#0275d8',
            borderRadius: 10,
            marginBottom: 10,
          }}>
          <TextInput
            placeholder="Email"
            value={Email}
            onChangeText={text => SetEmail(text)}
            style={{
              width: '90%',
              height: 50,
              paddingLeft: 20,
            }}
          />
          <AntDesign
            name="mail"
            style={{
              fontSize: 25,
              paddingRight: 20,
            }}
          />
        </View>
        {functioncall && Email === '' ? (
          <View style={{width: '90%', marginBottom: 10}}>
            <Text style={{textAlign: 'left', color: 'red'}}>
              Please enter your Email
            </Text>
          </View>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
            borderWidth: 1,
            borderColor: '#0275d8',
            borderRadius: 10,
            marginBottom: 10,
          }}>
          <TextInput
            placeholder="Mobile No."
            value={Phone}
            keyboardType="number-pad"
            dataDetectorTypes={'phoneNumber'}
            onChangeText={text => setPhone(text)}
            style={{
              width: '90%',
              height: 50,
              paddingLeft: 20,
            }}
          />

          <AntDesign
            name="phone"
            style={{
              fontSize: 25,
              paddingRight: 20,
            }}
          />
        </View>
        {functioncall && Phone === '' ? (
          <View style={{width: '90%', marginBottom: 10}}>
            <Text style={{textAlign: 'left', color: 'red'}}>
              Please enter your Phone
            </Text>
          </View>
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
            borderWidth: 1,
            borderColor: '#0275d8',
            borderRadius: 10,
            marginBottom: 10,
          }}>
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            value={Password}
            onChangeText={text => setPassword(text)}
            style={{
              width: '90%',
              height: 50,
              paddingLeft: 20,
            }}
          />
          <AntDesign
            name="lock"
            style={{
              fontSize: 25,
              paddingRight: 20,
            }}
          />
        </View>
        {functioncall && Password === '' ? (
          <View style={{width: '90%', marginBottom: 10}}>
            <Text style={{textAlign: 'left', color: 'red'}}>
              Please enter your Password
            </Text>
          </View>
        ) : null}
      </View>
      <View style={{flexDirection: 'column', alignItems: 'center'}}>
        <TouchableOpacity
          style={{
            marginTop: 30,
            width: '90%',
            height: 50,
            borderRadius: 10,
            backgroundColor: '#0275d8',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 3,
          }}
          onPress={() => {
            CreateUser();
          }}>
          <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
            Next
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          flexBasis: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <TouchableOpacity
            style={{
              width: 100,
              height: 50,
              borderWidth: 0.5,
              borderRadius: 10,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: '#FFF',
              marginHorizontal: 20,
              borderColor: '#0275d8',
            }}
            onPress={() => {
              openCamera();
            }}>
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                textAlignVertical: 'center',
                color: '#0275d8',
                fontSize: 16,
              }}>
              Open camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 100,
              height: 50,
              borderWidth: 0.5,
              borderRadius: 10,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: '#FFF',
              marginHorizontal: 20,
              borderColor: '#0275d8',
            }}
            onPress={() => {
              imageUploadViaFile();
            }}>
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                textAlignVertical: 'center',
                color: '#0275d8',
                fontSize: 16,
              }}>
              Open File
            </Text>
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity
          style={{
            width: 200,
            height: 50,
            borderWidth: 0.5,
            borderRadius: 10,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: '#0275d8',
          }}
          onPress={() => {
            uploadfile();
          }}>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              textAlignVertical: 'center',
              color: '#fff',
              fontSize: 16,
            }}>
            upload pic
          </Text>
        </TouchableOpacity> */}
        {functioncall && profile === null ? (
          <View style={{width: '90%', marginTop: 10}}>
            <Text style={{textAlign: 'center', color: 'red'}}>
              Please enter your Profile pic
            </Text>
          </View>
        ) : null}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 100,
          marginBottom: 50,
        }}>
        <Text style={{fontSize: 16}}>Already have an account ?</Text>
        <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
          <Text style={{fontSize: 16, color: '#0275d8'}}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
