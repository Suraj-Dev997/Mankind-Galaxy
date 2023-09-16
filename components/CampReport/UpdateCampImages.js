import React, { useState,useEffect } from 'react';
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
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../Configuration/Config';

const UpdateCampImages = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [pdfPreviews, setPdfPreviews] = useState([]);
  const [feedback, setFeedback] = useState(''); // Feedback text
  const [imageUris, setImageUris] = useState([]);
  const { crid, id } = route.params;
  // console.log('ImagePage crid',crid)


  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        const ApiUrl = `${BASE_URL}/report/getImages`;
        const response = await fetch(ApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            crId: crid, // Replace with the correct crId
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const ReportUrl = `${BASE_URL}${'/uploads/report/'}`;
          // Extract image paths and feedback from the response
          const imagePaths = data.map((item) =>ReportUrl + item.imgpath);
          const feedbackText = data[0].feedback || ''; // Assuming feedback is the same for all images
          console.log(imagePaths)
          // Set the imagePreviews and feedback states
          setImagePreviews(imagePaths.map((path, index) => (
            <TouchableOpacity key={index} onPress={() => handleDeleteImage(index)}>
              <Image source={{ uri: path }} style={styles.previewImage} />
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          )));
          setFeedback(feedbackText);
        } else {
          console.error('Failed to fetch data from the API');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function when the component is mounted
    fetchData();
  }, [crid]);

  const handleImageUpload = async () => {
    try {
      const images = await ImagePicker.openPicker({
        mediaType: 'photo',
        multiple: true, // Allow multiple image selection
      });
  
      const previews = images.map((image, index) => (
        <TouchableOpacity key={index} onPress={() => handleDeleteImage(index)}>
          <Image source={{ uri: image.path }} style={styles.previewImage} />
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      ));
  
      // Store image URIs directly in an array
      const imageUris = images.map((image) => image.path);
      
      setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
      
      
      // Store the image URIs in another state variable
      setImageUris((prevImageUris) => [...prevImageUris, ...imageUris]);
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
  const getUserIdFromStorage = async () => {
    try {
      const data = await AsyncStorage.getItem('userdata');
      if (data) {
        const userData = JSON.parse(data);
        return userData.responseData.user_id;
      } else {
        console.error('Invalid or missing data in AsyncStorage');
        return null; // Return null if user_id is not available
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null; // Return null in case of an error
    }
  };
  const submitData = async () => {
    try {
      const userId = await getUserIdFromStorage();
    
    if (userId === null) {
      // Handle the case where userId is not available
      return;
    }
    const ApiUrl = `${BASE_URL}${'/report/UpdateImages'}`;
      
  
      // Create a FormData object
      const formData = new FormData();
  
      // Append data to the FormData object
      formData.append('crId', crid); // Replace with the correct crId
      formData.append('userId', userId); // Replace with the correct userId
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
        navigation.navigate('ReportList',id);
        console.log('Forworded Crid',id)
      } else {
        // Handle success response from the API
        const error = await response.json();
        console.log('Error',error);
         // Navigate to the next screen
      }
    } catch (error) {
      // Handle any errors that occur during the upload process
      console.error('Error uploading data:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.form}>
          
          <TouchableOpacity onPress={handleImageUpload}>
            <Button
              // buttonColor="#0054a4"
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
          <TextInput
            label="Feedback"
            value={feedback}
            onChangeText={(text) => setFeedback(text)}
            mode="outlined"
            style={styles.input}
          />
          <TouchableOpacity
            
          >
            <Button
              buttonColor="#0054a4"
              mode="contained"
              style={styles.button}
              onPress={submitData}
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
    backgroundColor: '#08a5d8',
    borderColor:'#0054a4',
    color:'#0054a4',
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

export default UpdateCampImages;
