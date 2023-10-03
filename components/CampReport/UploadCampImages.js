import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,Alert
} from 'react-native';
import { TextInput, Button, Avatar } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { BASE_URL } from '../Configuration/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const UploadCampImages = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [pdfPreviews, setPdfPreviews] = useState([]);
  const [feedback, setFeedback] = useState(''); // Feedback text
  const [imageUris, setImageUris] = useState([]);
  const { crid, id } = route.params;

  const handleImageUpload = async () => {

    try {

      if (imageUris.length >= 3) {
        // If there are already 3 images, show an alert
        alert('You can upload a maximum of 3 images');
        return;
      }
      const images = await ImagePicker.openPicker({
        mediaType: 'photo',
        multiple: true, // Allow multiple image selection
      });
      if (images.length + imageUris.length > 3) {
        // If the total number of selected images exceeds 3, show an alert
        alert('You can upload a maximum of 3 images');
        return;
      }
      const previews = images.map((image, index) => (
        <TouchableOpacity key={index} onPress={() => handleDeleteImage(index)}>
          <Image source={{ uri: image.path }} style={styles.previewImage} />
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      ));
  
      // Store image URIs directly in an array
      const newImageUris  = images.map((image) => image.path);
  
      setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
      
      // Store the image URIs in another state variable
      setImageUris((prevImageUris) => [...prevImageUris, ...newImageUris ]);
    } catch (error) {
      // Handle the error, e.g., if the user cancels the selection
      console.error('Image picker error:', error);
    }
  };
  
  
  const handleDeleteImage = (indexToDelete) => {
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToDelete)
    );
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

  const submitData = async () => {
    if (!feedback || !imageUris  ) {
      // Display an alert message if any required fields are empty
      alert('Please fill in all required fields');
      return;
    }
    try {
      const ApiUrl = `${BASE_URL}${'/report/uploadImages'}`;
  
      // Retrieve userId from AsyncStorage
      const data = await AsyncStorage.getItem('userdata');
      if (data) {
        const userData = JSON.parse(data);
        const userId = userData.responseData.user_id;
  
        // Create a FormData object
        const formData = new FormData();
  
        // Append data to the FormData object
        formData.append('crId', crid); // Replace with the correct crId
        formData.append('userId', userId); // Use the retrieved userId
        formData.append('feedback', feedback);
  
        // Append images to the FormData object
        imageUris.forEach((imageUri, index) => {
          const imageName = `image_${index + 1}.jpg`;
          formData.append('images', {
            uri: imageUri,
            name: imageName,
            type: 'image/jpeg',
          });
        });
        console.log(formData)
        // Send a POST request with the FormData
        const response = await fetch(ApiUrl, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Handle the response from the API
        if (response.ok) {
          const data = await response.json();
          console.log('Upload successful Response:', data);
          Alert.alert('Success', 'Camp Report uploaded successfully', [
            { text: 'OK', onPress: () => navigation.navigate('ReportList', { id }) },
          ]);
          console.log('Forwarded Crid', id);
        } else {
          // Handle success response from the API
          const error = await response.json();
          console.log('Error', error);
          // Navigate to the next screen
        }
      } else {
        console.error('Invalid or missing data in AsyncStorage');
      }
    } catch (error) {
      // Handle any errors that occur during the upload process
      console.error('Error uploading data:', error);
    }
  };
  
  
  return (
    // <LinearGradient colors={['#72c5f8',  '#daf5ff']} style={styles.container} >
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.form}>

          <TouchableOpacity onPress={handleImageUpload}>
            <Button
              // buttonColor="#0047b9"
              mode="contained"
              style={styles.uploadButton}
            >
              Upload Image (jpg/png)
            </Button>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={handlePdfUpload}>
            <Button
              buttonColor="#0047b9"
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
          <TextInput
            label="Feedback"
            value={feedback}
            onChangeText={(text) => setFeedback(text)}
            mode="outlined"
            style={styles.input}
          />
          <TouchableOpacity
            
          >
           
            <LinearGradient colors={['#0047b9',  '#0c93d7']} style={styles.addbtn} >
 <Button
       
          onPress={submitData}
          
          labelStyle={styles.addbtnText}
        >
          Submit
        </Button>
 </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
    // </LinearGradient>
  );
};

const styles = StyleSheet.create({
  addbtn: {
    backgroundColor: '#0047b9',
    paddingLeft: 1,
    paddingRight: 1,
    color: 'white',
    marginTop: 8,
    marginBottom: 10,
    borderRadius:50,
   
  },
  addbtn1: {
    
    color: '#fff',
    
  },
  addbtnText: {
    color: '#fff', // Set the text color here
  },
  deleteButton: {
    color: 'red',
    textAlign: 'center',
  },
    datePickerContainer: {
        flexDirection: 'column',
    // alignItems:'center'
     
      
      },
      pickcontainer:{
        backgroundColor:'white',
        borderWidth: 1,
        borderColor: '#0047b9',
       borderRadius: 5,
       marginTop:10,
        marginBottom: 15,
       
      },
      picker:{
        // backgroundColor:'#fff',
        width:'100%',
        borderWidth: 1,
        borderColor: '#0047b9',
        borderRadius: 5,
        padding: 0,
      },
      datePickerLabel: {
        fontSize: 14, // You can adjust the font size as needed
        marginBottom: 3, // Spacing between label and button
        color:'#0047b9',
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
        borderColor: '#0047b9',
        padding:5,
        marginBottom: 12,
      },
      container: {
          // backgroundColor:'#B9D9EB',
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
        color: '#0047b9',
        textAlign: 'center',
      },
  uploadButton: {
    backgroundColor: '#0c93d7',
    borderColor:'#0047b9',
    color:'#0047b9',
    // borderStyle: 'dotted',
    borderWidth:2,
    marginTop: 16,
    padding:30,
    borderRadius:5,
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
