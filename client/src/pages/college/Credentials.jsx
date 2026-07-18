import "./Credentials.css";
import "../../styles/PageHero.css";

import { useEffect, useState } from "react";

import {
    getCredentials,
    getStudents,
    getCollegeProfile,
    revokeCredential,
    issueCredential
} from "../../services/collegeService";

import {
    FaEye,
    FaDownload,
    FaBan,
    FaPlus
} from "react-icons/fa";

const initialIssueFormData = {
    studentName:"",
    examRoll:"",
    registrationNumber:"",
    semester:"",
    level:"Bachelor",
    faculty:"",
    program:"",
    collegeName:"",
    CGPA:"",
    studentId:"",
    email:"",
    batch:"",
    academicYear:"",
    grade:""
};

const optionalRegistrationValue = (value) => {
    const normalizedValue = typeof value === "string" ? value.trim() : "";

    return normalizedValue.toLowerCase() === "not provided"
        ? ""
        : normalizedValue;
};

const formatCredentialTimestamp = (timestamp) => {
    if (!timestamp || Number.isNaN(new Date(timestamp).getTime())) return "—";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    }).format(new Date(timestamp));
};

const getCredentialList = (payload) => {
    if (Array.isArray(payload?.credentials)) return payload.credentials;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
};

export default function Credentials() {

    const [credentials, setCredentials] = useState([]);
    const [verifiedStudents, setVerifiedStudents] = useState([]);
    const [collegeName, setCollegeName] = useState("");
    const [loading, setLoading] = useState(true);
    const [issuing, setIssuing] = useState(false);

    const [selectedCredential, setSelectedCredential] = useState(null);
    const [showIssueModal, setShowIssueModal] = useState(false);

    const [formData, setFormData] = useState(initialIssueFormData);
    const [isProgramAutoFilled, setIsProgramAutoFilled] = useState(false);
    const [isBatchAutoFilled, setIsBatchAutoFilled] = useState(false);

    const resetIssueForm = () => {
        setFormData(initialIssueFormData);
        setIsProgramAutoFilled(false);
        setIsBatchAutoFilled(false);
    };
    const openIssueModal = () => {
        resetIssueForm();
        setShowIssueModal(true);
    };
    const closeIssueModal = () => {
        setShowIssueModal(false);
        resetIssueForm();
    };
    const handleIssueModalBackdropClick = (event) => {
        if (event.target === event.currentTarget) closeIssueModal();
    };

    const fetchCredentials = async()=>{

        try{

            const res = await getCredentials();
            setCredentials(getCredentialList(res.data));

        }
        catch(error){

            console.log(error);

        }
        finally{

            setLoading(false);

        }

    };

    const fetchVerifiedStudents = async()=>{

        try{

            const response = await getStudents();
            const students = response.data.data || [];

            setVerifiedStudents(
                students.filter((student) => student.accountStatus === "approved")
            );

        }
        catch(error){

            console.log(error);

        }

    };

    const fetchCollegeName = async()=>{

        try{

            const response = await getCollegeProfile();
            const name = response.data.data?.collegeName || "";

            setCollegeName(name);
            setFormData((current) => current.studentId
                ? { ...current, collegeName:name }
                : current
            );

        }
        catch(error){

            console.log(error);

        }

    };

    useEffect(()=>{

        fetchCredentials();
        fetchVerifiedStudents();
        fetchCollegeName();

    },[]);

    

    const handleChange=(e)=>{

        const { name, value } = e.target;
        const cgpa = Number(value);
        const grade = !Number.isFinite(cgpa) ? "" : cgpa >= 3.6 ? "A+" : cgpa >= 3.2 ? "A" : cgpa >= 2.8 ? "B+" : cgpa >= 2.4 ? "B" : cgpa >= 2 ? "C+" : "C";

        setFormData((current) => ({
            ...current,
            [name]:value,
            ...(name === "CGPA" ? { grade } : {})
        }));

    };

    const handleStudentSelect = (e) => {

        const student = verifiedStudents.find(
            (item) => item._id === e.target.value
        );

        if(!student){
            setFormData((current) => ({
                ...current,
                studentId:"",
                studentName:"",
                examRoll:"",
                registrationNumber:"",
                faculty:"",
                program:"",
                batch:"",
                email:"",
                collegeName:""
            }));
            setIsProgramAutoFilled(false);
            setIsBatchAutoFilled(false);
            return;
        }

        const program = optionalRegistrationValue(student.Program || student.program);
        const batch = optionalRegistrationValue(student.Batch || student.batch);

        setIsProgramAutoFilled(Boolean(program));
        setIsBatchAutoFilled(Boolean(batch));

        setFormData((current) => ({
            ...current,
            studentId:student._id,
            studentName:student.Name || "",
            examRoll:student.RollNo || "",
            registrationNumber:student.RegistrationNumber || "",
            faculty:student.Faculty || "",
            collegeName:collegeName,
            program,
            batch,
            email:student.Email || student.email || ""
        }));

    };

    const handleIssue=async(e)=>{

        e.preventDefault();

        if(!formData.studentId){
            alert("Select a verified student before issuing a credential.");
            return;
        }

        try{

            setIssuing(true);

            await issueCredential(formData);

            alert("Credential Issued Successfully");

            closeIssueModal();

            fetchCredentials();

        }
        catch(error){

            alert(error.response?.data?.message);

        }
        finally{

            setIssuing(false);

        }

    };

    const handleRevoke=async(id)=>{

        if(!window.confirm("Revoke this credential?")) return;

        try{

            await revokeCredential(id);

            fetchCredentials();

        }
        catch(error){

            console.log(error);

        }

    };

    const downloadCredential=(credential)=>{

        const text=`
Student : ${credential.studentName}

Registration No : ${credential.registrationNumber}

Program : ${credential.program}

CGPA : ${credential.CGPA}

Status : ${credential.status}

Hash :
${credential.dataHash}
`;

        const blob=new Blob([text],{type:"text/plain"});

        const url=URL.createObjectURL(blob);

        const link=document.createElement("a");

        link.href=url;

        link.download=`${credential.studentName}.txt`;

        link.click();

    };

    if(loading){

        return <h2>Loading...</h2>

    }

    return(

<div className="credentials-page">

<section className="page-hero">

<div className="page-hero-overlay">

<p className="page-tag">
Credential Management
</p>

<h1>
Digital Credentials
</h1>

<p className="page-description">
Manage issued credentials securely.
</p>

<button
className="issue-btn"
onClick={openIssueModal}
>

<FaPlus/>

Issue Credential

</button>

</div>

</section>

<section className="credentials-table-container">

<table>

<thead>

<tr>

<th>Student</th>

<th>Program</th>

<th>CGPA</th>

<th>Issued On</th>

<th>Revoked On</th>

<th>Status</th>

<th>Action</th>

</tr>

</thead>

<tbody>

{
credentials.length>0?

credentials.map((credential)=>(

<tr key={credential.id || credential._id}>

<td>{credential.studentName}</td>

<td>{credential.program}</td>

<td>{credential.CGPA}</td>

<td>{formatCredentialTimestamp(credential.createdAt)}</td>

<td>{formatCredentialTimestamp(credential.revokedAt)}</td>

<td>

<span className={`status ${credential.status}`}>

{credential.status}

</span>

</td>

<td>

<div className="icon-actions">

<button

className="icon-btn view"

title="View"

onClick={()=>{

    console.log("Credential:",credential);
    setSelectedCredential(credential)}}

>

<FaEye/>

</button>

<button

className="icon-btn download"

title="Download"

onClick={()=>downloadCredential(credential)}

>

<FaDownload/>

</button>

{
credential.status!=="revoked" &&

<button

className="icon-btn delete"

title="Revoke"

onClick={()=>handleRevoke(credential.id||credential._id)}

>

<FaBan/>

</button>

}

</div>

</td>

</tr>

))

:

<tr>

<td colSpan="7">

No Credentials Found

</td>

</tr>

}

</tbody>

</table>

</section>

{
selectedCredential &&

<div className="student-modal-overlay">

<div className="student-modal credential-modal">

<button
className="close-modal"
onClick={()=>setSelectedCredential(null)}
>
×
</button>


<h2>Credential Details</h2>


<div className="credential-card">

<div className="detail-row">
<span>Student Name</span>
<strong>{selectedCredential.studentName}</strong>
</div>


<div className="detail-row">
<span>Exam Roll</span>
<strong>{selectedCredential.examRoll}</strong>
</div>


<div className="detail-row">
<span>Registration No</span>
<strong>{selectedCredential.registrationNumber}</strong>
</div>


<div className="detail-row">
<span>Program</span>
<strong>{selectedCredential.program}</strong>
</div>


<div className="detail-row">
<span>Semester</span>
<strong>{selectedCredential.semester}</strong>
</div>


<div className="detail-row">
<span>Faculty</span>
<strong>{selectedCredential.faculty}</strong>
</div>


<div className="detail-row">
<span>College</span>
<strong>{selectedCredential.collegeName}</strong>
</div>


<div className="detail-row">
<span>CGPA</span>
<strong>{selectedCredential.CGPA}</strong>
</div>


<div className="detail-row">
<span>Status</span>
<strong className="valid-status">
{selectedCredential.status}
</strong>
</div>

</div>


<details className="security-details">

<summary>
Security Information
</summary>


<p>
<strong>Key ID:</strong>
{selectedCredential.keyId}
</p>


<p>
<strong>Algorithm:</strong>
{selectedCredential.signatureAlgorithm}
</p>


<label>
Credential Hash
</label>

<textarea
readOnly
value={selectedCredential.dataHash}
/>


<label>
Digital Signature
</label>

<textarea
readOnly
value={selectedCredential.signature}
/>


</details>


</div>

</div>
}

{/* QR modal removed

×

*/}

{
showIssueModal &&

<div className="student-modal-overlay" onClick={handleIssueModalBackdropClick}>

<div className="student-modal issue-credential-modal">

<button

className="close-modal"

onClick={closeIssueModal}

>

×

</button>

<h2>Issue Credential</h2>

<form onSubmit={handleIssue} className="credential-issue-form">

<section className="issue-form-card">
<h3>Student Information</h3>

<select
name="studentId"
value={formData.studentId}
onChange={handleStudentSelect}
required
>
<option value="">Select Student roll</option>
{verifiedStudents.map((student)=>(
<option key={student._id} value={student._id}>
{student.RollNo} — {student.Name}
</option>
))}
</select>

<input name="studentName" placeholder="Student Name" value={formData.studentName} readOnly/>

<input name="studentId" placeholder="Student ID" value={formData.studentId} readOnly/>

<input name="program" placeholder="Program" value={formData.program} onChange={handleChange} readOnly={isProgramAutoFilled}/>

<input name="batch" placeholder="Batch" value={formData.batch} onChange={handleChange} readOnly={isBatchAutoFilled}/>

<input name="email" placeholder="Email" value={formData.email} readOnly/>

<input name="examRoll" placeholder="Exam Roll" value={formData.examRoll} readOnly/>

<input name="registrationNumber" placeholder="Registration Number" value={formData.registrationNumber} readOnly/>

<input name="faculty" placeholder="Faculty" value={formData.faculty} readOnly/>

<input name="collegeName" placeholder="College Name" value={formData.collegeName} readOnly/>

</section>

<section className="issue-form-card">
<h3>Academic Credential</h3>

<select name="semester" value={formData.semester} onChange={handleChange} required>
<option value="">Select semester</option>
{["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"].map((semester, index)=>(
<option key={semester} value={semester}>{index + 1}{index === 0 ? "st" : index === 1 ? "nd" : index === 2 ? "rd" : "th"} Semester</option>
))}
</select>

<select name="academicYear" value={formData.academicYear} onChange={handleChange} required>
<option value="">Select academic year</option>
{["2025/2026", "2026/2027", "2027/2028"].map((year)=><option key={year} value={year}>{year}</option>)}
</select>

<input name="CGPA" type="number" min="0" max="4" step="0.01" placeholder="CGPA (0.0 - 4.0)" value={formData.CGPA} onChange={handleChange} required/>

<input name="grade" placeholder="Grade" value={formData.grade} readOnly/>

</section>

<button className="submit-btn" disabled={issuing}>

{issuing ? "Issuing Credential..." : "Issue Credential"}

</button>

</form>

</div>

</div>

}

</div>

);

}
