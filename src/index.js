import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import LoadingScreen from './LoadingScreen';
import Detail from './Detail';

const Home = () => {
    const { control, handleSubmit, formState: { errors }} = useForm();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = React.useState(false);


    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // const apiKey = process.env.GEMINI_API_KEY;
            const apiKey = 'AIzaSyCx3MefHEMw2MNfzB2fI2IvpBnWBGLirmg'
            const genAI = new GoogleGenerativeAI(apiKey);

            const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro-latest",
            });

            const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
            };

            const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            ];

            // async function run() {
            const chatSession = model.startChat({
                generationConfig,
                safetySettings,
                history: [
                ],
            });

            const prompt = `Name: ${data.name}
                            Starting place: ${data.startingPlace}
                            Destination: ${data.destination}
                            Duration: ${data.duration}
                            Budget: ${data.budget}
                            
                            Please provide a day-wise itinerary for visiting the famous and popular places, as well as locally famous places,
                            including why they are famous and what local fodd to try. Also, recommned hotels, how to reach them, and any cautions to
                            be taken care of. Please note that the budget does not include flights, trains, and hotels. 
                            The hotel and flight prices may vary, and the provided information is just an estimate.
                            `;

            const result = await chatSession.sendMessage(prompt);
            const response = result.response
            console.log(response.text());

            navigation.navigate('Detail', { itinerary: response.text() })
            // }
            // run();
        } 
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false)
            return;
        }
    };

    return(
        <View style = {styles.container}>
            {
                isLoading ? (
                    <LoadingScreen />
                ) : (
            <>
            <Text style={styles.heading}>
            AI Travel Itinerary Generator
            </Text>
            <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter your Name"   
                    placeholderTextColor="gray"
                />
                )}
                name="name"
                />
                {errors.name && <Text style={styles.error}>This is required</Text>}
                <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter Starting Place"
                    placeholderTextColor="gray"
                />
                )}
                name = "startingPlace"
                />
                {errors.name && <Text style={styles.error}>Starting Place is required</Text>}
                <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter your Destination"
                    placeholderTextColor="gray"
                />
                )}
                name="destination"
                />
                {errors.name && <Text style={styles.error}>Destination is required</Text>}
                <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter your Duration in Days"
                    placeholderTextColor="gray"
                />
                )}
                name="duration"
                />
                {errors.name && <Text style={styles.error}>Duration is required</Text>}
                <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter your Budget"
                    placeholderTextColor="gray"
                />
                )}
                name="budget"
                />
                {errors.name && <Text style={styles.error}>Budget is required</Text>}

                <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.button}>
                    <Text style = {styles.buttonText}>
                        Generate Itinerary
                    </Text>
                </TouchableOpacity>
            </>
                    
            )
            }
        </View>
    )
};

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 50,
        color: 'white',
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 7,
        paddingHorizontal: 10,
        fontSize: 15,
        borderRadius: 15,
        color: 'white',
    },
    error: {
        color: 'red',
        fontSize: 15,
        marginBottom: 10,

    },
    button: {
        backgroundColor: '#FF6347',
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        marginTop: 20,
      },
      buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
      }
})