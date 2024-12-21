import { getObj } from "./FormMethodCtrl"
import { SERVER_PATH } from "./config"

const table = async (cols, path, editPath, deletePath) => {
    try {
        const response = await fetch(SERVER_PATH + path)
        const json = await response.json()
        console.log('Received JSON:', json);
        const dataArray = Array.isArray(json) ? json : 
                         json.data ? json.data :
                         json.prescriptions ? json.prescriptions : 
                         json.medicalrecords ? json.medicalrecords :
                         [];

        if (!dataArray || dataArray.length === 0) {
            return {
                data: <tr>
                    <td colSpan={cols.length + 2} style={{ textAlign: "center" }}>
                        No Records
                    </td>
                </tr>,
                message: ''
            }
        }

        // Rest of the code remains unchanged
        const data = dataArray.map((v, k) => {
            return (
                <tr key={k}>
                    {
                        cols.map((v1, k1) => (
                            <td key={k1} className="title-case">
                                {
                                    v1.endsWith('date') ?
                                        new Date(getObj(v, v1)).toDateString() :
                                        getObj(v, v1)
                                }
                            </td>
                        ))
                    }
                    <td>
                        <a className="btn btn-danger btn-sm" href={deletePath + "/" + v._id}>Delete</a>
                    </td>
                    <td>
                        <a className="btn btn-warning btn-sm" href={editPath + "/" + v._id}>Edit</a>
                    </td>
                </tr>
            )
        })
        return { message: '', data: data }
    } catch (error) {
        console.error('Table Error:', error)
        return {
            data: <tr>
                <td colSpan={cols.length + 2} style={{ textAlign: "center" }}>
                    Server Issue
                </td>
            </tr>,
            message: 'Server Issue'
        }
    }
}

export default table