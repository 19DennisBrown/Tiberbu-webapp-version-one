from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ChatMessageSerializer
from .models import ChatMessage
# Create your views here.


@api_view(['POST'])
def create_chat_message(request):
    if request.method == 'POST':
        # passing request object
        serializer = ChatMessageSerializer(data = request.data, context  = {'request': request})
        
        if serializer.is_valid():
            serializer.save()
            
            return Response(serializer.data, status = status.HTTP_201_CREATED )

        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    
    
@api_view(['GET'])
def get_chat_messages(request, patient_id, physician_id):
    try:
        # Filtering messages
        chat_messages = ChatMessage.objects.filter(patient = patient_id, physician = physician_id).order_by('created_at')
        
        serializer = ChatMessageSerializer(chat_messages, many = True)
        
        return Response( serializer.data, status = status.HTTP_200_OK)
    
    except ChatMessage.DoesNotExist:
        return Response({'detail': 'No Chat Message Found for This conversation..!'}, status  = status.HTTP_404_NOT_FOUND)