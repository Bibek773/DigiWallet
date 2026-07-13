import "./Students.css";

import TopNavbar from "../../components/TopNavbar";
import StudentTable from "../../components/StudentTable";
import "../../styles/PageHero.css"

export default function Students(){


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
                


            </section>



            <StudentTable/>


        </div>

    );

}