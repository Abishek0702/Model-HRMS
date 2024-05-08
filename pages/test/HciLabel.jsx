import React, { useState } from 'react'
import Qrcode from "react-qr-code"
// import Print from "react-to-print"

import { useRef } from 'react'

const HciLabel = () => {

    // const refEl = useRef();

    const [label, setLabel] = useState(null);
    const [inlineEdit, setInlineEdit] = useState(0);
    const [data, setData] = useState([
        {
            id: 1,
            partno: "25414-Q6000",
            partname: "HOSE ASSY-RADIATOR UPR",
            parttype: "UPR",
            parbarcodecolor: "GREEN",
            scannedDetails: "P354T00",
            min: 15,
            max: 16
        },
        {
            id: 2,
            partno: "25414-Q6300",
            partname: "HOSE ASSY-RADIATOR UPR",
            parttype: "UPR",
            parbarcodecolor: "BLUE",
            scannedDetails: "P354T30",
            min: 15,
            max: 16
        },
        {
            id: 3,
            partno: "25414-Q6400",
            partname: "HOSE ASSY-RADIATOR UPR",
            parttype: "UPR",
            parbarcodecolor: "YELLOW",
            scannedDetails: "P354T40",
            min: 15,
            max: 16
        },
        {
            id: 4,
            partno: "25415-Q6500",
            partname: "HOSE ASSY-RADIATOR UPR",
            parttype: "UPR",
            parbarcodecolor: "PINK",
            scannedDetails: "P454T00",
            min: 15,
            max: 16
        },
    ])

    const change = (x) => {
        setLabel(x)
        setTimeout(() => {
            window.print()
        }, 1000)
    }

    // const scan = (x) => {
    //     const min = prompt("Enter your min measurement")
    //     if (!!min) {
    //         if (min <= x.max && min >= x.min) {
    //             alert("min pass", x.min)
    //         } else {
    //             alert("min fail", x.min)
    //         }
    //     }
    // }

    return (
        <div id='whole'>

            {/* <Print
                trigger={() => {

                    return <button href="#">Print this out!</button>;
                }}
                content={() => refEl}
            /> */}

            <div className='hci-label' id='label'>
                {label && <table className='border' style={{ backgroundColor: "red" }}>
                    <tbody>
                        <tr className='border'>
                            <td className='border text-center pt-2 pb-4'><Qrcode value='sad' size={60} /></td>
                            {/* <td className='border'><img src="qrCode.png" alt="Qr" width={"80"} /></td> */}
                            <td className='border pt-3' style={{ writingMode: 'vertical-rl', transform: "rotate(180deg)" }}>{label.parttype} </td>
                        </tr>
                        <tr className='border'>
                            <td className='border'>58731Q6000</td>
                            <td className='border' rowSpan={5} style={{ writingMode: 'vertical-rl', transform: "rotate(180deg)" }}>{label.partname}.12 </td>
                        </tr> <tr className='border'>
                            <td className='border'>{label.partno}</td>
                        </tr>
                        <tr className='border'>
                            <td className='border'>SU2I</td>
                        </tr>
                        <tr className='border'>
                            <td className='border'>OP ID : {label.scannedDetails}</td>
                        </tr>
                        <tr className='border'>
                            <td className='border'>Trace No : 013446</td>
                        </tr>
                    </tbody>
                </table>}
                {/* <button onClick={() => window.print()}>print</button> */}
            </div>

            <table className='table'>
                <thead>
                    <tr>
                        <th style={{ width: "auto" }}>partno</th>
                        <th style={{ width: "auto" }}>partname</th>
                        <th style={{ width: "auto" }}>parttype</th>
                        <th style={{ width: "auto" }}>parbarcodecolor</th>
                        <th style={{ width: "auto" }}>scannedDetails</th>
                        <th style={{ width: "auto" }}>min/max</th>
                        {/* <th style={{ width: "auto" }}>Scan</th> */}
                        <th style={{ width: "auto" }}>Action</th>
                        {/* <th style={{ width: "auto" }}>Edit</th> */}
                    </tr>
                </thead>
                <tbody>
                    {data.map(x => {
                        return (
                            <tr>
                                <td>{inlineEdit == x.id ? <input type="text" className='w-100' /> : x.partno}</td>
                                <td>{inlineEdit == x.id ? <input type="text" className='w-100' /> : x.partname}</td>
                                <td>{inlineEdit == x.id ? <input type="text" className='w-100' /> : x.parttype}</td>
                                <td>{inlineEdit == x.id ? <input type="text" className='w-100' /> : x.parbarcodecolor}</td>
                                <td>{inlineEdit == x.id ? <input type="text" className='w-100' /> : x.scannedDetails}</td>
                                <td>{inlineEdit == x.id ? <input type="text" className='w-100' /> : x.min / x.max}</td>
                                {/* <td>
                                    <button className='btn btn-sm btn-secondary' onClick={() => scan(x)}>Scan</button>
                                </td> */}
                                <td>
                                    <button className='btn btn-sm btn-secondary' onClick={() => change(x)}>Print</button>
                                </td>
                                {/* <td>

                                    {inlineEdit != x.id ?
                                        <div className='d-flex'>
                                            <button className='btn btn-sm btn-secondary mx-1' onClick={() => setInlineEdit(x.id)}>Edit</button>
                                            <button className='btn btn-sm btn-danger mx-1' >Delete</button>
                                        </div>

                                        : <div className='d-flex'>
                                            <button className='btn btn-sm btn-success mx-1'>Save</button>
                                            <button className='btn btn-sm btn-secondary mx-1' onClick={() => setInlineEdit(0)}>Cancel</button>
                                        </div>}
                                </td> */}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default HciLabel
