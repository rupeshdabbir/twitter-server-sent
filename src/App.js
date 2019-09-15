// src/App.js

import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { getSampleData } from "./mocks/getSampleData";
import comparator from "./utils/comparator";
import Modal from './Components/Modal/modal2';
import { buildKey, getFilteredData } from './lib/dataManipulator';

// Heap Initialization
const { Heap } = require('heap-js');
const MAX_SIZE = 100;
const oldTimeout = setTimeout;
let allTimeout = [];

function setTimoutNew(fn, timeout) {
  const id = oldTimeout(fn, timeout);
  allTimeout.push(id);
  return id;
}

class App extends Component {
  constructor(props) {
    super(props);

    /* Initialize Heap with custom comparator, max size */
    this.maxHeap = new Heap(comparator);
    this.maxHeap.limit = MAX_SIZE;
    this.maxHeap.init([]);

    this.state = {
      data: this.maxHeap.toArray(),
      filterEnabled: false,
      filterData: {}
    };

    this.columns = [
      {
        Header: "Tweet",
        accessor: "tweet"
      },
      {
        Header: "User",
        accessor: "user"
      },
      {
        Header: "Retweet Count",
        accessor: "retweet_count"
      },
      {
        Header: "Created At",
        accessor: "created_at"
      },
      {
        Header: "Verified",
        accessor: "verified"
      },
      {
        Header: "Language",
        accessor: "lang"
      }
    ];

    this.eventSource = new EventSource("http://tweet-service.herokuapp.com/stream");
  }

  componentDidMount() {
    this.eventSource.onmessage = e => {
      this.updateHeap(JSON.parse(e.data));
    }
  }

  updateHeap(newData) {
    this.maxHeap.push(newData);
    const data = this.maxHeap.toArray();
    this.updateUI(data);
  }

  updateUI(newData) {
    console.log("Updating UI: Filter", this.state.filterEnabled);
    if(!this.state.filterEnabled) {
      const setFN = () => this.setState({ data: newData })
      const setFn = this.debounce(setFN, 3000);
      setFn();
    }
  }

  onFilterSelected(filterData) {
    const key =  buildKey(filterData);
    const data = this.maxHeap.toArray();
    const result = getFilteredData(filterData, data, key);
    this.clearAllTimeout();
    console.log("Filter Results ::::", result);

    // Enable Filter State.
    this.setState({ 
      filterEnabled: true, 
      filterData: Object.assign({}, filterData)
    });

    // Stop the event source && Update Filter on UI.
    this.updateFiltersOnUI(result);
  }

  updateFiltersOnUI(filterData) {
    this.eventSource.close();
    console.log("FilteredData", filterData);
    this.setState({data: filterData});
  }

  setTimoutNew(fn, timeout) {
    const id = oldTimeout(fn, timeout);
    allTimeout.push(id);
    return id;
  }

  clearAllTimeout() {
    allTimeout.forEach(each => clearTimeout(each));
    allTimeout = [];
  }

  debounce(fn, timer) {
    let id;
    return function(...args) {
      clearTimeout(id);
      id = setTimoutNew(() => {
        fn(...args);
      }, timer);
    }
  }

  render() {
    return (
      <div className="App">
        <Modal onFilterSelected={this.onFilterSelected.bind(this)} />
        <ReactTable data={this.state.data} columns={this.columns} />
      </div>
    );
  }
}

export default App;