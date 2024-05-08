import moment from "moment"
const Holidays = (props) => {

    const dashholiday = props?.holidays
    const dash = dashholiday && dashholiday.upcoming_holidays

    
    const handleDateFinder = (data) => {
        const d = moment(data, "MM-DD").format("DD");
        return d;
    }
    return (
 
                <>
                <div class=" table-responsive ">
<table class="table table-borderless ">

                    {dash && dash.map(user =><tbody className="" >


                                <tr >
                                    <td className=" " style={{ width: '50%' }}>{moment().month(user.month-1).format("MMM").toString()} {handleDateFinder(user.date)}, {user.day.slice(0,3)}</td>
                                    <td className="text-primary  fw-bold" style={{ width: '50%' }}>   {user.name}</td>
                                </tr> 
                             
                                </tbody>   )}


                            </table>
                            </div>

                </>
 
    )
}
export default Holidays;