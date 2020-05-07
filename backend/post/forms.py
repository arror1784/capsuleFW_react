from django import forms

from .models import FilePrinting

class FilePrintingForm(forms.ModelForm):
    class Meta:
        model = FilePrinting
        fields = ['file']

#    def __init__(self, *args, **kwargs):
#        super(PostForm, self).__init__(*args, **kwargs)
#        self.fields['file'].required = False
