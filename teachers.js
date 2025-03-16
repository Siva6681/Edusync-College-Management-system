import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TeachersController extends Controller {
  @tracked isTeacherFormVisible = false;
  @tracked isTeacherDetailsFormVisible = false;
  @tracked isDepartmentListVisible = false;
  @tracked isTeacherDetailsTableVisible = false;
  @tracked selectedDepartment = null;
  @tracked selectedDepartmentName = "";
  @tracked departmentTeachers = [];
  @tracked teachersByDepartment = [];
  @tracked departments = [];
  @tracked teachers = [];
  @tracked teacher = { name: '', employee_number: '', department: '' };
  @tracked teacherDetails = { teacher: '', phone_number: '', address_line_1: '', address_line_2: '' };

  // Show Add Teacher Form
@action
async showTeacherForm() {
    this.isTeacherFormVisible = true;

    // Fetch departments for the dropdown
    try {
      let response = await fetch('http://127.0.0.1:8000/api/departments/');
      let data = await response.json();
      this.departments = data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      alert('Failed to load department list.');
    }
  }

  // // Show Add Teacher Details Form
  // @action
  // async showTeacherDetailsForm() {
  //   this.isTeacherDetailsFormVisible = true;

  //   // Fetch teachers for the dropdown
  //   try {
  //     let response = await fetch('http://127.0.0.1:8000/api/teachers/');
  //     let data = await response.json();
  //     this.teachers = data;
  //   } catch (error) {
  //     console.error('Error fetching teachers:', error);
  //     alert('Failed to load teacher list.');
  //   }
  // }

  // Update Teacher Fields
  @action
  updateTeacherField(field, event) {
    this.teacher = { ...this.teacher, [field]: event.target.value };
  }

  // Update Teacher Details Fields
  @action
  updateTeacherDetailsField(field, event) {
    this.teacherDetails = { ...this.teacherDetails, [field]: event.target.value };
  }

  // Close Teacher Form
  @action
  closeTeacherForm() {
    this.isTeacherFormVisible = false;
  }

  // Save Teacher & Teacher Details
  @action
  async saveTeacherAndDetails(event) {
    event.preventDefault();

    try {
      // 1️⃣ Save Teacher First
      let teacherResponse = await fetch('http://127.0.0.1:8000/api/teachers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.teacher)
      });

      let teacherData = await teacherResponse.json();
      console.log("Teacher Response:", teacherData);  // ✅ Debugging Output

      if (!teacherResponse.ok) {
        throw new Error(teacherData.error || JSON.stringify(teacherData));
      }

      // 2️⃣ Save Teacher Details with Teacher ID
      let teacherId = teacherData.id; // Get saved teacher's ID
      let teacherDetailResponse = await fetch('http://127.0.0.1:8000/api/teacher_details/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teacher: teacherId,  // Link teacher detail to teacher ID
          phone_number: this.teacherDetails.phone_number,
          address_line_1: this.teacherDetails.address_line_1,
          address_line_2: this.teacherDetails.address_line_2
        })
      });

      let teacherDetailData = await teacherDetailResponse.json();
      console.log("Teacher Details Response:", teacherDetailData);  // ✅ Debugging Output

      if (!teacherDetailResponse.ok) {
        throw new Error(teacherDetailData.error || JSON.stringify(teacherDetailData));
      }

      alert('Teacher & Details added successfully!');
      this.isTeacherFormVisible = false;
      this.teacher = { name: '', employee_number: '', department: '' };
      this.teacherDetails = { teacher: '', phone_number: '', address_line_1: '', address_line_2: '' };

    } catch (error) {
      console.error('Error:', error);
      alert("Failed to save teacher: " + error.message);
    }
  }
  // @action
  // async fetchDepartments() {
  //   try {
  //     let response = await fetch('http://127.0.0.1:8000/api/departments/');
  //     let data = await response.json();
  //     this.departments = data;
  //     this.isDepartmentListVisible = true;
  //     console.log("Departments fetched:", this.departments);  // ✅ Debugging Output
  //   } catch (error) {
  //     console.error('Error fetching departments:', error);
  //     alert('Failed to load departments.');
  //   }
  // }

   // Fetch Departments & Teachers When Route Loads
  async init() {
    super.init();
    await this.fetchTeachersByDepartment();
  }

  // Fetch Teachers Grouped by Department
  @action
  async fetchTeachersByDepartment() {
    try {
      // Fetch Departments
      let deptResponse = await fetch('http://127.0.0.1:8000/api/departments/');
      let departments = await deptResponse.json();

      // Fetch Teachers
      let teacherResponse = await fetch('http://127.0.0.1:8000/api/teachers/');
      let teachers = await teacherResponse.json();

      // Group Teachers by Department
      this.teachersByDepartment = departments.map(dept => {
        return {
          id: dept.id,
          name: dept.name,
          teachers: teachers.filter(teacher => teacher.department === dept.id)
        };
      });

      console.log("Grouped Teachers:", this.teachersByDepartment);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      alert('Failed to load teachers.');
    }
  }

  // Delete Teacher by ID
  @action
  async deleteTeacher(teacherId) {
    if (!confirm("Are you sure you want to delete this teacher?")) {
      return;
    }

    try {
      let response = await fetch(`http://127.0.0.1:8000/api/teachers/${teacherId}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        alert('Teacher deleted successfully!');
        this.departmentTeachers = this.departmentTeachers.filter(teacher => teacher.id !== teacherId);  // ✅ Remove from UI
      } else {
        let errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
      alert('Failed to delete teacher.');
    }
  }
}
