import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class StudentsController extends Controller {
  @tracked isFormVisible = false;
  @tracked isTableVisible = false;
  @tracked isStudentFormVisible = false;
  @tracked isStudentDetailsFormVisible = false;
  @tracked isDepartmentListVisible = false;
  @tracked selectedDepartment = null;
  @tracked selectedDepartmentName = "";
  @tracked departments = [];
  @tracked departmentStudents = [];
  @tracked studentsByDepartment = [];
  @tracked students = [];
  @tracked studentDetails = [];
  @tracked student = {
    name: '',
    year: '',
    roll_no: '',
    department: ''
  };
  @tracked studentDetail = {
    student: '',
    email: '',
    address_line_1: '',
    address_line_2: ''
  };

  // Show Add Student Form
  @action
  async showStudentForm() {
    this.isStudentFormVisible = true;

    // Fetch departments
    try {
      let response = await fetch('http://127.0.0.1:8000/api/departments/');
      let data = await response.json();
      this.departments = data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      alert('Failed to load department list.');
    }
  }
  @action
  closeStudentForm() {
    this.isStudentFormVisible = false;
  }
  // @action
  // async fetchDepartments() {
  //   try {
  //     let response = await fetch('http://127.0.0.1:8000/api/departments/');
  //     let data = await response.json();
  //     this.departments = data;
  //     this.isDepartmentListVisible = true;
  //     console.log("Departments fetched:", this.departments);
  //   } catch (error) {
  //     console.error('Error fetching departments:', error);
  //     alert('Failed to load departments.');
  //   }
  // }

  // // Fetch Students Based on Selected Department
  // @action
  // async fetchStudentsByDepartment(departmentId, departmentName) {
  //   this.selectedDepartment = departmentId;
  //   this.selectedDepartmentName = departmentName;

  //   try {
  //     let response = await fetch(`http://127.0.0.1:8000/api/students/?department=${departmentId}`);
  //     let data = await response.json();

  //     if (Array.isArray(data)) {
  //       this.departmentStudents = data;
  //       console.log(`Students in ${departmentName}:`, this.departmentStudents);  // ✅ Debugging output
  //     } else {
  //       console.error("Unexpected API response:", data);
  //       alert("Error: API did not return expected data.");
  //     }
  //   } catch (error) {
  //     console.error('Error fetching students:', error);
  //     alert('Failed to load students.');
  //   }
  // }


// Update Form Fields for Students
  @action
  updateStudentField(field, event) {
    this.student = { ...this.student, [field]: event.target.value };
  }

// Update Student Details Form Fields
@action
updateStudentDetailsField(field, event) {
  this.studentDetail = { ...this.studentDetail, [field]: event.target.value };
}
  @action
  async deleteStudent(studentId) {
    if (!confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      let response = await fetch(`http://127.0.0.1:8000/api/students/${studentId}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        alert('Student deleted successfully!');
        this.departmentStudents = this.departmentStudents.filter(student => student.id !== studentId);  // ✅ Remove from UI
      } else {
        let errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student.');
    }
  }

  @action
  async saveStudentAndDetails(event) {
  event.preventDefault();

  // ✅ Validate student fields before sending request
  if (!this.student.name || !this.student.roll_no || !this.student.year || !this.student.department) {
    alert("Please fill in all student details before saving.");
    return;
  }
  this.student.name = this.student.name.trim();
  this.student.roll_no = this.student.roll_no.trim();
  this.student.year = this.student.year.toString().trim();
  this.student.department = this.student.department.toString().trim();
  try {
    // 1️⃣ Save Student First
    let studentResponse = await fetch('http://127.0.0.1:8000/api/students/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.student)
    });

    let studentData = await studentResponse.json();
    console.log("Student Response:", studentData);  // ✅ Debugging Output

    if (!studentResponse.ok) {
      throw new Error(studentData.error || JSON.stringify(studentData));  // ✅ Show actual error
    }

    // 2️⃣ Save Student Details with Student ID
    let studentId = studentData.id; // Get saved student's ID
    let studentDetailResponse = await fetch('http://127.0.0.1:8000/api/student_details/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        student: studentId,  // Link student detail to student ID
        email: this.studentDetail.email,
        address_line_1: this.studentDetail.address_line_1,
        address_line_2: this.studentDetail.address_line_2
      })
    });

    let studentDetailData = await studentDetailResponse.json();
    console.log("Student Details Response:", studentDetailData);  // ✅ Debugging Output

    if (!studentDetailResponse.ok) {
      throw new Error(studentDetailData.error || JSON.stringify(studentDetailData));
    }

    alert('Student & Details added successfully!');
    this.isStudentFormVisible = false;
    this.student = { name: '', roll_no: '', year: '', department: '' };
    this.studentDetail = { student: '', email: '', address_line_1: '', address_line_2: '' };

  } catch (error) {
    console.error('Error:', error);
    alert("Failed to save student: " + error.message);
  }
}
// Fetch Departments & Students When Route Loads
  async init() {
    super.init();
    await this.fetchStudentsByDepartment();
  }

  // Fetch Students Grouped by Department
  @action
  async fetchStudentsByDepartment() {
    try {
      // Fetch Departments
      let deptResponse = await fetch('http://127.0.0.1:8000/api/departments/');
      let departments = await deptResponse.json();

      // Fetch Students
      let studentResponse = await fetch('http://127.0.0.1:8000/api/students/');
      let students = await studentResponse.json();

      // Group Students by Department
      this.studentsByDepartment = departments.map(dept => {
        return {
          id: dept.id,
          name: dept.name,
          students: students.filter(student => student.department === dept.id)
        };
      });

      console.log("Grouped Students:", this.studentsByDepartment);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to load students.');
    }
  }
}
