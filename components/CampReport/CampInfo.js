import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { TextInput, Button, Avatar } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../Configuration/Config';

const CampInfo = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [pdfPreviews, setPdfPreviews] = useState([]);
  const [feedback, setFeedback] = useState(''); // Feedback text
  const [imageUris, setImageUris] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedValue, setSelectedValue] = useState('option1');
  const [brandOptions, setBrandOptions] = useState([]);
  const [brand, setBrand] = useState();
  const [textInputValue, setTextInputValue] = useState('');
  const [userEmpCode, setUserEmpCode] = useState('');
  const [campDate, setCampDate] = useState();
  const [hq, setHq] = useState();
  const {crId, id } = route.params;
//   console.log('Camp info crid',crId)


useEffect(() => {
    const handleMoreInfo = async(doctor) => {
      setIsLoading(true);
        try {
        
          const payload ={
            crId:crId
          }
          const ApiUrl = `${BASE_URL}${'/report/getReportInfoWithId'}`;
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
              console.log("doc data",doctorData)
              setTextInputValue(doctorData.doctor_name);
              setUserEmpCode(doctorData.name)
              setHq(doctorData.hq)
              setCampDate(doctorData.camp_date);
              console.log(doctorData.user_empcode)
            }
          } else {
            console.error('Error fetching doctor data:', response.statusText);
          }
          setIsLoading(false);
        } catch (error) {
          console.log('Error saving data:', error);
          setIsLoading(false);
        } 
      }
    handleMoreInfo();
  }, [crId]);


  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const ApiUrl = `${BASE_URL}/report/getImages`;
        const response = await fetch(ApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            crId: crId, // Replace with the correct crId
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
            <TouchableOpacity key={index} >
              <Image source={{ uri: path }} style={styles.previewImage} />
             
            </TouchableOpacity>
          )));
          setFeedback(feedbackText);
        } else {
          console.error('Failed to fetch data from the API');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    // Call the fetchData function when the component is mounted
    fetchData();
  }, [crId]);

  useEffect(() => {
    // Fetch questions from the API
    setIsLoading(true);
    const ApiUrl = `${BASE_URL}${'/report/getQuestionWithSubCatId'}`;
    fetch(ApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subCatId: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log('API Response:', data);
        setQuestions(data[0]);
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
      });
      setIsLoading(false);
//       console.log('questions:', questions);
// console.log('selectedAnswers:', selectedAnswers);
  }, [questions, selectedAnswers,id]);

  useEffect(() => {
    // Fetch data from the API
    setIsLoading(true);
    const ApiUrl = `${BASE_URL}/report/getAnswerWithId`;
    fetch(ApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        crId: crId, // Update with the correct crId
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Extract answers and brand_id from the API response
        const answers = {};
        let selectedBrandId = 'option1'; // Default value for brand if no data is available
        let selectedBrandName = 'Brand Name'; 
        if (data.length > 0) {
          selectedBrandId = data[0].brand_id.toString();
          selectedBrandName = data[0].description.toString(); // Use the brand_id from the first item in the response
          data.forEach((item) => {
            answers[item.rqid] = item.answer.toString(); // Store answers in an object
          });
        }
  
        // Update state variables with the fetched data
        setSelectedAnswers(answers);
        setSelectedValue(selectedBrandId);
        setBrand(selectedBrandName);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
      setIsLoading(false);
  }, [crId]);
  const renderQuestions = () => {
    if (!questions || questions.length === 0) {
      return (
        <Text style={styles.errorText}>
          Error loading questions. Please check your internet connection and try again.
        </Text>
      );
    }
  
    return questions.map((question) => (
      <View key={question.rqid}>
        <Text style={styles.datePickerLabel}>{question.question}</Text>
        <TextInput
        //   label={`Answer for ${question.question}`}
          value={selectedAnswers[question.rqid] || ''}
          disabled
          mode="outlined"
          style={styles.input}
          outlineColor='#0047b9'
          activeOutlineColor='#08a5d8'
          keyboardType="numeric"
        />
      </View>
    ));
  };
  useEffect(() => {
    setIsLoading(true);
    const ApiUrl = `${BASE_URL}${'/report/getBrandName'}`;
    // Fetch brand options from the API
    fetch(ApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subCatId: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Assuming data is an array of brand objects
        setBrandOptions(data[0]);
      })
      .catch((error) => {
        console.error('Error fetching brand options:', error);
      });
      setIsLoading(false);
  }, [id]);

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

  return (
    <View style={styles.container}>
        {/* Loading indicator */}
        {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0047b9" />
        </View>
      )}
      <ScrollView>
      
        <View style={styles.form}>
        <Text style={styles.datePickerLabel}>Name of MR:</Text>
          <TextInput
            
            value={userEmpCode}
           disabled
            mode="outlined"
            style={styles.input}
          />
          <Text style={styles.datePickerLabel}>Doctor Name:</Text>
          <TextInput
            
            value={textInputValue}
           disabled
            mode="outlined"
            style={styles.input}
          />
          <Text style={styles.datePickerLabel}>Camp Date:</Text>
          <TextInput
            
            value={campDate}
           disabled
            mode="outlined"
            style={styles.input}
          />
          <Text style={styles.datePickerLabel}>HQ:</Text>
          <TextInput
            
            value={hq}
           disabled
            mode="outlined"
            style={styles.input}
          />
        
        {renderQuestions()}
        {/* <Text style={styles.datePickerLabel}>Brand Name:</Text>
        <View style={styles.pickcontainer} disabled>
  <Picker
  disabled
            selectedValue={selectedValue}
            style={styles.picker}
           
          >
            <Picker.Item label="Select Brand" value="option1" disabled />
            {brandOptions.map((brand) => (
              <Picker.Item key={brand.basic_id} label={brand.description} value={brand.basic_id.toString()}  />
            ))}
          </Picker>
        </View> */}
        <Text style={styles.datePickerLabel}>Brand Name:</Text>
          <TextInput
            
            value={brand}
           disabled
            mode="outlined"
            style={styles.input}
          />
        <Text style={styles.datePickerLabel}>Camp Images:</Text>
          <View style={styles.previewContainer}>
          
            {imagePreviews.map((preview, index) => (
              <View key={index}>{preview}</View>
            ))}
            {pdfPreviews.map((preview, index) => (
              <View key={index}>{preview}</View>
            ))}
          </View>
          <Text style={styles.datePickerLabel}>Feedback</Text>
          <TextInput
            
            value={feedback}
           disabled
            mode="outlined"
            style={styles.input}
          />
        
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Place it above other UI components
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
        backgroundColor:'#ffffff',
        borderWidth: 1,
        borderColor: '#0047b9',
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
        color: '#0047b9',
        textAlign: 'center',
      },
  uploadButton: {
    backgroundColor: '#08a5d8',
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
    marginTop: 5,
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

export default CampInfo;
