import React from 'react';
import './history.css'; 
import { FaChrome } from 'react-icons/fa';

const HistoryComponent = () => {
  const data = [
    { name: 'John Doejhsgdfjsghinvhiudshfviuhdsuhvnklhdlkvhdklmhbviu', feature: 'Feature 1jksbdfsbkkufglKUGFdkdkjbhfkudhsfhgiudshfncdiushiuonfghdiouhgoidunhfvxivhgibvkjxbdclkjxdbdlk', result: 'Pass' },
    { name: 'Jane Smith', feature: 'Feature 2', result: 'Fail' },
    { name: 'Mark Wilson', feature: 'Feature 3', result: 'Pass' },
    { name: 'Emily Davis', feature: 'Feature 4', result: 'Fail' },
    { name: 'Jane Smith', feature: 'Feature 2', result: 'Fail' },
    { name: 'Mark Wilson', feature: 'Feature 3', result: 'Pass' },
    { name: 'Emily Davis', feature: 'Feature 4', result: 'Fail' },
    
  ];

  return (
    <div className="container">
      <h1>HISTORY</h1>
      <div className="data-list">
        {data.map((item, index) => (
          <div className="data-item" key={index}>
            <div className="data-content">
            <span className="icon">
              <FaChrome size={20} />
            </span>
              <span data-tooltip="This is a really long text that will show in the tooltip." className="data-name">{item.name}</span>
              <button className="data-feature-button">{item.feature}</button>
              <span className={`data-result ${item.result.toLowerCase()}`}>
                {item.result}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryComponent;
