/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import '../pages/SearchUsers.css'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Link } from 'react-router-dom';

const SearchUsers = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isVisible, setIsVisible] = useState(false); // New state to manage list visibility

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

 const indexOfLastItem = currentPage * itemsPerPage;
 const indexOfFirstItem = indexOfLastItem - itemsPerPage;
 const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);


  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(users.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }


  const handleSearch = async (e) => {
    e.preventDefault();
    setIsVisible(true);
    try {
      const result = await axios(`https://api.github.com/search/users?q=${query}`);
      setUsers(result.data.items);
      setCurrentPage(1); // Reset to page 1 on new search
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsVisible(false);
    }
  };
  

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value === '') {
      setIsVisible(false); // Trigger the opacity transition
      // Delay clearing the users list to allow the transition to complete
      setTimeout(() => setUsers([]), 150); // Match this delay to your transition duration
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10vh' }}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search GitHub Users"
          value={query}
          onChange={handleChange}
          style={{ padding: '10px', fontSize: '16px', width: '400px', borderRadius: "25px" }}
        />
        <button type="submit" style={{ padding: '12px', width: '15vh' , fontSize: '16px', marginLeft: '10px' }}>Search</button>
      </form>

  <div className="list-container"> {/* New wrapper for centering */}
      <TransitionGroup component={null}>
        {currentItems.map((user) => ( // Use currentItems here instead of users
        <CSSTransition
          key={user.id}
          timeout={500} // Duration of the transition
          classNames="fade" // Prefix for the transition classes
        >
        <Link  to={`/user/${user.login}`} key={user.id} className="user-item">
        <div className="user-item">
          <img src={user.avatar_url} alt={user.login} className="user-avatar" />
          <div className="user-info">
            <div className="user-name">{user.login}</div>
            <div className="user-type">{user.type}</div>
          </div>
        </div>
      </Link>
      </CSSTransition>
    ))}
    </TransitionGroup>
  </div>

      {users.length > itemsPerPage && (
      <div className="pagination">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        {pageNumbers.map(number => (
          <button key={number} onClick={() => setCurrentPage(number)}>
            {number}
          </button>
        ))}
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= Math.ceil(users.length / itemsPerPage)}>
          Next
        </button>
      </div>
      )}
</div>
  );
};

export default SearchUsers;
