const { SERVER_PATH } = require("./config")

const formSubmit = async (e, fields, path, method = "POST") => {
    e.preventDefault()
    const formVals = new FormData(e.target)
    let vals = {}
    fields.forEach((v) => {
        vals[v] = formVals.get(v)
    })
    const reqOpt = {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vals)
    }
    let data = null
    try {
        const resp = await fetch(SERVER_PATH + path, reqOpt)
        data = await resp.json()
    } catch (error) {
        data = { message: error.toString() }
    }
    return data
}

export default formSubmit