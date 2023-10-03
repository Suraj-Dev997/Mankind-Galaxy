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
              buttonColor="#0047b9"
              mode="contained"
              style={styles.uploadButton}
            >
              Upload Image (jpg/png)
            </Button>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePdfUpload}>
            <Button
              buttonColor="#0047b9"
              mode="contained"
              style={styles.uploadButton}
            >
              Upload PDF
            </Button>
          </TouchableOpacity>
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
              buttonColor="#0047b9"
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
  // Existing styles...
  uploadButton: {
    backgroundColor: '#0047b9',
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
