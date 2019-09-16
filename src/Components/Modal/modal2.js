import React from 'react';
import SkyLight from 'react-skylight';
import Filter from "../FilterComponent/filter";
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Button } from 'reactstrap';
import './modal2.css';

class Modal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        filterData: ''
    };
  }

  onFilterChange(data) {
    console.log("INSIDE FILTER CHANGE!!", data);
    this.setState({ filterData: Object.assign({}, data)});
  }

  onSaveClick() {
    console.log("Save Clicked");
    this.props.onFilterSelected(this.state.filterData);
    this.simpleDialog.hide();
  }

  render() {
    return (
        <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">Twitter Live Filtering Service</NavbarBrand>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="https://github.com/rupeshdabbir">GitHub</NavLink>
              </NavItem>
            </Nav>
          <Button variant="outline-dark" onClick={() => this.simpleDialog.show()}>Add Filter</Button>
        </Navbar>
        <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title="Please make your filter criteria and click Save!">
            <Filter onFilterChange={this.onFilterChange.bind(this)} onFilterSelected={this.props.onFilterSelected} />
            <section className="footer">
                <Button onClick={this.onSaveClick.bind(this)}>Save</Button>
                <Button onClick={() => this.simpleDialog.hide()}>Close</Button>
            </section>
        </SkyLight>
      </div>
    )
  }
}

Modal.displayName = 'Modal';

export default Modal;