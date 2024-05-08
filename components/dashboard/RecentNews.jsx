import moment from 'moment';
const RecentNews = (props) => {
    const events = props?.event
    const dash = events && events.recent_events
    
    return (

        
                <>
                    {dash && dash.map(user =>
 
                
                       
                        <div class=" table-responsive ">
                            <table className="table">
                                <tr className="" > 
                                    <td className=" " style={{ width: '25%' }}>
                                    <img className='mr-3 bg-danger' src={user.path} width="110" height="60" alt="logo" onError={(event) => event.currentTarget.src = '/imagedummy.png'} />
                                        
                                   </td>
                                    <td className="  " style={{ width: '75%' }}><span> <a href={user.link != '-' ? user.link : '#'} target={user.link != '-' ? '_blank' : '_self'} className=''>{user.title}</a></span>
                                    </td>
                                    <td> <span class="badge badge-info">{moment(user.created_at).fromNow()}</span></td>
                                    </tr>
                               
                            </table>
                        </div>
                    )}
                </>
 



    )
}
export default RecentNews 
