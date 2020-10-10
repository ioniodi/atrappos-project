import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Logo } from "./Logo";
import { logoutUser } from "../../services/authService";
import PropTypes from "prop-types";
import {ChangePwToast} from "../ui/ChangePwToast";
import {toastDelay} from "../../lib/constants";

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toast: {
        show: false,
        type: null,
        msg: ''
      }
    }
    this.showMsgToast = this.showMsgToast.bind(this);
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };


  showMsgToast(show, type, msg) {
    this.setState({
      toast: {
        show: show,
        type: type,
        msg: msg
      }
    })
  }

  componentDidMount() {
    if (this.props.location && this.props.location.state && this.props.location.state.from === "resetPw") {
      this.showMsgToast(true, 'success', 'The password has changed successfully!');
      setTimeout(() => {
        this.props.history.push('/home');
      }, toastDelay);
    }
  }
  render() {

    return (
      <div className="container landing">
        <div className="row">
          <div className="col-lg-12 center-align">
            <Logo place="landing"/>
              {this.props.auth.isAuthenticated ?
                  <React.Fragment>
                    <div className="col-md-12  landing--col">
                      <div className="welcome-user">
                        {"Hello, " + this.props.auth.user.name + "!"}<br/>
                        Welcome to Atr<b>app</b>os Mobile, a simple crowdsourcing mapmaking app!
                      </div>
                    </div>
                    <div className="col-md-6  landing--col">
                      <Link
                          to="/location"
                          className="btn auth--btn">
                          Walk in!
                      </Link>
                    </div>
                    <div className="col-md-6 col-lg-6 landing--col">
                      <Link
                          to="/change/password"
                          className="btn auth--btn">
                          Change password
                      </Link>
                    </div>
                    <div className="col-md-6 col-lg-6 landing--col">
                      <button className="logout--btn" onClick={this.onLogoutClick}>
                        Logout
                      </button>
                    </div>
                  </React.Fragment>:
                  <React.Fragment>
                  <div className="col-md-6  landing--col">
                    <Link
                      to="/register"
                      className="btn auth--btn">
                      Register
                    </Link>
                  </div>
                  <div className="col-md-6 col-lg-6 landing--col">
                    <Link
                      to="/login"
                      className="btn auth--btn">
                      Log In
                    </Link>
                  </div>
              </React.Fragment>}
          </div>
        </div>
        <ChangePwToast showMsgToast={this.showMsgToast} toastObj={this.state.toast} />
      </div>
    );
  }
}

Landing.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Landing);
