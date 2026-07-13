import "./StudentTable.css";


export default function StudentTable(){


    const students = [

        {
            id:1,
            name:"Ram Sharma",
            reg:"2023001",
            program:"BCA",
            email:"ram@gmail.com",
            credentials:5,
            status:"Verified"
        },

        {
            id:2,
            name:"Sita Thapa",
            reg:"2023002",
            program:"BBA",
            email:"sita@gmail.com",
            credentials:3,
            status:"Pending"
        },

        {
            id:3,
            name:"Hari Karki",
            reg:"2023003",
            program:"BIM",
            email:"hari@gmail.com",
            credentials:7,
            status:"Verified"
        }

    ];



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


                    {
                        students.map((student)=>(


                            <tr key={student.id}>


                                <td>
                                    {student.name}
                                </td>


                                <td>
                                    {student.reg}
                                </td>


                                <td>
                                    {student.program}
                                </td>


                                <td>
                                    {student.email}
                                </td>


                                <td>
                                    {student.credentials}
                                </td>


                                <td>

                                    <span 
                                    className={
                                        student.status==="Verified"
                                        ?
                                        "status verified"
                                        :
                                        "status pending"
                                    }
                                    >

                                        {student.status}

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


        </div>

    );

}

/* later replace const students with data from API
with <StudentTable students={studentsFromAPI} /> */