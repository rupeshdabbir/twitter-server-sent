// src/App.js

import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Dashboard from './Components/dashboard/dashboard';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <Dashboard />
      </div>
    );
  }
}

export default App;