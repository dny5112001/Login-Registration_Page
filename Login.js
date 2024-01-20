import {
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

export default function Login(props) {
  const [Email, SetEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [functioncall, Setfunctioncall] = useState(false);
  const userSignin = async () => {
    Setfunctioncall(true);
    if (Email != '' && Password != '') {
      await auth()
        .signInWithEmailAndPassword(Email, Password)
        .then(() => {
          props.navigation.navigate('Home', {userEmail: Email});
          Setfunctioncall(false);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  return (
    <View>
      <View style={{marginTop: 70}}>
        <Text
          style={{
            fontSize: 40,
            fontWeight: 'bold',
            color: '#000',
            textAlign: 'center',
          }}>
          Sign In
        </Text>
        <Text style={{fontSize: 20, textAlign: 'center', marginTop: 8}}>
          Continue with your Account
        </Text>
      </View>
      <View
        style={{flexDirection: 'column', alignItems: 'center', marginTop: 70}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
            borderWidth: 1,
            borderColor: '#0275d8',
            borderRadius: 10,
            marginBottom: 20,
          }}>
          <TextInput
            placeholder="Enter Email"
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
              color: '#0275d8',
            }}
          />
        </View>
        {functioncall && Email === '' ? (
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
            marginBottom: 20,
          }}>
          <TextInput
            placeholder="Enter Password"
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
              color: '#0275d8',
            }}
          />
        </View>
        {functioncall && Password === '' ? (
          <View style={{width: '90%', marginBottom: 10}}>
            <Text style={{textAlign: 'left', color: 'red'}}>
              Please enter your name
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
            userSignin();
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
          marginTop: 200,
        }}>
        <Text style={{fontSize: 16}}>Don't have an account ?</Text>
        <TouchableOpacity onPress={() => props.navigation.navigate('Register')}>
          <Text style={{fontSize: 16, color: '#0275d8'}}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
