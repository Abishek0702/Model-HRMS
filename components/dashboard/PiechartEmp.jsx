// import { Plotly } from "plotly.js";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })



const PiechartEmp = (props) => {
    const dashpie = props?.dashpie
    const dash = dashpie
    // console.log("gggg", dash)




    return (
        <>
            {dash && dash.map(user =>
                 

                    <div className="  d-flex justify-content-center" style={{minHeight: "300px" , height: "300px", maxHeight: "250px",maxWidth: "100%"}}>


                        <Plot
                        data={dash}

                            // data={[{
                            //     values: user.values,
                            //     labels: user.labels,
                            //     type: 'pie',
                            //     hole: .7,
                            //     textposition: "outside",
                            //     textinfo: "label+value",
                            //     marker: {
                            //         colors: ["#bee6f6", "#03559f"]
                            //     },
                            // }]}

                            layout={{

                                height: 300,
                                width: 280,
                                margin: {
                                    l: 50,
                                    r: 50,
                                    b: 0,
                                    t: 0,
                                    pad: 4
                                },
                                useResizeHandler: true,
                                responsive: true,
                                legend: {
                                    x: 125,
                                    y: 0.70,

                                }

                            }}
                            config={{
                                staticPlot: true,
                                useResizeHandler: true,
                                responsive: true
                            }}
                        />
                   
                </div>
            )}
        </>

    )
}
export default PiechartEmp;
