import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsArrowUp, BsArrowDown, BsArrowDownUp } from "react-icons/bs";
import * as XLSX from 'xlsx';

interface UserProblemStatusProps {}

interface UserMap {
    [userName: string]: string[];
}

interface Problem {
    problemId: string;
    link?: string;
}

const UserProblemStatus: React.FC<UserProblemStatusProps> = () => {
    const [problems, setProblems] = useState<string[]>([]);
    const [userStatus, setUserStatus] = useState<UserMap>({});
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');

    useEffect(() => {
        const fetchProblemsAndUsers = async () => {
            try {
                const problemsResponse = await axios.get('/api/problems');
                const problemsData: Problem[] = problemsResponse.data;

                setProblems(problemsData.map(problem => problem.problemId));

                const userResponse = await axios.get('/api/users/ok-submissions');
                setUserStatus(userResponse.data);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchProblemsAndUsers();
    }, []);

    const getUserSolvedCounts = () => {
        return Object.keys(userStatus).map(user => {
            const solvedCount = problems.filter(problem => userStatus[user].includes(problem)).length;
            return { user, solvedCount };
        });
    };

    const handleSort = () => {
        if (sortOrder === 'asc') {
            setSortOrder('desc');
        } else if (sortOrder === 'desc') {
            setSortOrder('none');
        } else {
            setSortOrder('asc');
        }
    };

    const userSolvedCounts = getUserSolvedCounts();

    const sortedUsers = userSolvedCounts.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.solvedCount - b.solvedCount;
        } else if (sortOrder === 'desc') {
            return b.solvedCount - a.solvedCount;
        }
        return 0;
    });

    // Function to download the data as an Excel file
    const downloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(sortedUsers.map(({ user, solvedCount }) => ({
            User: user,
            ...problems.reduce((acc, problem) => {
                acc[problem] = userStatus[user]?.includes(problem) ? '✔️' : '❌';
                return acc;
            }, {} as Record<string, string>), // Define the accumulator to be of type Record<string, string>
            'Total Solved': solvedCount
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'User Problem Status');
        XLSX.writeFile(wb, 'User_Problem_Status.xlsx');
    };

    return (
        <div>
            <h1>User Problem Solving Status</h1>
            <button onClick={handleSort}>
                Sort by Total Solved {sortOrder === 'asc' ? <BsArrowUp /> : sortOrder === 'desc' ? <BsArrowDown /> : <BsArrowDownUp />}
            </button>
            <button onClick={downloadExcel} style={{ marginLeft: '10px' }}>
                Download as Excel
            </button>
            {loading ? (
                <p>Loading data...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            {problems.map((problem, index) => (
                                <th key={index}>{problem}</th>
                            ))}
                            <th>Total Solved</th>
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
            )}
        </div>
    );
};

export default UserProblemStatus;
