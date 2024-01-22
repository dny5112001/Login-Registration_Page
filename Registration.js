import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Dropdown} from 'react-native-element-dropdown';

import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export default function Registration(props) {
  const [FullName, SetFullName] = useState('');
  const [Designation, setDesignation] = useState(null);
  const [gender, setGender] = useState(null);
  const [Email, SetEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Phone, setPhone] = useState('');
  const [functioncall, Setfunctioncall] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const CreateUser = async () => {
    Setfunctioncall(true);
    uploadfile();
    if (
      FullName != '' &&
      Email != '' &&
      Password != '' &&
      Phone != '' &&
      profile != null &&
      gender != null &&
      Designation != null
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
        gender: gender,
        designation: Designation,
        password: Password,
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

  const designationData = [
    {label: 'Commissioner of Police  {C.P.}', value: 'C.P.'},
    {label: 'Special Commissioner of Police   {Spl.C.P.}', value: 'Spl.C.P.'},
    {label: 'Joint Commissioner of Police   {Jt. C.P.}', value: 'Jt. C.P.'},
    {
      label: 'Additional Commissioner of Police   {Addl. C.P.}',
      value: 'Addl. C.P.',
    },
    {label: 'Deputy Commissioner of Police   {D.C.P.}', value: 'D.C.P.'},
    {label: 'Assistant Commissioner of Police   {A.C.P.}', value: 'A.C.P.'},
    {
      label: 'Sr Police Inspector / Police Inspector   {Sr. P.I. / P.I.}',
      value: 'Sr. P.I. / P.I.',
    },
    {label: 'Assistant Police Inspector   {A.P.I.}', value: 'A.P.I.'},
    {label: 'Police Sub Inspector   {P.S.I.}', value: 'P.S.I.'},
    {label: 'Assistant Police Sub Inspector', value: 'A.S.I.'},
    {label: 'Head Constable   {A.S.I.}', value: 'H.C.'},
    {label: 'Police Naik   {P.N.}', value: 'P.N.'},
    {label: 'Police Constable   {P.C.}', value: 'P.C.'},
  ];
  const genderData = [
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'female'},
    {label: 'Not say', value: 'Not say'},
  ];

  const renderGenderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };
  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === Designation && (
          <Icon
            name="police-badge-outline"
            style={{
              fontSize: 25,
            }}
          />
        )}
      </View>
    );
  };
  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <StatusBar
        backgroundColor="#fff"
        barStyle={'dark-content'}
        animated={true}
      />
      <View style={{marginTop: 30}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              width: 80,
              height: 80,
              borderWidth: 0.5,
              borderRadius: 40,
              backgroundColor: '#FFF',
              marginHorizontal: 20,
              borderColor: '#0275d8',
            }}
            onPress={() => {
              imageUploadViaFile();
            }}>
            {imageData === null ? (
              <Image
                style={{flex: 1, borderRadius: 40}}
                source={{
                  uri: 'https://www.seekpng.com/png/small/41-410093_circled-user-icon-user-profile-icon-png.png',
                }}
              />
            ) : (
              <Image
                style={{flex: 1, borderRadius: 40}}
                source={{uri: imageData}}
              />
            )}
          </TouchableOpacity>
        </View>

        {functioncall && profile === null ? (
          <View style={{width: '90%', marginTop: 10}}>
            <Text style={{textAlign: 'center', color: 'red'}}>
              Please enter your Profile pic
            </Text>
          </View>
        ) : null}

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
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
            borderWidth: 1,
            borderColor: '#0275d8',
            borderRadius: 10,
            marginBottom: 10,
          }}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={designationData}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Designation"
            searchPlaceholder="Search Designation"
            value={Designation}
            onChange={item => {
              setDesignation(item.value);
            }}
            renderItem={renderItem}
          />
        </View>
        {functioncall && Designation === null ? (
          <View style={{width: '90%', marginBottom: 10}}>
            <Text style={{textAlign: 'left', color: 'red'}}>
              Please select your Designation
            </Text>
          </View>
        ) : null}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
            borderWidth: 1,
            borderColor: '#0275d8',
            borderRadius: 10,
            marginBottom: 10,
          }}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={genderData}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Gender"
            searchPlaceholder="Search Gender"
            value={gender}
            onChange={item => {
              setGender(item.value);
            }}
            renderItem={renderGenderItem}
          />
        </View>
        {functioncall && gender === null ? (
          <View style={{width: '90%', marginBottom: 10}}>
            <Text style={{textAlign: 'left', color: 'red'}}>
              Please select your gender
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
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 30,
          marginBottom: 10,
        }}>
        <Text style={{fontSize: 16}}>Already have an account ?</Text>
        <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
          <Text style={{fontSize: 16, color: '#0275d8'}}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    // margin: 5,
    height: 60,
    // backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    // elevation: 2,
    flex: 1,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 15,
    flex: 1,
    marginRight: 10,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
