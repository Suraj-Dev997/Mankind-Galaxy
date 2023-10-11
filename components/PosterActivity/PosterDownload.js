import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import ViewShot from 'react-native-view-shot';
import RNFetchBlob from 'rn-fetch-blob';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {Button} from 'react-native-paper';
import RNFS from 'react-native-fs';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {BASE_URL} from '../Configuration/Config';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const DoctorPoster = ({doctorInfo, doctorImage}) => {
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
        style={styles.posterImage}
      />
      <View style={styles.imageContainer}>
        <Image
          source={{uri: doctorImage}}
          style={styles.doctorImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.doctorName}>{doctorInfo.name}</Text>
      {/* Other doctor info */}
    </View>
  );
};

const PosterDownload = () => {
  const [avatarUri, setAvatarUri] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const route = useRoute();

  const { doctorId,dc_id,id } = route.params;

  const doctorInfo = {
    name: 'Dr. John Doe',
    // Add other static data here
  };

  useEffect(() => {
    const handleMoreInfo = async doctor => {
      try {
        const payload = {
          dcId:dc_id,
        };
        const ApiUrl = `${BASE_URL}${'/doc/getPoster'}`;
        const ProfileUrl = `${BASE_URL}${'/'}`;
        const response = await fetch(ApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          if (Array.isArray(data) && data.length > 0) {
            const doctorData = data[0];
            if (doctorData.poster_name) {
              // Assuming that the API provides a valid image URL
              setAvatarUri(`${ProfileUrl}${doctorData.poster_name}`);
              console.log(avatarUri);
            }
          }
        } else {
          console.error('Error fetching doctor data:', response.statusText);
        }
      } catch (error) {
        console.log('Error saving data:', error);
      }
    };
    handleMoreInfo();
  }, [avatarUri,dc_id]);

  const viewShotRef = useRef(null);

  useEffect(() => {
    request(PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(result => {
      if (result === RESULTS.GRANTED) {
        console.log('Permission granted');
      }
    });
  }, []);

  const downloadImage = async () => {
    try {
      setLoading(true);
      const randomNum = Math.floor(Math.random() * 10000); // Generates a random number between 0 and 9999
      const imageName = `Poster_${randomNum}.jpg`;

      const path = RNFetchBlob.fs.dirs.DownloadDir + '/' + imageName;

      const response = await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'jpg',
        path,
      }).fetch('GET', avatarUri);

      console.log('Image downloaded successfully at:', path);
      Alert.alert(
        'Download Successful',
        'Image downloaded successfully',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } catch (error) {
      console.error('Error downloading image:', error);
      Alert.alert(
        'Download Error',
        'There was an error downloading the image',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } finally {
      setLoading(false); // Stop loading, whether successful or not
    }
  };

  const downloadPdf = async () => {
    try {
      setLoading(true);
      console.log('download pdf link', avatarUri);
      const randomNum = Math.floor(Math.random() * 10000); // Generates a random number between 0 and 9999
      const pdfName = `Document_${randomNum}.pdf`;
      const imageWidth = 830; // 8.5 inches (standard page width) * 72 DPI
      const imageHeight = 970; // 11 inches (standard page height) * 72 DPI
  
      const resizedImage = await Image.resolveAssetSource({ uri: avatarUri });
      const aspectRatio = resizedImage.width / resizedImage.height;
      const newImageWidth = aspectRatio >= 1 ? imageWidth : imageHeight * aspectRatio;
      const newImageHeight = aspectRatio >= 1 ? imageWidth / aspectRatio : imageHeight;
      const containerStyle = `
      width: ${imageWidth}px;
      height: ${imageHeight}px;
      display: flex;
      justify-content: center;
      align-items: center;
    `;

    const imageStyle = `
      max-width: ${newImageWidth}px;
      max-height: ${newImageHeight}px;
      width: auto;
      height: auto;
    `;
      const htmlContent = `
      <html>
      <body>
        <div style="${containerStyle}">
          <img src="${avatarUri}" style="${imageStyle}" />
        </div>
      </body>
    </html>
      `;
  
      const options = {
        html: htmlContent,
        fileName: pdfName,
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);

      const sourcePath = file.filePath;
      const destPath = `${RNFS.DownloadDirectoryPath}/${pdfName}`;

      await RNFS.moveFile(sourcePath, destPath);

      console.log('PDF moved to download folder:', destPath);

      Alert.alert(
        'Download Successful',
        'PDF downloaded successfully',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } catch (error) {
      console.error('Error creating PDF:', error);

      Alert.alert(
        'Download Error',
        'There was an error creating the PDF',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } finally {
      setLoading(false); // Stop loading, whether successful or not
    }
  };

  // const generateAndDownloadPoster = async () => {
  //   if (avatarUri) {
  //     const dirs = RNFetchBlob.fs.dirs;
  //     const imagePath = `${dirs.DownloadDir}/doctor_poster.jpg`;

  //     RNFetchBlob.config({
  //       fileCache: true,
  //       appendExt: 'jpg',
  //     })
  //       .fetch('GET', avatarUri)
  //       .then(res => {
  //         if (res.respInfo.status === 200) {
  //           // Check if the source file exists before moving it
  //           RNFetchBlob.fs
  //             .exists(res.path())
  //             .then(exists => {
  //               if (exists) {
  //                 RNFetchBlob.fs
  //                   .mv(res.path(), imagePath)
  //                   .then(() => {
  //                     console.log('Poster downloaded successfully');
  //                   })
  //                   .catch(error => {
  //                     console.error('Error moving the downloaded file:', error);
  //                   });
  //               } else {
  //                 console.error('Source file does not exist at:', res.path());
  //               }
  //             })
  //             .catch(error => {
  //               console.error('Error checking if source file exists:', error);
  //             });
  //         } else {
  //           console.error(
  //             'Failed to download image. Status code:',
  //             res.respInfo.status,
  //           );
  //         }
  //       })
  //       .catch(error => {
  //         console.error('Error fetching image:', error);
  //       });
  //   } else {
  //     console.error('avatarUri is empty or invalid');
  //   }
  // };

  // const generateAndDownloadPdf = async () => {
  //   if (viewShotRef.current) {
  //     try {
  //       // Request permission to write to external storage (Download directory)
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //         {
  //           title: 'Storage Permission',
  //           message: 'App needs access to your storage to save the PDF.',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );

  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         const uri = await viewShotRef.current.capture();
  //         const dirs = RNFetchBlob.fs.dirs;
  //         const imagePath = `${dirs.DownloadDir}/doctor_poster.jpg`;

  //         // Create a PDF document with the image
  //         const pdfOptions = {
  //           html: `<html><body><img src="file://${uri}" /></body></html>`,
  //           fileName: 'doctor_poster',
  //           directory: dirs.DownloadDir,
  //         };

  //         const pdfFilePath = await RNHTMLtoPDF.convert(pdfOptions);

  //         // Display a message or perform other actions
  //         console.log('PDF downloaded successfully', pdfFilePath);
  //       } else {
  //         console.log('Permission denied.');
  //       }
  //     } catch (error) {
  //       console.error('Error while generating or downloading PDF:', error);
  //     }
  //   }
  // };

  return (
    // <LinearGradient colors={['#72c5f8',  '#daf5ff']} style={styles.container} >
      <View style={styles.container}>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.postertitle}>Download Doctor Posters</Text>
      </TouchableOpacity>

      {avatarUri ? (
        <ViewShot ref={viewShotRef} options={{format: 'jpg', quality: 0.9}} style={styles.viewsstyle}>
          {/* Your content that you want to capture */}
          <Image source={{uri: avatarUri}} style={{width: 250, height: 390}} />
        </ViewShot>
      ) : (
        <Text style={styles.noPosterText}>Poster not available</Text>
      )}

      <View style={styles.btncont}>
        <View style={styles.buttonContainer}>
          
      
        
        
          <LinearGradient colors={['#0047b9',  '#0c93d7']} style={styles.addbtn} >
          <Button
        
            // mode="contained"
            style={styles.addbtn1}
            labelStyle={styles.addbtnText}
            onPress={downloadImage}
       >
          {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              'Download Image'
            )}
          </Button>
          </LinearGradient>
        </View>
        <View style={styles.buttonContainer}>
          
          {/* <Button
            buttonColor="#0047b9"
            mode="contained"
            style={styles.Button}
            onPress={downloadPdf}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              'Download Pdf'
            )}
          </Button> */}

          <LinearGradient colors={['#0047b9',  '#0c93d7']} style={styles.addbtn} >
          <Button
        
            // mode="contained"
            style={styles.addbtn1}
            labelStyle={styles.addbtnText}
            onPress={downloadPdf}
       >
          {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              'Download Pdf'
            )}
          </Button>
          </LinearGradient>
        </View>
      </View>
    </View>
    // </LinearGradient>
    
  );
};

const styles = StyleSheet.create({
  viewsstyle:{
borderWidth:5,
borderColor:'#0047b9',
marginTop:10,
  },
  addbtnText: {
    color: '#fff', // Set the text color here
  },
  addbtn: {
    backgroundColor: '#0047b9',
    paddingLeft: 1,
    paddingRight: 1,
    color: 'white',
    marginTop: 8,
    marginBottom: 10,
    borderRadius:50,
    width: '100%',
  },
  addbtn1: {
    
    color: '#fff',
    
  },
  postertitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0047b9',
  },
  btncont: {
    padding: 20,
    flexDirection: 'row', // Arrange items horizontally
    justifyContent: 'space-around', // Space evenly between items
  },
  buttonContainer: {
    flex: 1, // Equal flex for both buttons to take half of the available space
    marginHorizontal: 5, // Add margin between buttons (adjust as needed)
  },
  Button: {
    // margin:20
    borderRadius:50,
  },
  container: {
    //  backgroundColor:'#B9D9EB',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterContainer: {
    position: 'relative',
    width: 500, // Set to your poster width
    height: 520, // Set to your poster height
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
    left: '41%', // Adjust the position as needed
    textAlign: 'center',
    fontSize: 16,
  },
});
export default PosterDownload;
