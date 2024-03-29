import React, {Component} from 'react';
import DateList from './DateList';
import helpers from './helpers';

class Calendar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            week: this.getWeeks(),
            total: 0,
            totalHour: 0,
            totalMins: 0,
            reset: false,
            remainingHour: 0,
            remainingMins: 0,
            requiredMins: 45*60,
            reset: false,
            key: this.generateRandomKey(),
        }

        this.resetTracker = this.resetTracker.bind(this);
    }

    callbackTotalTime = (totalMins) => {
        this.setState(prevState => {
            let newTotal = prevState.total + totalMins
            let parsedTotal = helpers.convertMinutes(newTotal)
            let remaining = this.state.requiredMins - newTotal
            let parsedRemaning = helpers.convertMinutes(remaining)

            return {
                total: newTotal,
                totalHour: parsedTotal.hr,
                totalMins: parsedTotal.min,
                remainingHour: parsedRemaning.hr,
                remainingMins: parsedRemaning.min,
            }
        })
    }

    getWeeks() {
        let today = new Date;
        let week = [];
        for (let i = 1; i <= 5; i++) {
            let first = today.getDate() - today.getDay() + i ;
            let day = new Date(today.setDate(first)).toDateString().slice(0, 10)
            week.push(day);
        }
        return week;
    }

    resetTracker() {
        localStorage.removeItem('time-record')
        this.setState(prevState => {
            return {
                key: this.generateRandomKey(),
            }
        })
    }

    generateRandomKey() {
        return Math.random().toString(36).substr(2, 5)
    }

    render() {
        const daysList = this.state.week.map(item =>  <DateList callbackTotalTime={this.callbackTotalTime} key={this.state.key + "-" + item} item={item} />)
        return (
            <div className="calendar-container">
                <div className="flex-child total-time">
                    <p className="mt-0 mb-0">{this.state.totalHour}:{this.state.totalMins}</p>
                    <p className="mt-0 mb-0 label-total">total</p>
                    <p className="mt-0 mb-0 clock-remaining">{this.state.remainingHour}:{this.state.remainingMins}</p>
                    <p className="mt-0 mb-0 label-remaining">remaining</p>
                    <i className="fa fa-refresh btn-reset" aria-hidden="true" onClick={this.resetTracker}></i>
                </div>
                {daysList}
            </div>
        )
    }
}

export default Calendar