from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import Department, Student, StudentDetails, Teacher, TeacherDetails
from .serializers import (
    DepartmentSerializer, StudentSerializer, StudentDetailsSerializer,
    TeacherSerializer, TeacherDetailsSerializer
)

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    
class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer

    def get_queryset(self):
        department_id = self.request.query_params.get('department', None)
        if department_id:
            return Student.objects.filter(department_id=department_id)  # ✅ Fetch students only from this department
        return Student.objects.all()
    def destroy(self, request, *args, **kwargs):
        student = self.get_object()
        student.delete()
        return Response({"message": "Student deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class StudentDetailsViewSet(viewsets.ModelViewSet):
    queryset = StudentDetails.objects.all()
    serializer_class = StudentDetailsSerializer

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

    def get_queryset(self):
        """Filter teachers by department if provided in request"""
        department_id = self.request.query_params.get('department', None)
        if department_id:
            return Teacher.objects.filter(department_id=department_id)
        return super().get_queryset()


class TeacherDetailsViewSet(viewsets.ModelViewSet):
    queryset = TeacherDetails.objects.all()
    serializer_class = TeacherDetailsSerializer
