import React from 'react';
import helpers from './helpers';

class DateList extends React.Component {

    constructor(props) {
        super(props)
        
        let timeIn = this.getTime("in-" + this.props.item)
        let timeOut = this.getTime("out-" + this.props.item)

        this.state = {
            in: timeIn,
            out: timeOut,
            displayIn: this.displayTime(timeIn),
            displayOut: this.displayTime(timeOut),
            setInClass: timeIn ? 'time-set' : '',
            setOutClass: timeOut ? 'time-set' : '',
            total: 0,
            rendered: this.getRendered(timeIn, timeOut),
        }
        this.setTimeIn = this.setTimeIn.bind(this)
        this.setTimeOut = this.setTimeOut.bind(this)
        this.removeTimeIn = this.removeTimeIn.bind(this)
        this.removeTimeOut = this.removeTimeOut.bind(this)

        this.getDiff(timeIn, timeOut)
    }

    removeTime(data) {
        localStorage.removeItem(data)
    }

    getTime(data) {
        return localStorage.getItem(data)
    }

    displayTime(time) {
        if (time) {
            return new Date(time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }
        return null
    }

    getRendered(timeIn, timeOut) {
        if (timeIn && !timeOut) {
            let diff = new Date() - new Date(timeIn)
            let totalMins = Math.round(diff / 60000)
            let time = helpers.makeMindReadable(totalMins);
            return time.hr + ":" + time.min;
        }
    }

    getDiff(timeIn, timeOut) {
        console.log('timeIn', timeIn)
        console.log('timeOut', timeOut)
        if (timeIn && timeOut) {
            var diff = new Date(timeOut) - new Date(timeIn)
            var totalMins = Math.round(diff / 60000)
            this.props.callbackTotalTime(totalMins)
        }
    }

    setTimeIn() {

        if (this.state.in) {
            return
        }

        let now = new Date()
        this.getDiff(now, this.state.out)
        localStorage.setItem("in-" + this.props.item, now)
        
        this.setState(prevState => {
            return {
                in: now,
                displayIn: this.displayTime(now),
                setInClass: 'time-set',
                rendered: this.getRendered(now)
            }
        })

    }

    setTimeOut() {

        if (this.state.out || !this.state.in) {
            return
        }

        let now = new Date()
        this.getDiff(this.state.in, now)
        localStorage.setItem("out-" + this.props.item, now)
        
        this.setState(prevState => {
            return {
                displayOut: this.displayTime(now),
                out: now,
                setOutClass: 'time-set',
                rendered: 0,
            }
        })

    }

    removeTimeIn() {
        this.removeTime("in-" + this.props.item)
        this.setState(prevState => {
            return {
                in: null,
                displayIn: null,
                setInClass: ''
            }
        })
    }

    removeTimeOut() {
        this.removeTime("out-" + this.props.item)
        this.setState(prevState => {
            return {
                displayOut: null,
                out: null,
                setOutClass: ''
            }
        })
    }
    
    render() {

        let rendered;

        if (this.state.rendered) {
            rendered = <p className="mt-0 mb-0 text-center label-rendered">rendered: {this.state.rendered}</p>
        } 

        return (
            <div className="flex-child">
                <p className="mt-0 text-center">{this.props.item}</p>
                <button className={"mb-10 btn-time-in-out " + this.state.setInClass} 
                        onClick={this.setTimeIn}
                        onDoubleClick={this.removeTimeIn}>
                        In {this.state.displayIn}
                </button>
                <button className={"mb-10 btn-time-in-out " + this.state.setOutClass} 
                        onClick={this.setTimeOut}
                        onDoubleClick={this.removeTimeOut}>
                        Out {this.state.displayOut}
                        {rendered}
                </button>
                
            </div>
        )
    }
}

export default DateList