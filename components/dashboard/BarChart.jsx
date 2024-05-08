// import { Plotly } from "plotly.js";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })



const BarChart = (props) => {
    const dashbar = props?.dashbar
    const dash = dashbar && dashbar
   

    return (
         
            <div className="  d-flex justify-content-center  " style={{minHeight: "300px" , height: "300px", maxHeight: "300px",maxWidth: "100%"}}>
           
            <Plot 
            data={dash}
           
                   
                    
                    layout={{
                        width:500,
                        height: 300,
                        autosize:true,
                    
                        margin: {
                            l: 50,
                            r: 50,
                            b: 50,
                            t: 50,
                            pad:4
                        },

                        legend: {
                            x:0.5,
                            y:5,
                            
                          },

                          barmode: 'group',
                          bargap:0.20,
                          bargroupgap: 0.2,
                        }
                    }
                    
                    
                    config={{
                        staticPlot: true,
                        useResizeHandler: true,
                        responsive: true
                    }}
                />

            </div>
        
    )
}
export default BarChart;
