from rest_framework import serializers
from .models import Department, Student, StudentDetails, Teacher, TeacherDetails

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

    def validate(self, data):
        """ Ensure required fields are not empty """
        if not data.get('name'):
            raise serializers.ValidationError({"name": "This field is required."})
        if not data.get('roll_no'):
            raise serializers.ValidationError({"roll_no": "This field is required."})
        if not data.get('year'):
            raise serializers.ValidationError({"year": "A valid integer is required."})
        if not data.get('department'):
            raise serializers.ValidationError({"department": "This field may not be null."})
        return data
    
class StudentDetailsSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.name", read_only=True)
    student_roll_no = serializers.CharField(source="student.roll_no", read_only=True)

    class Meta:
        model = StudentDetails
        fields = ['id', 'student', 'student_roll_no', 'student_name', 'email', 'address_line_1', 'address_line_2']

class TeacherSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    class Meta:
        model = Teacher
        fields = '__all__'

class TeacherDetailsSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.name", read_only=True)
    employee_number = serializers.CharField(source="teacher.employee_number", read_only=True)
    department_name = serializers.CharField(source="teacher.department.name", read_only=True)

    class Meta:
        model = TeacherDetails
        fields = ['id', 'teacher', 'teacher_name', 'employee_number', 'department_name', 'phone_number', 'address_line_1', 'address_line_2']
