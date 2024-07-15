import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BsArrowUp, BsArrowDown, BsArrowDownUp } from "react-icons/bs"; // Import icons from react-icons library
import './SubmissionTable.css'; // Import CSS for custom styling
import { Loader } from './Loader';
import { Tooltip } from 'react-tooltip';


interface Submission {
  name: string;
  codeforcesHandle: string;
  numberOfSubmissions: number;
  team: string;
}

const Leaderboard = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [sortBy, setSortBy] = useState<keyof Submission | null>(null);
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending' | null>(null);
  const [loading, setLoading] = useState<Boolean>(true);
  const [filterEnabled, setFilterEnabled] = useState(false); // State for filter toggle


  useEffect(() => {

    const renderLoader = async () => {
      await new Promise(resolve => setTimeout(resolve, 1800)); // Simulating 2 seconds delay
      setLoading(false); // Hide loader after 3 seconds
    };
    renderLoader();

    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_BACKEND_URI}/codeforces/user/all/distinctAccSubmissionsAfter18June`);
        const userData = response.data;
        console.log(userData.data);
        setSubmissions(userData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSort = (key: keyof Submission) => {
    if (key === sortBy) {
      // Toggle sort direction or reset if already sorted
      if (sortDirection === 'ascending') {
        setSortDirection('descending');
      } else if (sortDirection === 'descending') {
        setSortBy(null);
        setSortDirection(null);
      } else {
        setSortDirection('ascending');
      }
    } else {
      // Set new sort key and direction
      setSortBy(key);
      setSortDirection('ascending');
    }
  };

  const sortedSubmissions = React.useMemo(() => {
    let sortableItems = [...submissions];
    if (sortBy && sortDirection) {
      sortableItems.sort((a, b) => {
        if (sortDirection === 'ascending') {
          return a[sortBy] < b[sortBy] ? -1 : 1;
        } else {
          return a[sortBy] > b[sortBy] ? -1 : 1;
        }
      });
    }
    return sortableItems;
  }, [submissions, sortBy, sortDirection]);

  const filteredSubmissions = React.useMemo(() => {
    const filtered = filterEnabled
      ? sortedSubmissions.filter(submission => submission.team !== 'Global')
      : sortedSubmissions;
    return filtered.map((item, index) => ({ ...item, sno: index + 1 }));
  }, [sortedSubmissions, filterEnabled]);

  const getSortIcon = (key: keyof Submission) => {
    if (sortBy === key) {
      return sortDirection === 'ascending' ? <BsArrowUp /> : <BsArrowDown />;
    }
    return <BsArrowDownUp />;
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterEnabled(event.target.checked);
  };

  if(loading)
  {
    return <Loader/>
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mb-4">
        <div className="col-auto">
          <h2>Accepted Submissions</h2>
        </div>
        <div className="col-auto d-flex align-items-center">
          <a id="not-clickable">◕‿‿◕ </a>
          <Tooltip anchorSelect="#not-clickable"  arrowColor='#f0ad4e' clickable={true} delayHide={800}style={{backgroundColor:'#41323d', color:"white", borderRadius: '13px', borderWidth:'3px', borderColor: 'white'}}> 
            These are the submissions considered from 18
          </Tooltip>
          <div className="form-check form-switch ms-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="filterSwitch"
              checked={filterEnabled}
              onChange={handleToggleChange}
            />
            <label className="form-check-label" htmlFor="filterswitch">
              Exclude Global Teams
            </label>
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped custom-table">
          <thead className="thead-dark">
            <tr>
              <th>Sno</th>
              <th onClick={() => handleSort("name")}>
                Name <span className="sort-icon">{getSortIcon("name")}</span>
              </th>
              <th onClick={() => handleSort("codeforcesHandle")}>
                Codeforces Handle{" "}
                <span className="sort-icon">
                  {getSortIcon("codeforcesHandle")}
                </span>
              </th>
              <th onClick={() => handleSort("numberOfSubmissions")}>
                Submissions{" "}
                <span className="sort-icon">
                  {getSortIcon("numberOfSubmissions")}
                </span>
              </th>
              <th onClick={() => handleSort("team")}>
                Team <span className="sort-icon">{getSortIcon("team")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((submission, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "even-row" : "odd-row"}
              >
                <td>{submission.sno}</td>
                <td>{submission.name}</td>
                <td>
                  <a
                    className="text-black text-decoration-none"
                    href={
                      "https:codeforces.com/profile/" +
                      submission.codeforcesHandle
                    }
                    target="_blank"
                  >
                    {submission.codeforcesHandle}
                  </a>
                </td>
                <td>{submission.numberOfSubmissions}</td>
                <td>{submission.team}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
