import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function HomeScreen({route, navigation}) {
  const userEmail = route.params.userEmail;
  const [userData, setUserData] = useState(null);

  const fetchData = () => {
    firestore()
      .collection('users')
      .doc(userEmail)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    fetchData();
    console.log(userData);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.userContent}>
        {userData && (
          <>
            <Image
              source={{uri: userData.profilePic}}
              style={styles.profileImage}
            />
            <View style={{marginRight: 20}}>
              <Text style={styles.nameText}>{userData.name}</Text>
              <Text style={styles.emailText}>{userData.Email}</Text>
            </View>
          </>
        )}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#0275d8',
            height: 50,
            width: 50,
            borderRadius: 20,
            margin: 10,
            padding: 10,
          }}
          onPress={() => navigation.navigate('CP')}>
          <AntDesign
            name="adduser"
            style={{
              color: '#fff',
              fontSize: 30,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 16,
    color: 'gray',
  },
  signOutButton: {
    width: 80,
    height: 40,
    backgroundColor: '#0275d8',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
