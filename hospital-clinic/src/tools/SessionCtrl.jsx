var Session = (() => {
    var getVals = () => {
        if (localStorage.vals)
            return JSON.parse(localStorage.vals)
        return { uid: '', utype: '', name: '' }
    }
    var setVals = (v) => {
        localStorage.vals = JSON.stringify(v)
    }
    return {
        getVals: getVals,
        setVals: setVals
    }
})()
export default Session