import "./Students.css";

import TopNavbar from "../../components/TopNavbar";
import StudentTable from "../../components/StudentTable";
import "../../styles/PageHero.css"
import { use, useEffect, useState } from "react";
import { getStudents } from "../../services/collegeService";

export default function Students(){
 const [students, setStudents] = useState([]);
 const [loading,setLoading]=useState(true);

 useEffect(() => {

    const fetchStudents = async () => {

        try {

            const response = await getStudents();

            setStudents(response.data.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    fetchStudents();

}, []);

if(loading){
    return<h2>Loading...</h2>
}

    return(

        <div className="students-page">

            
            <TopNavbar/>
            

            <section className="page-hero">

                <div className="page-hero-overlay">
                    <p className="page-tag">
                    Student Management
                    </p>


                    <h1>
                        Students
                    </h1>


                    <p className="page-description">
                        Manage students and their digital credentials.
                    </p>
                </div>
                
                <StudentTable students={students}/>

            </section>



            


        </div>

    );

}