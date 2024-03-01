import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../pages/UserDetails.css'




const UserDetails = () => {
  const { username } = useParams(); // Get the username from the URL
  const [userDetails, setUserDetails] = useState(null);
  const [repos, setRepos] = useState([]);

  const [currentRepoPage, setCurrentRepoPage] = useState(1);
  const reposPerPage = 4;

const indexOfLastRepo = currentRepoPage * reposPerPage;
const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
const currentRepos = repos.slice(indexOfFirstRepo, indexOfLastRepo);

const navigate = useNavigate();

const handleGoBack = () => {
    navigate(-1); // Navigates back to the previous page
  };

  const truncateBio = (bio, maxLength) => {
    if (!bio) return "No Description"; // Handles null, undefined, or empty string
    return bio.length > maxLength ? bio.substring(0, maxLength) + "..." : bio;
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      const userResponse = await axios(`https://api.github.com/users/${username}`);
      setUserDetails(userResponse.data);

      const reposResponse = await axios(userResponse.data.repos_url);
      setRepos(reposResponse.data);
    };

    fetchUserData();
  }, [username]);


  if (!userDetails) return <div>Loading...</div>;

  return (

   <div style={{ padding: '3vh'}}>

    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
     <i className="material-icons" onClick={handleGoBack} style={{ cursor: 'pointer'  }}>arrow_back</i>

    <div style={{ display:'flex', justifyContent: 'space-between', gap:'25px', minHeight: '98vh'}}>
      <div className="user-details">
        <img src={userDetails.avatar_url} alt={username} className="user-avatar2" />
        <h1 className="user-name2">{userDetails.name}</h1>
        <p className="user-bio">{userDetails.bio}</p>
        <div className="user-stats">
          <p>Repositories: {userDetails.public_repos}</p>
          <p>Followers: {userDetails.followers}</p>
          <p>Following: {userDetails.following}</p>
        </div>
      </div>
      

<div>
    <div style={{marginTop: '-40px'}}>
        <h2>Repositories</h2>
        <div className="repo-container"> {/* Container for the repositories */}
            {currentRepos.map(repo => (
            <div key={repo.id} className="repo-item"> {/* Each repository item */}
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
                </a>
                <p>🌟 Stars: {repo.stargazers_count}</p>
                <p>🔧 Language: {repo.language || "Not Specified"}</p>
                <p>⚖️ License: {repo.license ? repo.license.name : "No License"}</p>
                <p>🕒 Last Updated: {new Date(repo.updated_at).toLocaleDateString()}</p>
                <p>{truncateBio(repo.description, 200)}</p>

            </div>
            ))}
  </div>
  </div>
    <div className="pagination">
        <button onClick={() => setCurrentRepoPage(currentRepoPage - 1)} disabled={currentRepoPage === 1}>
            Prev
        </button>
        {[...Array(Math.ceil(repos.length / reposPerPage)).keys()].map(number => (
            <button key={number} onClick={() => setCurrentRepoPage(number + 1)}>
            {number + 1}
            </button>
        ))}
        <button onClick={() => setCurrentRepoPage(currentRepoPage + 1)} disabled={currentRepoPage === Math.ceil(repos.length / reposPerPage)}>
            Next
        </button>
        </div>
</div>

    </div>
</div>
  );
};

export default UserDetails;
