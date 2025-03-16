from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()

    def __str__(self):
        return self.name

class Student(models.Model):
    name = models.CharField(max_length=100)
    roll_no = models.CharField(max_length=20, unique=True)  # ✅ roll_no is inside Student
    year = models.IntegerField()
    department = models.ForeignKey('Department', on_delete=models.CASCADE)


    def __str__(self):
        return f"{self.name} ({self.roll_no})"

class StudentDetails(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE)  # ✅ Reference Student
    email = models.EmailField()
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Details of {self.student.name}"

class Teacher(models.Model):
    name = models.CharField(max_length=100)
    employee_number = models.CharField(max_length=20, unique=True)
    department= models.ForeignKey(Department, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} ({self.employee_number})"

class TeacherDetails(models.Model):
    teacher = models.OneToOneField(Teacher, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, unique=True)
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Details of {self.teacher.name}"
