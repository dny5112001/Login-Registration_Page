// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TouchableOpacityComponent,
//   View,
// } from 'react-native';
// import React, {useEffect} from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import firestore from '@react-native-firebase/firestore';

// export default function HomeScreen({route}) {
//   const userEmail = route.params.userEmail;
//   console.log(userEmail);

//   const fetchData = () => {
//     firestore()
//       .collection('users')
//       .doc(userEmail)
//       .get()
//       .then(documentSnapshot => {
//         console.log('User exists: ', documentSnapshot.exists);

//         if (documentSnapshot.exists) {
//           console.log('User data: ', documentSnapshot.data());
//         }
//       });
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);
//   return (
//     <View style={{alignItems: 'center'}}>
//       <Text
//         style={{
//           marginTop: 70,
//           color: '#000',
//           fontSize: 40,
//           fontWeight: 'bold',
//         }}>
//         Welcome Home !!! {userEmail}
//       </Text>
//       <TouchableOpacity
//         style={{
//           width: 100,
//           backgroundColor: '#0275d8',
//           height: 50,
//           borderRadius: 10,
//           paddingTop: 10,
//           marginTop: 20,
//         }}
//         onPress={() => props.navigation.navigate('Login')}>
//         <Text
//           style={{
//             color: '#fff',
//             fontSize: 20,
//             textAlign: 'center',
//             textAlignVertical: 'center',
//           }}>
//           Sign Out
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({});

import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';

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
      {userData && (
        <>
          <Image
            source={{uri: userData.profilePic}}
            style={styles.profileImage}
          />
          <Text style={styles.nameText}>{userData.name}</Text>
          <Text style={styles.emailText}>{userData.Email}</Text>
        </>
      )}
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nameText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 18,
    color: 'gray',
  },
  signOutButton: {
    marginTop: 20,
    backgroundColor: '#0275d8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  signOutText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
});
