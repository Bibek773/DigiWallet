import "./Credentials.css";

import { useEffect, useState } from "react";

import TopNavbar from "../../components/TopNavbar";
import "../../styles/PageHero.css";

import { getCredentials } from "../../services/collegeService";


export default function Credentials(){

    const [credentials, setCredentials] = useState([]);
    const [loading, setLoading] = useState(true);



    useEffect(()=>{

        const fetchCredentials = async()=>{

            try{

                const response = await getCredentials();

                setCredentials(response.data.data);

            }
            catch(error){

                console.log("Error fetching credentials:", error);

            }
            finally{

                setLoading(false);

            }

        };


        fetchCredentials();


    },[]);



    if(loading){

        return <h2>Loading credentials...</h2>;

    }



    return(

        <div className="credentials-page">


            <TopNavbar/>



            {/* Header */}

            <section className="page-hero">

                <div className="page-hero-overlay">


                    <p className="page-tag">
                        Credential Management
                    </p>


                    <h1>
                        Digital Credentials
                    </h1>


                    <p className="page-description">

                        Issue, manage and monitor verified
                        academic credentials of your students.

                    </p>


                </div>

            </section>





            {/* Credential Table */}

            <section className="credentials-table-container">


                <table>


                    <thead>

                        <tr>

                            <th>Student Name</th>

                            <th>Credential ID</th>

                            <th>Degree</th>

                            <th>Issued Date</th>

                            <th>Status</th>

                            <th>Action</th>


                        </tr>


                    </thead>




                    <tbody>


                    {
                        credentials?.map((credential)=>(


                            <tr key={credential._id}>


                                <td>

                                    {credential.studentName}

                                </td>



                                <td>

                                    {credential.keyId || credential._id}

                                </td>



                                <td>

                                    {credential.program}

                                </td>



                                <td>

                                    {
                                    new Date(
                                        credential.createdAt
                                    ).toLocaleDateString()
                                    }

                                </td>




                                <td>


                                    <span

                                    className={
                                        credential.status === "verified"
                                        ?
                                        "status verified"
                                        :
                                        "status pending"
                                    }

                                    >

                                        {credential.status}


                                    </span>


                                </td>




                                <td>


                                    <button className="view-btn">

                                        View

                                    </button>


                                </td>



                            </tr>


                        ))
                    }



                    </tbody>


                </table>


            </section>


        </div>

    );

}