import axios from 'axios';
import { BaseUrl } from 'BaseUrl';



//todo ==> GET Education data BY jobseekerProfileId
export const getname = async (jobSeekerId,headers) => {
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/jobseekerprofile/v1/getJobSeekerProfileByJobSeekerId/${jobSeekerId}`,
      headers: headers
    });
  };