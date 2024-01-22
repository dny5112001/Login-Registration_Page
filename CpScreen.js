import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const CpScreen = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await firestore().collection('users').get();

      const filteredData = querySnapshot.docs
        .map(doc => doc.data())
        .filter(user => user.designation === 'C.P.');

      setUserData(filteredData);
    };

    fetchData();
  }, []);

  console.log(userData);

  return (
    <View style={styles.container}>
      {userData.map((user, index) => (
        <View key={index} style={styles.userContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.designation}>{user.designation}</Text>
            <Text style={styles.name}>{user.name}</Text>
          </View>

          <Text style={styles.phone}>Phone: {user.mobile}</Text>
        </View>
      ))}
    </View>
  );
};

export default CpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  userContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderColor: '#0275d8',
    borderWidth: 1,
    borderRadius: 8,
  },
  designation: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 5,
  },
  phone: {
    fontSize: 14,
  },
});
