const { SERVER_PATH } = require("./config")

const uploadFile = async (e, path, method) => {
    e.preventDefault()
    const formVals = new FormData(e.target)
    const reqOpt = {
        method: method,
        body: formVals
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

export default uploadFile