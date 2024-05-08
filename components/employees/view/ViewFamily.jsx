import { useState, useEffect } from "react";
import { Layout } from '..';
import { alertService, userService } from 'services';
import moment from "moment";
import { useRouter } from "next/router";
import { FamilyLayoutCard } from "./FamilyLayoutCard";
export { ViewFamily };

function ViewFamily(props) {

    // const [state, setState] = useState({});
    // const [users, setUsers] = useState(null);
    const [familDetails, setFamilyDetails] = useState(null);
    const [sibilings, setSibilings] = useState(null);
    const [childrens, setChildrens] = useState(null);

    const router = useRouter()

    useEffect(() => {

        handleList(props.user_id);
        
    }, []);

    const handleList = (id) => {
        userService.getByFamilyId(id).then(x => {
            setFamilyDetails(x.post.familyDetails)
            setSibilings(x.post.siblings)
            setChildrens(x.post.childrens)
        });
    }

    function handleDelete(id) {
        const result = confirm('Are You Delete This User : ' + id);

        if (result) {
            userService.familyDelete(id).then(() => {
                alertService.success('User Deleted', { keepAfterRouteChange: true })
            })
                .catch(alertService.error);
            router.push('/employees')
        }
    }



    return (
        <>
         {familDetails?.length <= 0 && <table style={{width:"100%"}}><tr>
                                            <td colSpan="9" className="text-center">
                                                <div className="p-2">  Family Details Not Available  </div>
                                            </td>
                                        </tr></table> }
            {familDetails?.length > 0 && <div className="card1 p-0 shadow-none">

                <nav className="navbar  navbar-expand-lg shadow-none">
                    <span className="navbar-brand text-grey" > Family Details</span>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                        </ul>

                        <span style={{ color: "red" }}><i class="fas fa-phone px-2 text-danger"></i>Emergency Contact Details</span>

                    </div>
                </nav>
            </div>}


            <div class="container-fluid">
            
                <div class="row family">
                    {familDetails && familDetails.map(user =>
                        <FamilyLayoutCard data={user} type={props?.type || 'employee'} handleDelete={handleDelete}/>
                    )}
                </div>
            </div>




            

            <div class="container-fluid">
            {sibilings?.length > 0 &&  <h5 class="mt-4 mb-2">Brothers/Sisters Details:</h5> }
                <div class="row family">
                    {sibilings && sibilings.map(user =>
                        <FamilyLayoutCard data={user} type={props?.type || 'employee'} handleDelete={handleDelete}/>
                    )}
                </div>
            </div>

           
            

            <div class="container-fluid">
            {childrens?.length > 0 &&  <h5 class="mt-4 mb-2">Childrens's Details:</h5> }
                <div class="row family">
                    {childrens && childrens.map(user =>
                        <FamilyLayoutCard data={user} type={props?.type || 'employee'} handleDelete={handleDelete}/>
                    )}
                </div>
            </div>
        </>
    );
}


