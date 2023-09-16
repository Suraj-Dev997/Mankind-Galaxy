import React, { useState,useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Button, Avatar } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { BASE_URL } from '../Configuration/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateCampData = () => {
  
  const [qualification, setQualification] = useState('');
  const [avatarUri, setAvatarUri] = useState(null); // To store the URI of the selected image
  const [campDate, setCampDate] = useState(new Date());
  const [showCampDatePicker, setShowCampDatePicker] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const [selectedValue, setSelectedValue] = useState('option1');
  const [brandOptions, setBrandOptions] = useState([]); // To store brand options from the API
  const navigation = useNavigation();
  const route = useRoute();
  const { crid, id } = route.params;
// console.log('route',crid)


useEffect(() => {
  // Fetch data from the API
  const ApiUrl = `${BASE_URL}/report/getAnswerWithId`;
  fetch(ApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      crId: 29, // Update with the correct crId
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Extract answers and brand_id from the API response
      const answers = {};
      let selectedBrandId = 'option1'; // Default value for brand if no data is available

      if (data.length > 0) {
        selectedBrandId = data[0].brand_id.toString(); // Use the brand_id from the first item in the response
        data.forEach((item) => {
          answers[item.rqid] = item.answer.toString(); // Store answers in an object
        });
      }

      // Update state variables with the fetched data
      setSelectedAnswers(answers);
      setSelectedValue(selectedBrandId);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}, [crid]);


const submitData = () => {
  // Retrieve the userId from AsyncStorage
  AsyncStorage.getItem('userdata')
    .then((data) => {
      if (data) {
        const userData = JSON.parse(data);
        const userId = userData.responseData.user_id;

        // Create an array to store the payload data dynamically
        const dataArray = [];

        // Loop through selectedAnswers to create the payload
        for (const rqid in selectedAnswers) {
          if (selectedAnswers.hasOwnProperty(rqid)) {
            const answer = selectedAnswers[rqid];
            const dataItem = {
              rqid: rqid,
              crid: crid,
              subCatId: id, // You can set the correct value for crid
              brand_id: selectedValue, // Use the selected brand value
              value: answer,
              user_id: userId, // Use the retrieved userId dynamically
            };
            dataArray.push(dataItem);
          }
        }
        const ApiUrl = `${BASE_URL}${'/report/addAnswer'}`;
        // Send a POST request to the API
        fetch(ApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dataArray }),
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle the response from the API as needed
            console.log('API Response:', data);

            // Check if the API request was successful
            if (data.errorCode === "1") {
              // Navigate to the "UploadCampImages" screen on success
              navigation.navigate("UploadCampImages", { crid, id });
              console.log('forworded crid', crid);

            } else {
              // Handle any other logic or display an error message
              console.error('API Request was not successful');
              // You can also display an error message to the user
            }
            // After successfully submitting data, you can navigate to the next screen
          })
          .catch((error) => {
            console.error('Error submitting data:', error);
          });
      } else {
        console.error('Invalid or missing data in AsyncStorage');
      }
    })
    .catch((error) => {
      console.error('Error retrieving data:', error);
    });
};


  useEffect(() => {
    // Fetch questions from the API
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

//       console.log('questions:', questions);
// console.log('selectedAnswers:', selectedAnswers);
  }, [questions, selectedAnswers,id]);

  const handleAnswerChange = (rqid, answer) => {
    setSelectedAnswers({ ...selectedAnswers, [rqid]: answer });
  };

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
          label={`Answer for ${question.question}`}
          value={selectedAnswers[question.rqid] || ''}
          onChangeText={(text) => handleAnswerChange(question.rqid, text)}
          mode="outlined"
          style={styles.input}
          outlineColor='#0054a4'
          activeOutlineColor='#08a5d8'
          keyboardType="numeric"
        />
      </View>
    ));
  };
  useEffect(() => {
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
  }, [id]);
  
  const handleCampDateChange = (event, selectedDate) => {
    setShowCampDatePicker(false);
    if (selectedDate) {
      setCampDate(selectedDate);
    }
  };
  const showCampDate = () => {
    setShowCampDatePicker(true);
  };
 
  return (
    <ScrollView>
        <View style={styles.container}>
      <View style={styles.form}>
  <View style={styles.pickcontainer}>
  <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
          >
            <Picker.Item label="Select Brand" value="option1" />
            {brandOptions.map((brand) => (
              <Picker.Item key={brand.basic_id} label={brand.description} value={brand.basic_id.toString()} />
            ))}
          </Picker>
        </View>

        {renderQuestions()}

        <Button
        buttonColor='#0054a4'
          mode="contained"
          // onPress={()=> navigation.navigate("UploadCampImages")}
          onPress={submitData}
          style={styles.button}
        >
          Next
        </Button>
      </View>
    </View>
    </ScrollView>
  
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
});

export default UpdateCampData;
