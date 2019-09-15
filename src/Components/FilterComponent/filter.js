import React, { Component } from "react";
import FilterControl from "react-filter-control";
import { fields, filterValue, groups } from "./helper/data";

const stringifyFilterValue = filterValue =>
  JSON.stringify(filterValue, null, "  ");

class Filter extends Component {
    constructor(props) {
        super(props);
        this.props.onFilterChange(filterValue);
    }

    handleFilterValueChange(filterValue) {
        const resObj = JSON.parse(stringifyFilterValue(filterValue));
        console.log("After clicking", this.props);
        this.props.onFilterChange(resObj);
    }
    
    render() {
        return (
            <FilterControl
              filterValue={filterValue}
              fields={fields}
              groups={groups}
              onFilterValueChanged={this.handleFilterValueChange.bind(this)}
            />
          );
    }
}

export default Filter;