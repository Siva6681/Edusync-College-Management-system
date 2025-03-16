import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class DepartmentsController extends Controller {
  @tracked isFormVisible = false;
  @tracked isModalVisible = false;
  // @tracked isTableVisible = false;
  @tracked isDepartmentTableVisible = false;
  @tracked departments = [];
  @tracked selectedDepartment = null;
  @tracked selectedDepartmentName = "";
  @tracked departmentStudents = [];
  @tracked departmentTeachers = [];
  @tracked department = {
    name: '',
    description: ''
  };

  @action
  showForm() {
    this.isFormVisible = true;
  }

  @action
  updateField(field, event) {
    this.department = { ...this.department, [field]: event.target.value };
  }

  @action
  async saveDepartment(event) {
  event.preventDefault(); 

  try {
    let response = await fetch('http://127.0.0.1:8000/api/departments/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.department)
    });

    let result = await response.json();

    if (response.ok) {
      alert('Department added successfully!');
      this.isFormVisible = false;
      this.department = { name: '', description: '' };
    } else if (response.status === 400 && result.name) {
      alert(`Error: Department "${this.department.name}" already exists!`);
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to add department. Please try again.');
  }
  }
   @action
  async fetchDepartments() {
    try {
      let response = await fetch('http://127.0.0.1:8000/api/departments/');
      let data = await response.json();
      this.departments = data;
      this.isDepartmentTableVisible = true; 
    } catch (error) {
      console.error('Error fetching departments:', error);
      alert('Failed to load departments.');
    }
  }

// Fetch Students & Teachers for Selected Department
  @action
  async fetchDepartmentDetails(departmentId, departmentName) {
    this.selectedDepartment = departmentId;
    this.selectedDepartmentName = departmentName;
    this.isModalVisible = true;

    try {
      // Fetch Students
      let studentResponse = await fetch(`http://127.0.0.1:8000/api/students/?department=${departmentId}`);
      let studentData = await studentResponse.json();
      this.departmentStudents = Array.isArray(studentData) ? studentData : [];
      console.log(`Students in ${departmentName}:`, this.departmentStudents);

      // Fetch Teachers
      let teacherResponse = await fetch(`http://127.0.0.1:8000/api/teachers/?department=${departmentId}`);
      let teacherData = await teacherResponse.json();
      this.departmentTeachers = Array.isArray(teacherData) ? teacherData : [];
      console.log(`Teachers in ${departmentName}:`, this.departmentTeachers);
      } catch (error) {
      console.error('Error fetching department details:', error);
      alert('Failed to load department data.');
    }
  }
  @action
  closeModal() {
    this.isModalVisible = false;
  }
}

