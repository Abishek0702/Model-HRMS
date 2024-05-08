const ConfirmEmployees = (props) => {
    const confromemp = props?.conformemp
    const dash = confromemp && confromemp.upcoming_confirmation_employees
    return ( 
        <div class=" table-responsive ">
                <table class="table table-borderless ">
                     <thead className=" fw-bold border-bottom bg-light">
                         <tr>
                         <th> </th>
                             <th>Name</th>
                             <th>EmployeeID</th>
                             <th>JoiningDate</th>

                         </tr>
                     </thead>
                     {dash && dash.map(user =>
                         <tbody className="" >


                             <tr>
                                 <td className="" >
                                      {user.gender == "Female" && <img src="/pngtree-women.png" className="" alt="Women logo" height="30" width="30" />}{user.gender == "Male" && <img src="/man.png" className="" alt="men logo" height="30" width="30" />}  
                                  </td>
                                  <td className="" >
                                        {user.name }
                                  </td>
                                  <td   className="text-small">{user.employeeID }</td>
                                  <td  className="">{user.date_of_joining}</td>

                             </tr>



                         </tbody>
                     )}
                 </table>
                 </div>
            
    )
}
export default ConfirmEmployees;
