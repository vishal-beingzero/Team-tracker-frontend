import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsArrowUp, BsArrowDown, BsArrowDownUp } from "react-icons/bs"; // Import sorting icons
import { Loader } from './Loader';

interface UserProblemStatusProps {}

interface UserMap {
    [userName: string]: string[];
}

interface Problem {
    problemId: string; // Expected field from the problems API response
    link?: string; // Optional, not used in this example
}

const UserProblemStatus: React.FC<UserProblemStatusProps> = () => {
    const [problems, setProblems] = useState<string[]>([]);
    const [userStatus, setUserStatus] = useState<UserMap>({});
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none'); // Sorting state
    

    useEffect(() => {
        const fetchProblemsAndUsers = async () => {
            try {
                // Fetch all problems - Adjust URL according to your API route
                const problemsResponse = await axios.get(`${import.meta.env.VITE_REACT_BACKEND_URI}/codeforces/getAllProblem`);
                const problemsData: Problem[] = problemsResponse.data;
                
                // Extract only problemIds from the response
                setProblems(problemsData.map(problem => problem.problemId));

                // Fetch users and their problem statuses
                const userResponse = await axios.get(`${import.meta.env.VITE_REACT_BACKEND_URI}/userProblemMap`);
                setUserStatus(userResponse.data);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchProblemsAndUsers();
    }, []);

    // Function to calculate solved counts and return an array for sorting
    const getUserSolvedCounts = () => {
        return Object.keys(userStatus).map(user => {
            const solvedCount = problems.filter(problem => userStatus[user].includes(problem)).length;
            return { user, solvedCount };
        });
    };

    // Handler to toggle sort order
    const handleSort = () => {
        if (sortOrder === 'asc') {
            setSortOrder('desc');
        } else if (sortOrder === 'desc') {
            setSortOrder('none');
        } else {
            setSortOrder('asc');
        }
    };

    // Get user solved counts
    const userSolvedCounts = getUserSolvedCounts();

    // Sort based on the sort order
    const sortedUsers = userSolvedCounts.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.solvedCount - b.solvedCount;
        } else if (sortOrder === 'desc') {
            return b.solvedCount - a.solvedCount;
        }
        return 0; // No sorting applied
    });

      if(loading)
      {
        return <Loader/>
      }

    return (
        <div>
        <div className="row justify-content-center my-4">
        <div className="col-auto">
          <h2>Accepted Submissions From Problems List</h2>
        </div>
        <div className="col-auto d-flex align-items-center">
          <a id="not-clickable">◕‿‿◕ </a>
        </div>
      </div>
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            {problems.map((problem, index) => (
                                <th key={index}>{problem}</th>
                            ))}
                            <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                                Total Solved  {sortOrder === 'asc' ? <BsArrowUp /> : sortOrder === 'desc' ? <BsArrowDown /> : <BsArrowDownUp />}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map(({ user, solvedCount }) => (
                            <tr key={user}>
                                <td>{user}</td>
                                {problems.map((problem, index) => (
                                    <td key={index}>
                                        {userStatus[user].includes(problem) ? '✔️' : '❌'}
                                    </td>
                                ))}
                                <td>{solvedCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    );
};

export default UserProblemStatus;
