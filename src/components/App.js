import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink} from "react-router-dom";
import Calendar from './Calendar';

import 'font-awesome/css/font-awesome.min.css';
import '../App.scss';

class App extends Component {

    render() {
        return (
            <div>
                <div className="Background-overlay"></div>
                <div className="App-content">
                    <div className="App-header">
                        <p className="mb-0 mt-0">Daily Time Tracker</p>
                        <a href="https://www.samanthaio.com" className="nav-more">
                            more from sam&nbsp;
                            <i className="fa fa-angle-right"></i>
                        </a>
                    </div>
                    <Calendar />
                </div>
                <p className="App-copyright">Copyright © 2019 samcortes. All rights reserved.</p>
            </div>
        )
    }
}


export default App