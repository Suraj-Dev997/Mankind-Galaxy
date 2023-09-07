import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import ViewShot from 'react-native-view-shot';
import RNFetchBlob from 'rn-fetch-blob';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {  Button } from 'react-native-paper';

const DoctorPoster = ({ doctorInfo, doctorImage }) => {
  return (
    // <View>
    //   <Image source={require('./Melasma.jpg')} style={{ width: 300, height: 400 }} />
    //   <Image source={{ uri: doctorImage }} style={{ position: 'absolute', bottom: 21, left: 27, width: 80, height: 80,borderRadius:50 }} />
    //   <Text style={{ position: 'absolute', bottom: 60, left: 120 }}>{doctorInfo.name}</Text>
    // </View>
    <View style={styles.posterContainer}>
    {/* Your poster template */}
    <Image
    source={require('./Images/Melasma.jpg')}
    style={styles.posterImage} />
    <View style={styles.imageContainer}>
      <Image source={{ uri: doctorImage }} style={styles.doctorImage} resizeMode="cover" />
    </View>
    <Text style={styles.doctorName}>{doctorInfo.name}</Text>
    {/* Other doctor info */}
  </View>
  );
};

const PosterDownload = () => {
  const doctorInfo = {
    name: 'Dr. John Doe',
    // Add other static data here
  };
  
  const doctorImage = 'https://zplusconnect.netcastservice.co.in/doctor.png'; // Replace with a valid image URL
  const viewShotRef = useRef(null);

  const generateAndDownloadPoster = async () => {
    if (viewShotRef.current) {
      const uri = await viewShotRef.current.capture();
      const dirs = RNFetchBlob.fs.dirs;
      const imagePath = `${dirs.DownloadDir}/doctor_poster.jpg`;

      RNFetchBlob.fs.cp(uri, imagePath)
        .then(() => {
          // Display a message or perform other actions
          console.log('Poster downloaded successfully');
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const generateAndDownloadPdf = async () => {
    if (viewShotRef.current) {
      const uri = await viewShotRef.current.capture();
      const dirs = RNFetchBlob.fs.dirs;
      const imagePath = `${dirs.DownloadDir}/doctor_poster.jpg`;
  
      // Create a PDF document with the image
      const pdfOptions = {
        html: `<html><body><img src="file://${uri}" /></body></html>`,
        fileName: 'doctor_poster',
        directory: dirs.DownloadDir,
      };
  
      RNHTMLtoPDF.convert(pdfOptions)
        .then(pdfFilePath => {
          // Display a message or perform other actions
          console.log('PDF downloaded successfully', pdfFilePath);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };


  return (
    // <View>
    //   <TouchableOpacity onPress={() => {}}>
    //     <Text>Static Doctor Image</Text>
    //   </TouchableOpacity>
    //   {doctorImage && (
    //     <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
    //       <DoctorPoster doctorInfo={doctorInfo} doctorImage={doctorImage} />
    //     </ViewShot>
    //   )}
    //   <Button title="Generate Poster and Download" onPress={generateAndDownloadPoster} />
    // </View>
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.postertitle}>Download Doctor Posters</Text>
      </TouchableOpacity>
      {doctorImage && (
        <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
          <DoctorPoster doctorInfo={doctorInfo} doctorImage={doctorImage} />
        </ViewShot>
      )}
      <View style={styles.btncont}>
  <View style={styles.buttonContainer}>
    <Button
      buttonColor="#0054a4"
      mode="contained"
      style={styles.button}
      onPress={generateAndDownloadPoster}
    >
      Download Image
    </Button>
  </View>
  <View style={styles.buttonContainer}>
    <Button
      buttonColor="#0054a4"
      mode="contained"
      style={styles.Button}
      onPress={generateAndDownloadPdf}
    >
      Download Pdf
    </Button>
  </View>
</View>
      
    </View>
  );
};

const styles = StyleSheet.create({
    postertitle:{
        fontSize:20,
        fontWeight:'600',
        color:'#0054a4'
        
    },
    btncont: {
        padding:20,
        flexDirection: 'row', // Arrange items horizontally
        justifyContent: 'space-around', // Space evenly between items
      },
      buttonContainer: {
        flex: 1, // Equal flex for both buttons to take half of the available space
        marginHorizontal: 5, // Add margin between buttons (adjust as needed)
      },
    Button:{
        // margin:20
    },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterContainer: {
    marginTop:20,
    marginBottom:20,
    position: 'relative',
    width: 300, // Set to your poster width
    height: 400, // Set to your poster height
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Clip overflowing content
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    position: 'absolute',
    bottom: '5.5%',
    left:'9%', // Adjust the position as needed
    width: '27%', // Adjust the size as needed
    height: '20%', // Maintain a square aspect ratio for the doctor's image
    borderRadius: 50, // To make it circular
    overflow: 'hidden', // Clip overflowing content
  },
  doctorImage: {
    
    width: '100%',
    height: '100%',
  },
  doctorName: {
    position: 'absolute',
    bottom: '13%',
    left:'41%', // Adjust the position as needed
    textAlign: 'center',
    fontSize: 16,
  },
});
export default PosterDownload;
