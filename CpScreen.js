import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign';

const CpScreen = ({route, navigation}) => {
  const PostDesignation = route.params.PostDesignation;
  const designations = [
    'C.P.',
    'Spl.C.P.',
    'Jt. C.P.',
    'Addl. C.P.',
    'D.C.P.',
    'A.C.P.',
    'Sr. P.I. / P.I.',
    'A.P.I.',
    'P.S.I.',
    'A.S.I.',
    'H.C.',
    'P.N.',
    'P.C.',
  ];

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = {};

      for (const designation of designations) {
        const querySnapshot = await firestore()
          .collection('users')
          .where('designation', '==', designation)
          .get();

        data[designation] = querySnapshot.docs.map(doc => doc.data());
      }

      setUserData(data);
    };

    fetchData();
  }, []);

  console.log(userData);
  console.log(PostDesignation);

  const GotoChatScreen = () => {
    return (
      <View>
        <TouchableOpacity
          style={{width: 40, height: 50}}
          onPress={() => {
            navigation.navigate('Chat');
          }}>
          <AntDesign
            name="wechat"
            style={{
              color: '#000',
              fontSize: 40,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const GotoRequestScreen = () => {
    return (
      <View>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: 80,
            height: 30,
            paddingHorizontal: 10,
            borderWidth: 2,
            borderColor: '#0275d8',
            borderRadius: 10,
            backgroundColor: '#fff',
          }}
          onPress={() => {
            navigation.navigate('Request');
          }}>
          <Text>Request</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderActionButton = userDesignation => {
    const userIndex = designations.indexOf(userDesignation);
    const postIndex = designations.indexOf(PostDesignation);

    if (userIndex !== -1 && postIndex !== -1) {
      return userIndex >= postIndex || userIndex + 1 >= postIndex
        ? GotoChatScreen()
        : GotoRequestScreen();
    }

    return null;
  };

  return (
    <ScrollView style={styles.container}>
      {designations.map((designation, index) => (
        <View key={index} style={styles.designationContainer}>
          <Text style={{fontSize: 16, marginBottom: 10}}>
            Find all the {designation} here ...
          </Text>
          {userData[designation] &&
            userData[designation].map((user, userIndex) => (
              <View key={userIndex} style={styles.userContainer}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View>
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
                  {/* {GotoRequestScreen()} */}
                  {renderActionButton(user.designation)}
                </View>
              </View>
            ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default CpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 20,
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
  designationContainer: {
    backgroundColor: '#ffe4',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderBottomColor: 'brown',
    shadowColor: '#000',
    marginBottom: 20,
  },
});
