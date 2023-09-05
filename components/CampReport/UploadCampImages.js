import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { TextInput, Button, Avatar } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const UploadCampImages = () => {
  const navigation = useNavigation();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [pdfPreviews, setPdfPreviews] = useState([]);

  const handleImageUpload = async () => {
    try {
      const images = await ImagePicker.openPicker({
        mediaType: 'photo',
        multiple: true, // Allow multiple image selection
      });
  
      const previews = images.map((image) => (
        <Image
          key={image.path}
          source={{ uri: image.path }}
          style={styles.previewImage}
        />
      ));
  
      setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
    } catch (error) {
      // Handle the error, e.g., if the user cancels the selection
      console.error('Image picker error:', error);
    }
  };

  const handlePdfUpload = () => {
    // You can implement PDF file upload logic here.
    // For demonstration purposes, I'm just displaying a text placeholder.
    const pdfPreview = (
      <Text key={Math.random()} style={styles.previewPdf}>
        PDF File Preview
      </Text>
    );
    setPdfPreviews([...pdfPreviews, pdfPreview]);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.form}>
          
          <TouchableOpacity onPress={handleImageUpload}>
            <Button
              buttonColor="#0054a4"
              mode="contained"
              style={styles.uploadButton}
            >
              Upload Image (jpg/png)
            </Button>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={handlePdfUpload}>
            <Button
              buttonColor="#0054a4"
              mode="contained"
              style={styles.uploadButton}
            >
              Upload PDF
            </Button>
          </TouchableOpacity> */}
          <View style={styles.previewContainer}>
            {imagePreviews.map((preview, index) => (
              <View key={index}>{preview}</View>
            ))}
            {pdfPreviews.map((preview, index) => (
              <View key={index}>{preview}</View>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('UserProfileForm')}
          >
            <Button
              buttonColor="#0054a4"
              mode="contained"
              style={styles.button}
            >
              Submit
            </Button>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    datePickerContainer: {
        flexDirection: 'column',
    // alignItems:'center'
     
      
      },
      pickcontainer:{
        backgroundColor:'white',
        borderWidth: 1,
        borderColor: '#0054a4',
       borderRadius: 5,
       marginTop:10,
        marginBottom: 15,
       
      },
      picker:{
        // backgroundColor:'#fff',
        width:'100%',
        borderWidth: 1,
        borderColor: '#0054a4',
        borderRadius: 5,
        padding: 0,
      },
      datePickerLabel: {
        fontSize: 14, // You can adjust the font size as needed
        marginBottom: 3, // Spacing between label and button
        color:'#0054a4',
        fontWeight:'600',
       
      },
      datePickerButton: {
        width:'auto',
        borderRadius:5,
        textAlign:'left',
        alignItems:'flex-start',
        fontSize: 16, // You can adjust the font size as needed
        backgroundColor:'#fff',
        borderWidth: 1,
        borderColor: '#0054a4',
        padding:5,
        marginBottom: 12,
      },
      container: {
        flex: 1,
        padding: 16,
      },
      form: {
        marginTop:40,
        flex: 1,
      },
      input: {
        borderColor: 'blue',
        marginBottom: 12,
      },
      profileimg:{
    
      },
      button: {
     
        marginTop: 16,
      },
      avatarContainer: {
        alignItems: 'center',
        marginBottom: 16,
      },
      changeAvatarText: {
        color: '#0054a4',
        textAlign: 'center',
      },
  uploadButton: {
    backgroundColor: '#0054a4',
    marginTop: 16,
  },
  previewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  previewImage: {
    width: 100,
    height: 100,
    margin: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  previewPdf: {
    width: 100,
    height: 100,
    margin: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    paddingTop: 40,
  },
});

export default UploadCampImages;
