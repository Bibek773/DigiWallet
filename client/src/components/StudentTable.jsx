import "./StudentTable.css";


export default function StudentTable({students}){





    return(

        <div className="students-table-container">


            <table>


                <thead>

                    <tr>

                        <th>Name</th>

                        <th>Registration No.</th>

                        <th>Program</th>

                        <th>Email</th>

                        <th>Credentials</th>

                        <th>Status</th>

                        <th>Action</th>


                    </tr>

                </thead>

                    <tbody>

                        {students?.map((student) => (

                        <tr key={student._id}>

                        <td>{student.Name}</td>

                        <td>{student.RegistrationNumber}</td>

                        <td>{student.Faculty}</td>

                        <td>{student.email || student.Email}</td>

                        <td>{student.credentials || 0}</td>

                        <td>

                        <span
                        className={
                        student.accountStatus === "approved"
                        ? "status verified"
                        : "status pending"
                        }
                        >

                        {student.accountStatus}

                        </span>

                        </td>

                        <td>

                        <button className="view-btn">
                        View
                        </button>

                        </td>

                        </tr>

                        ))}

                    </tbody>

               


            </table>


        </div>

    );

}

/* later replace const students with data from API
with <StudentTable students={studentsFromAPI} /> */