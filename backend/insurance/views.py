from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import File
from .serializers import FileSerializer



class FileListCreateView(generics.ListCreateAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    parser_class = ( MultiPartParser, FormParser)
    
    
    def create(self, request, *args, **kwargs):
        insurance_company = request.data.get('insurance_company', '')
        file_name = request.data.get('file_name', 'insurance policy')
        file  = request.data.get('file')
        
        # validate
        if not file:
            return Response( { "error": "Not a valid file"}, status = status.HTTP_400_BAD_REQUEST)
        
        # file instance
        file_instance  = File(
            user = request.user,
            insurance_company = insurance_company,    
            file_name = file_name,
            file = file        
        )
        file_instance.save()
        
        # serialize and response
        serializer = self.get_serializer( file_instance)
        return Response( serializer.data, status = status.HTTP_201_CREATED)
        
        
# LIST OF ALL INSURANCE FILES
class FileListView(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user_id  = self.kwargs['user_id']
        return File.objects.filter(user_id = user_id)
    
# DETAILED VIEW OF ONE FILE
class FileDetailView(APIView):
    def get(self, request, fileId, *args, **kwargs):
        try:
            uploaded_file = File.objects.get(id = fileId)
            serializer = FileSerializer( uploaded_file)
            return Response( serializer.data, status = status.HTTP_200_OK)
        except File.DoesNotExist:
            return Response(
                {"error": "Insurance not found"}, status = status.HTTP_404_NOT_FOUND
            )
# FILE DELETE VIEW
class FileDeleteView(generics.DestroyAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        if instance.user != request.user:
            return Response(
                {"error": "You do not have permission to delete this file."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        self.perform_destroy(instance)
        return Response(
            {"message": "File successfully deleted."},
            status=status.HTTP_204_NO_CONTENT
        )

            
            
