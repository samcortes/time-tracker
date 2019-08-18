import React, {Component} from 'react';
import Calendar from './Calendar';

class App extends Component {

    render() {
        return (
            <div>
                <header>Flexi 45 Time Tracker</header>
                <Calendar />
            </div>
        )
    }
}


export default App