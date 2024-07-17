import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Import custom CSS
import { Loader } from './Loader';
import { Tooltip } from 'react-tooltip';

interface Submission {
  rating: number;
  problemId: string;
  problemName: string;
  submissionId: number;
  creationTimeSeconds: number;
  tags: string[];
}

interface User {
  name: string;
  codeforcesHandle: string;
  team: string;
  numberOfSubmissions: number;
  submissions: Submission[];
}

interface Problem {
  problemId: string;
  problemLink: string;
}

const UserDetails: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [teamData, setTeamData] = useState<{ [team: string]: { totalSubmissions: number, userSubmissions: { [user: string]: number } } }>({});
  const [totalSubmissions, setTotalSubmissions] = useState<number>(0);
  const [problemIds, setProblemIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_BACKEND_URI}/codeforces/user/all/distinctAccSubmissionsAfter18June`);
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    const fetchProblemIds = async () => {
      try {
        const response = await axios.get<Problem[]>(`${import.meta.env.VITE_REACT_BACKEND_URI}/codeforces/problems`);
        const ids = response.data.map(item => item.problemId);
        setProblemIds(ids);
      } catch (error) {
        console.error('Error fetching problem IDs:', error);
      }
    };

    fetchSubmissions().then(() => setLoading(false));
    fetchProblemIds();
  }, []);

  useEffect(() => {
    const teamDataMap: { [team: string]: { totalSubmissions: number, userSubmissions: { [user: string]: number } } } = {};
    let total = 0;

    users.forEach(user => {
      const filteredSubmissions = user.submissions.filter(sub => problemIds.includes(sub.problemId));
      const totalSubmissionsForUser = filteredSubmissions.length;

      total += totalSubmissionsForUser;

      if (user.team in teamDataMap) {
        teamDataMap[user.team].totalSubmissions += totalSubmissionsForUser;
        if (user.codeforcesHandle in teamDataMap[user.team].userSubmissions) {
          teamDataMap[user.team].userSubmissions[user.codeforcesHandle] += totalSubmissionsForUser;
        } else {
          teamDataMap[user.team].userSubmissions[user.codeforcesHandle] = totalSubmissionsForUser;
        }
      } else {
        teamDataMap[user.team] = {
          totalSubmissions: totalSubmissionsForUser,
          userSubmissions: {
            [user.codeforcesHandle]: totalSubmissionsForUser
          }
        };
      }
    });

    setTeamData(teamDataMap);
    setTotalSubmissions(total);
  }, [users, problemIds]);

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h2 className="head">Team-wise Performance</h2>
        <p className="lead text-secondary">For Scorable Problems <a id="not-clickable">◕‿‿◕ </a> </p>
        
        <Tooltip anchorSelect="#not-clickable" place='bottom' arrowColor='#f0ad4e' clickable={true} delayHide={800}style={{backgroundColor:'#41323d', color:"white", borderRadius: '13px', borderWidth:'3px', borderColor: 'white'}}> 
        Only submissions after 18th June have been counted for this leaderboard
        </Tooltip>
      </div>
      {loading ? (
        <Loader/>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {Object.entries(teamData).map(([team, data]) => (
            <div className="col" key={team}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-center text-secondary mb-3">Team {team}</h5>
                  <p className="card-text text-center text-muted mb-4">Total Submissions: {data.totalSubmissions}</p>
                  <ul className="list-group list-group-flush">
                    {Object.entries(data.userSubmissions).map(([user, count]) => (
                      <li className="list-group-item" key={user}>
                        {user}
                        <span className="badge rounded-pill">{count} solved</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="text-center mt-5">
        <p className="lead ">Total Successful Submissions Across Teams: {totalSubmissions}</p>
      </div>
    </div>
  );
};

export default UserDetails;