// utils/fetchLinkedInData.ts
import axios from 'axios';

export const fetchLinkedInData = async (accessToken: string): Promise<string | JSON> => {
  try {
    // Fetch LinkedIn profile data
    const { data: profileData } = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Fetch LinkedIn professional experience summary
    const { data: experienceData } = await axios.get('https://api.linkedin.com/v2/positions', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Process the data as per your requirement and return
    const summary = {
      name: profileData.localizedFirstName + ' ' + profileData.localizedLastName,
      professionalExperience: experienceData, // Modify as per API response structure
    };

    return JSON.stringify(summary);
  } catch (error) {
    console.error('Error fetching LinkedIn data:', error);
    throw error;
  }
};
