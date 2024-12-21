import Session from "../tools/SessionCtrl"

const Logout = () => {
    Session.setVals({ uid: '', utype: '', name: '' })
    window.location.href = "/"
    return <></>
}
export default Logout