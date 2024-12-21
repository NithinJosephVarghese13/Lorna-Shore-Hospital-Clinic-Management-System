import { getObj } from "./FormMethodCtrl";
import { SERVER_PATH } from "./config";

const getSelect = async (path, name, dv, help = '', label = '') => {
    let data = await fetch(SERVER_PATH + path)
    data = await data.json()
    data = data.map((v, k) => <option key={k} value={v._id}>
        {
            typeof (name) === 'string' ?
                getObj(v, name) : name.map((v1, k1) => {
                    let vv = v1.split('.')
                    vv = vv[vv.length - 1]
                    let t = vv.endsWith('date') ?
                        new Date(getObj(v, v1)).toDateString() :
                        getObj(v, v1)
                    let s = `${vv}: ${t} | `
                    return s
                })
        } </option>)
    let lbl = label.split('.')
    lbl = lbl[lbl.length - 1]
    data = <select defaultValue={dv}
        placeholder={lbl} name={label}
        id={label} className="form-control title-case" required>
        <option value={""}>--Select--</option>
        {data}
    </select>

    data = <div className="row mt-2">
        <div className="col">
            <label htmlFor={label} className="title-case"> {lbl} </label>
            {data}
            <div className="form-text help float-end">{help}</div>
        </div>
    </div>
    return data
}
export default getSelect