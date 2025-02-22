import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
      <nav>
        <ul>
          <li><Link to="/rentals">Qera</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home; 