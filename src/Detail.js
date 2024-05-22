import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LoadingScreen from './LoadingScreen';

const renderItinerary = (text) => {
    const formattedText = text.replace(/\*\*/g, "").replace(/\*/g, "");
    const dayWiseItinerary = [];
    const lines = formattedText.split('\n');
    
    let currentDayDetails = [];
    let currentDayTitle = "";

    for (let i = 0; i < lines.length; i++){
        const line = lines[i].trim();

        if (line.startsWith("Day")) {
            if (currentDayDetails.length > 0){
                dayWiseItinerary.push({day: currentDayTitle, details: currentDayDetails});
            }
            currentDayTitle = line;
            currentDayDetails = [];
        } 
        else {
            currentDayDetails.push(
                <Text key = {i} style = {StyleSheet.itinerary}>
                    {line}
                </Text>
            );
        }
    }
    if (currentDayDetails.length > 0) {
        dayWiseItinerary.push({
            day: currentDayTitle,
            details: currentDayDetails
        });
    }
    return dayWiseItinerary.map((dayData, index) => (
        <View key={index} style={styles.dayContainer}>
            <Text style={styles.dayTitle}> {dayData.day} </Text>
            {dayData.details}
        </View>
    ));
}
const Detail = ({ route }) => {
    const navigation = useNavigation();
    const {itinerary, isLoading} = route.params;

    return(
        <SafeAreaView style = {styles.container}>
            {
                isLoading ? (
                    <LoadingScreen />
                ) : (
                    <>
                    <View style= {styles.headerContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                            <Icon name='arrow-back' size = {24} color='#fff' />
                        </TouchableOpacity>
                    </View>
                    <FlatList 
                        data = {renderItinerary(itinerary)}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => <View>{item}</View>}
                    />    
                    </>
                )
            }
        </SafeAreaView>
    )
};

export default Detail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        // paddingTop: Platform.OS === 'android' ? StatusBar.height : 0,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#FF6347',
        borderRadius: 10,
        height: 60,
        paddingHorizontal: 10,
    },
    backButton: {
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        paddingHorizontal: 10,
    },
    dayContainer: {
        color: '#333',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    dayTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    itinerary: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold'
    },
});