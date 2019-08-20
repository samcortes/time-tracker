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
            intervalId: null,
            currentCount: 0,
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
                currentCount: new Date() - now
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
        this.setState(prevState => {
            return {
                displayOut: null,
                out: null,
                setOutClass: '',
                currentCount: 0,
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

    componentWillUnmount() {
        clearInterval(this.state.intervalId)
    }

    componentDidMount() {
        let stored = localStorage.getItem('time-record')
        var interval = setInterval(this.timer.bind(this), 1000)

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
                    currentCount: new Date() - new Date(data.in),
                    intervalId: interval
                })

                this.updateTotalTime(data.in, data.out)
            }
        }
    }

    timer() {
        if (this.state.currentCount) {
            let increment = this.state.currentCount + 1000
            let totalMins = Math.round(increment / 60000)
            let time = helpers.convertMinutes(totalMins)
            this.setState({currentCount: increment})
            this.setState({rendered: time.hr + ":" + time.min})
        }
    }
    
    render() {
        let rendered;

        if (this.state.rendered && !this.state.out) {
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