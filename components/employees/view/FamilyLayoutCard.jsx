export const FamilyLayoutCard = (props) => {

    const user = props?.data
    const type = props?.type
    // alert(type)
    return (
        <>

            <div class={`col-xxl-4 col-lg-${type == 'admin' ? '6' : '4'} col-md-6 mb-3`}> {/*  */}
                <div class="card">
                    <div class="contain d-flex">
                        <div class="box1 d-flex"> {/*  */}
                            <p class="align-self-center rotate " >{user.relationtype.toUpperCase()}</p>  {/*  */}
                        </div>
                        <div class="box2 fw-bold p-3 pe-0 w-100">
                            <div className="bg-dange d-flex justify-content-between align-items-start"> {/*  */}
                                <h5 class="fs-6 mb-1 text-colur">{user.name}</h5>
                                {type == 'admin' && <i className="fas fa-trash text-danger" style={{ cursor: "pointer" }} onClick={() => props.handleDelete(user.id)}></i>}  {/*  */}
                            </div>
                            <table class="table table-border-none ">
                                <tr>
                                    <td className="text-dark text-small-10"><b>Contact</b> {user.emergencycontactperson == 1 && <i class="fas fa-phone px-2 text-danger"></i>}</td>
                                    <td className="text-dark text-small-10">:</td>
                                    <td className="text-colur text-small-10">
                                        <div className="d-flex justify-content-betwee align-items-center">
                                            {user.contactnumber}
                                           
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-dark text-small-10"><b>Occupation</b></td>
                                    <td className="text-dark text-small-10">:</td>
                                    <td className="text-colur text-small-10">{user.occupation}</td>
                                </tr>
                                <tr>
                                    <td className="text-dark text-small-10"><b>Working</b></td>
                                    <td className="text-dark text-small-10">:</td>
                                    <td className="text-colur text-small-10">{user.currentworkstatus}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}