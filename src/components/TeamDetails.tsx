// src/components/TeamPerformance.tsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';

interface Submission {
  name: string;
  codeforcesHandle: string;
  numberOfSubmissions: number;
  team: string;
}

const TeamDetails: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);


  useEffect(() => {
    const getData = async () => {
      const data = await axios.get(`${import.meta.env.VITE_REACT_BACKEND_URI}/codeforces/user/all/distinctAccSubmissionsAfter18June`);
      setSubmissions(data.data.data);
    };
    getData();

    const renderLoader = async () => {
        await new Promise(resolve => setTimeout(resolve, 1800)); // Simulating 2 seconds delay
        setLoading(false); // Hide loader after 3 seconds
      };
      renderLoader();
    
  }, []);

  // Function to calculate team-wise performance metrics
  const calculateTeamPerformance = () => {
    const teamStats: { [key: string]: number } = {};

    submissions.forEach(submission => {
      const { team, numberOfSubmissions } = submission;
      if (teamStats[team]) {
        teamStats[team] += numberOfSubmissions;
      } else {
        teamStats[team] = numberOfSubmissions;
      }
    });

    return teamStats;
  };

  const teamPerformance = calculateTeamPerformance();

  if(loading)
  {
    return <Loader/>
  }

  return (
    <div className="container mt-5">
      <h2>Team-wise Performance</h2>
      <div className="row mt-3">
        {Object.keys(teamPerformance).map((team, index) => (
          <div key={index} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{team}</h5>
                <p className="card-text">Total Submissions: {teamPerformance[team]}</p>
                {/* Add more statistics as needed */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDetails;
