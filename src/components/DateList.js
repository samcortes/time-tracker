import React from 'react';
import helpers from './helpers';

class DateList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            in: null,
            out: null,
            displayIn: null,
            displayOut: null,
            setInClass: null,
            setOutClass: null,
            total: 0,
            rendered: null,
        }
        this.setTimeIn = this.setTimeIn.bind(this)
        this.setTimeOut = this.setTimeOut.bind(this)
        this.removeTimeIn = this.removeTimeIn.bind(this)
        this.removeTimeOut = this.removeTimeOut.bind(this)  
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

    updateTotalTime(timeIn, timeOut) {
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
        this.updateTotalTime(now, this.state.out)
        
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
        this.updateTotalTime(this.state.in, now)
        
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
        
        if (this.state.out) {
            return
        }
        
        this.setState(prevState => {
            return {
                in: null,
                displayIn: null,
                setInClass: ''
            }
        })
    }

    removeTimeOut() {
        // this.updateTotalTime(this.state.in, this.state.in)
        this.setState(prevState => {
            return {
                displayOut: null,
                out: null,
                setOutClass: '',
                rendered: this.getRendered(this.state.in, new Date()),
            }
        })
    }

    componentDidUpdate() {
        let data = JSON.parse(localStorage.getItem('time-record')) || {}

        data[this.props.item] = {}
        data[this.props.item]['in'] = this.state.in
        data[this.props.item]['out'] = this.state.out
    
        localStorage.setItem('time-record', JSON.stringify(data))
    }

    componentDidMount() {
        let stored = localStorage.getItem('time-record')
        if (stored) {
            let data = JSON.parse(stored)[this.props.item]
            if (data) {
                this.setState({
                    in: data.in,
                    out: data.out,
                    displayIn: this.displayTime(data.in),
                    displayOut: this.displayTime(data.out),
                    setInClass: data.in ? 'time-set' : '',
                    setOutClass: data.out ? 'time-set' : '',
                    rendered: this.getRendered(data.in, data.out),
                })
                this.updateTotalTime(data.in, data.out)
            }
        }
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