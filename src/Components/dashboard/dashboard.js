// src/App.js

import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import comparator from "../../utils/comparator";
import Modal from '../Modal/modal2';
import { buildKey, getFilteredData } from '../../lib/dataManipulator';

// Heap Initialization
const { Heap } = require('heap-js');

// Variable Declarations.
let MAX_SIZE = 100,
    RETRY_INTERVAL_TIME = 10000,
    oldTimeout = setTimeout,
    allTimeout = [];


function setTimoutNew(fn, timeout) {
  const id = oldTimeout(fn, timeout);
  allTimeout.push(id);
  return id;
}

class Dashboard extends Component {
  constructor(props) {
    super(props);

    /* Initialize Heap with custom comparator, max size */
    this.maxHeap = new Heap(comparator);
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

    // this.eventSource = new EventSource("http://tweet-service.herokuapp.com/stream");
    // this.getLatestTweets.then(e => console.log("Init Heap Updated"));
  }

  componentDidMount() {
    // this.eventSource.onmessage = e => {
    //   this.updateHeap(JSON.parse(e.data));
    // }
    this.getLatestTweets().then(e => {
      console.log("Finished Loading for the first Time!");
      this.retryTweetFetch();
    });

  }

  /* 
   * Async Component:
   * Logic to fetch latest tweets and then update Heap.
   * This returns a promise.
   */
  getLatestTweets() {
    let limit = MAX_SIZE;
    return new Promise((resolve, reject) => {
      let source = new EventSource('https://tweet-service.herokuapp.com/stream');
  
      source.onmessage = ({data}) => {
        if (limit-- > 0) {
          this.updateHeap(JSON.parse(data));
        } else {
          // resolve this promise once we have reached the specified limit
          resolve(this.maxHeap);
          source.close();
        }
      }
    });
  }

  /* 
   * This function is responsible for refetching tweets for RETRY_INTERVAL_TIME.
   * All the parameters are configurable.
   * The function fetches an increment of 100 tweets everytime it's pulled in!
   */

  retryTweetFetch() {
    MAX_SIZE += 100;

    setInterval(() => {
      this.getLatestTweets().then(e => {
        console.log("Fetching Subsequent Tweets for every 10 sec");
      });
    }, RETRY_INTERVAL_TIME);
  }

  /* 
   * Util responsible for updating Max-Heap on Front-end.
   */
  updateHeap(newData) {
    this.maxHeap.push(newData);
    const data = this.maxHeap.toArray();
    this.updateUI(data);
  }

  /* 
   * Render function that renders the data according to the Filter selected.
   * TODO: Need to implement clearFilter method!
   */
  updateUI(newData) {
    console.log("Updating UI: Filter", this.state.filterEnabled);
    if(!this.state.filterEnabled) {
      const setFN = () => this.setState({ data: newData })
      const setFn = this.debounce(setFN, 1000);
      setFn();
    } else {
      this.fetchFilteredData();
    }
  }

  /* 
   * Callback when Filter is selected.
   */
  onFilterSelected(filterData) {
    const key =  buildKey(filterData);
    const data = this.maxHeap.toArray();
    const result = getFilteredData(filterData, data, key);
    // this.clearAllTimeout();
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
    // this.eventSource.close();
    console.log("FilteredData", filterData);
    this.setState({data: filterData});
    // this.fetchFilteredData.bind(this)();
  }


  fetchFilteredData() {
    const filerData = this.state.filterData;
    this.onFilterSelected(filerData);
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

export default Dashboard;