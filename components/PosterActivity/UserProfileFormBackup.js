import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Avatar } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';

const UserProfileForm = () => {
  const [name, setName] = useState('');
  const [qualification, setQualification] = useState('');
  const [date, setDate] = useState('');
  const [avatarSource, setAvatarSource] = useState(null); // To store selected image

  const chooseImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.error) {
        // Set the selected image as the avatar
        setAvatarSource({ uri: response.uri });
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={chooseImage}>
        <View style={styles.avatarContainer}>
          {avatarSource ? (
            <Avatar.Image
              source={{ uri: avatarSource.uri }}
              size={80}
            />
          ) : (
            <Avatar.Image
              source={require('./Images/Logo.png')} // Replace with your default avatar image
              size={80}
            />
          )}
        </View>
        <Text style={styles.changeAvatarText}>Change Avatar</Text>
      </TouchableOpacity>

      <View style={styles.form}>
        <TextInput
          label="Name"
          value={name}
          onChangeText={(text) => setName(text)}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Qualification"
          value={qualification}
          onChangeText={(text) => setQualification(text)}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Date"
          value={date}
          onChangeText={(text) => setDate(text)}
          mode="outlined"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={() => {
            // Handle form submission here
          }}
          style={styles.button}
        >
          Save
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  changeAvatarText: {
    color: 'blue',
    textAlign: 'center',
  },
});

export default UserProfileForm;
