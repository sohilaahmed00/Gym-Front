import axios from 'axios';

const API_KEY = '4cfdaaaf4fmshdd5f0776afd487ep104c12jsn37e82322264b';

const exerciseOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
  }
};

export const fetchExercises = async (bodyPart) => {
  try {
    console.log('Starting to fetch exercises for:', bodyPart);
    console.log('Using API options:', exerciseOptions);
    
    const url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`;
    console.log('Fetching from URL:', url);
    
    const response = await axios.get(url, exerciseOptions);
    console.log('Received response:', response.status);
    console.log('Response data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    return [];
  }
};

export const fetchBodyParts = async () => {
  try {
    console.log('Starting to fetch body parts');
    console.log('Using API options:', exerciseOptions);
    
    const url = 'https://exercisedb.p.rapidapi.com/exercises/bodyPartList';
    console.log('Fetching from URL:', url);
    
    const response = await axios.get(url, exerciseOptions);
    console.log('Received response:', response.status);
    console.log('Body parts data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    return [];
  }
}; 