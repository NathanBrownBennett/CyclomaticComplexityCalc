import mimetypes

class File:
    def __init__(self, file=None):
        self.file = file
        self.filename = file.filename

        # Authrized file extensions | Upload
        self.extensions = ['.py', '.java', '.c', '.cpp', '.cs', '.js']
    
    def __validate_name(self):
        return "." in self.filename and len(self.filename) > 2

    def __validate_extension(self):
        return "." + self.filename.split(".")[-1] in self.extensions
    
    def __validate_integrity(self):
        return True #mimetypes.guess_type(self.filename)[0] in self.extensions
    
    def validate_file(self):
        if not self.__validate_name():
            return [False, "File name could not be validated - Does not contain '.' or is less than 3 characters."]
        
        if not self.__validate_extension():
            return [False, "File extension is not authorised - Must be one of the following (" + ", ".join(self.extensions) + ")"]
        
        if not self.__validate_integrity():
            return [False, "File could not be verified - Please try again."]
        
        return [True, "Successfully verified file integrity"]