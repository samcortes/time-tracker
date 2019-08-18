import React, {Component} from 'react';

class TimeRecord extends Component {

    render() {
        return (
            <div>
                {this.props.timeIn}
                {/* {this.props.timeOut} */}
            </div>
        )
    }
}

export default TimeRecord