const helpers = {
    convertMinutes: function(mins) {
        var hours = (mins / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return {
            hr: rhours,
            min: rminutes,
        }
    }
}

export default helpers