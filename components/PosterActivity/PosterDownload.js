import React, { useRef,useEffect,useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions,PermissionsAndroid  } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import ViewShot from 'react-native-view-shot';
import RNFetchBlob from 'rn-fetch-blob';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {  Button } from 'react-native-paper';
import { BASE_URL } from '../Configuration/Config';

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

  const [avatarUri, setAvatarUri] = useState(null);
  const doctorInfo = {
    name: 'Dr. John Doe',
    // Add other static data here
  };

  useEffect(() => {
    const handleMoreInfo = async(doctor) => {
       
        try {
        
          const payload ={
          
            dcId:24
          }
          const ApiUrl = `${BASE_URL}${'/doc/getPoster'}`;
          const ProfileUrl = `${BASE_URL}${'/'}`;
          const response = await fetch(ApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })
          if (response.ok) {
            const data = await response.json();
            console.log('API Response:', data);
            if (Array.isArray(data) && data.length > 0) {
              const doctorData = data[0];
              if (doctorData.poster_name) {
                // Assuming that the API provides a valid image URL
                setAvatarUri(`${ProfileUrl}${doctorData.poster_name}`);
                console.log(avatarUri)
                
              
              }
            }
          } else {
            console.error('Error fetching doctor data:', response.statusText);
          }
        } catch (error) {
          console.log('Error saving data:', error);
        }
       
     
       
      }
    handleMoreInfo();
  }, [avatarUri]);
  
  const doctorImage = 'https://zplusconnect.netcastservice.co.in/doctor.png'; // Replace with a valid image URL
  const viewShotRef = useRef(null);

  const generateAndDownloadPoster = async () => {
    if (avatarUri) {
      const dirs = RNFetchBlob.fs.dirs;
      const imagePath = `${dirs.DownloadDir}/doctor_poster.jpg`;
  
      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'jpg',
      })
        .fetch('GET', avatarUri)
        .then(res => {
          if (res.respInfo.status === 200) {
            // Check if the source file exists before moving it
            RNFetchBlob.fs.exists(res.path())
              .then(exists => {
                if (exists) {
                  RNFetchBlob.fs.mv(res.path(), imagePath)
                    .then(() => {
                      console.log('Poster downloaded successfully');
                    })
                    .catch(error => {
                      console.error('Error moving the downloaded file:', error);
                    });
                } else {
                  console.error('Source file does not exist at:', res.path());
                }
              })
              .catch(error => {
                console.error('Error checking if source file exists:', error);
              });
          } else {
            console.error('Failed to download image. Status code:', res.respInfo.status);
          }
        })
        .catch(error => {
          console.error('Error fetching image:', error);
        });
    } else {
      console.error('avatarUri is empty or invalid');
    }
  };
  

  const generateAndDownloadPdf = async () => {
    if (viewShotRef.current) {
      try {
        // Request permission to write to external storage (Download directory)
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to save the PDF.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
  
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          const uri = await viewShotRef.current.capture();
          const dirs = RNFetchBlob.fs.dirs;
          const imagePath = `${dirs.DownloadDir}/doctor_poster.jpg`;
  
          // Create a PDF document with the image
          const pdfOptions = {
            html: `<html><body><img src="file://${uri}" /></body></html>`,
            fileName: 'doctor_poster',
            directory: dirs.DownloadDir,
          };
  
          const pdfFilePath = await RNHTMLtoPDF.convert(pdfOptions);
  
          // Display a message or perform other actions
          console.log('PDF downloaded successfully', pdfFilePath);
        } else {
          console.log('Permission denied.');
        }
      } catch (error) {
        console.error('Error while generating or downloading PDF:', error);
      }
    }
  };


  return (
  
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.postertitle}>Download Doctor Posters</Text>
      </TouchableOpacity>
    
       {avatarUri ? (
        <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
        {/* Your content that you want to capture */}
        <Image source={{ uri: avatarUri }} style={{ width: 300, height: 400 }} />
      </ViewShot>
      ) : (
        <Text style={styles.noPosterText}>Poster not available</Text>
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
    
    position: 'relative',
    width: 400, // Set to your poster width
    height: 580, // Set to your poster height
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Clip overflowing content
  },
  posterImage: {
    width: '100%',
    height: '100%',
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
