import React, { useEffect, useState } from 'react';
import './GetAllProblems.css'; // Import the CSS file

interface Problem {
    link: string;
    problemId: string;
}

const ProblemsTable: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URI}/codeforces/getAllProblem`); // Ensure the API is running
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProblems(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    const downloadCsv = () => {
        const csvRows = [
            ['S.No', 'Link', 'Problem ID'], // Header
            ...problems.map((problem, index) => [index + 1, problem.link, problem.problemId]),
        ];

        const csvString = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'problems.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="table-container">
            <h1>Problems List</h1>
            {loading && <p className="loading">Loading...</p>}
            {error && <p className="error">Error: {error}</p>}
            {!loading && !error && (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Link</th>
                                <th>Problem ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {problems.map((problem, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <a href={problem.link} target="_blank" rel="noopener noreferrer">{problem.link}</a> 
                                    </td>
                                    <td>{problem.problemId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="download-btn" onClick={downloadCsv}>Download CSV</button>
                </>
            )}
        </div>
    );
};

export default ProblemsTable;
