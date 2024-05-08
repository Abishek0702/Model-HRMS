import moment from "moment"

const Birthdays = (props) => {

    const Birthday = props?.birthday
    const dash = Birthday && Birthday.upcoming_birthdays
    // console.log("fff",dash);



    function getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('en-US', {
            month: 'long',

        });
    }
    const handleDateFinder = (data) => {
        // console.log('data', data)
        const d = moment(data, "MM-DD").format("DD");
        return d;
    }
    return (
        <>
         
                     
                            <div class="table-responsive">
                                <table className="table mb-1  ver">
                                    {dash && dash.map(user =>
                                        <tr className="  align-items-center " >
                                            <td className=" " style={{ width: '10%' }}>  {user.gender == "Male" && <img className=' rounded-circle' src="/image.png" width="40" height="40" alt="User" />}
                                                {user.gender == "Female" && <img className=' rounded-circle' src="/women.png" width="40" height="40" alt="User" />} </td>
                                            <td className="  " style={{ width: '40%' }}>  {user.name}</td>
                                           
                                            <td className="  " style={{ width: '50%' }}> <i class="fas fa-birthday-cake text-warning mr-2"></i>  
                                             {/* {handleDateFinder(user.date)} th {getMonthName(user.month)} */}
 
                                             {moment(user.date_of_birth).format('MMMM , DD')}
                                             
                                             </td>
                                        </tr>
                                    )}
                                </table>
                            </div>
 
                 
        </>
    )

}
export default Birthdays;