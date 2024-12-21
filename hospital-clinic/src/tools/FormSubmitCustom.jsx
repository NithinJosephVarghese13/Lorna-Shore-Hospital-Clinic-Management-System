const { SERVER_PATH } = require("./config")

const formSubmitCustom = async (e, filter, populate, path,) => {
    e.preventDefault()
    const formVals = new FormData(e.target)
    let vals = {}
    filter.forEach((v) => {
        vals[v] = formVals.get(v)
    })
    let v = {
        filter: vals,
        populate: populate
    }
    const reqOpt = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v)
    }
    let data = null
    try {
        const resp = await fetch(SERVER_PATH + path, reqOpt)
        data = await resp.json()
        console.log("Response from server:", data)
    } catch (error) {
        data = { message: error.toString() }
    }
    return data
}

export default formSubmitCustom