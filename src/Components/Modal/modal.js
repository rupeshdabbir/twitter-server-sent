import React from 'react';
import Modali, { useModali } from 'modali';
import './modal.css';
// import FilterControl from "react-filter-control";
// import { fields, filterValue } from "../FilterComponent/helper/data";
import Filter from "../FilterComponent/filter";

const App = () => {
  const [completeExample, toggleCompleteModal] = useModali({
    animated: true,
    title: 'Please make your filter criteria and click Save!',
    message: <Filter />,
    buttons: [
      <Modali.Button
        label="Cancel"
        isStyleCancel
        onClick={() => toggleCompleteModal()}
      />,
      <Modali.Button
        label="Save"
        isStyleDefault
        onClick={() => toggleCompleteModal('123')}
      />,
    ],
  });

  return (
    <div className="modal">
      <span className="welcomeText">Twitter Live Filtering Service</span>
      <button onClick={toggleCompleteModal}>
        Filter Tweets
      </button>
      <Modali.Modal {...completeExample} />
    </div>
  );
};

export default App;