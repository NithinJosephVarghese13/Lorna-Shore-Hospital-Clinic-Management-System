import { SERVER_PATH } from "./config"
import Session from '../tools/SessionCtrl'

const title = (method) => {
    let form_title = method === 'POST' ? "Save" :
        method === 'PATCH' ? "Update" : "Delete"
    let message = method === 'POST' ? "Saved" :
        method === 'PATCH' ? "Updated" : "Deleted"
    let submit_title = method === 'POST' ? "Save this record ?" :
        method === 'PATCH' ? "Update this record ?" : "Delete this record ?"
    return [form_title, submit_title, message]
}

const getDataFromURL = async (path, pos = 1) => {
    let p = window.location.href.split('/')
    p = path + p[p.length - pos]
    let data = await fetch(SERVER_PATH + p)
    data = await data.json()
    return [data, p]
}

const getURLId = (pos = 1) => {
    let p = window.location.href.split('/')
    return p[p.length - pos]
}
const getObj = (t, path) =>
    path.split(".").reduce((r, k) => r?.[k], t)

const toDate = (dt) => {
    dt = new Date(dt)
    let d = dt.getDate()
    let m = dt.getMonth() + 1
    let y = dt.getFullYear()
    if (d < 10) d = '0' + d
    if (m < 10) m = '0' + m
    return `${y}-${m}-${d}`
}
const dateStr = (d) => {
    return new Date(d).toDateString()
}
const getUserType = () => {
    return Session.getVals().utype
}
export { title, getDataFromURL, getObj, toDate, getURLId, getUserType, dateStr }