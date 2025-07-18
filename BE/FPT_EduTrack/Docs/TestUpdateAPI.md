# Test Update API Documentation

## Overview
The Test Update API allows you to update existing tests with comprehensive file management capabilities. You can update test metadata, add new files, remove existing files, or replace all files.

## API Endpoints

### 1. Update Test
**PUT** `/api/test/{id}`

**Content-Type:** `multipart/form-data`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | int | Yes | Test ID (URL parameter) |
| `Id` | int | Yes | Test ID (form field, must match URL parameter) |
| `Code` | string | No | Test code |
| `Title` | string | No | Test title |
| `Content` | string | No | Test content/description |
| `StudentId` | int | No | Student ID |
| `ExamId` | int | No | Exam ID |
| `NewFiles` | IFormFile[] | No | New files to upload (.doc, .docx, .pdf, .txt, max 10MB each) |
| `FilesToRemove` | string[] | No | Array of file public IDs to remove |
| `KeepExistingFiles` | bool | No | Keep existing files (default: true) |

#### Example Requests

##### 1. Update test metadata only
```javascript
const formData = new FormData();
formData.append('Id', '123');
formData.append('Title', 'Updated Test Title');
formData.append('Content', 'Updated test description');
formData.append('StudentId', '456');

fetch('/api/test/123', {
    method: 'PUT',
    body: formData
});
```

##### 2. Add new files while keeping existing ones
```javascript
const formData = new FormData();
formData.append('Id', '123');
formData.append('Title', 'Test with New Files');
formData.append('KeepExistingFiles', 'true');

// Add new files
formData.append('NewFiles', fileInput1.files[0]);
formData.append('NewFiles', fileInput2.files[0]);

fetch('/api/test/123', {
    method: 'PUT',
    body: formData
});
```

##### 3. Remove specific files
```javascript
const formData = new FormData();
formData.append('Id', '123');
formData.append('FilesToRemove', 'test-documents/abc123_document1');
formData.append('FilesToRemove', 'test-documents/def456_document2');

fetch('/api/test/123', {
    method: 'PUT',
    body: formData
});
```

##### 4. Replace all files with new ones
```javascript
const formData = new FormData();
formData.append('Id', '123');
formData.append('KeepExistingFiles', 'false');
formData.append('NewFiles', newFile1);
formData.append('NewFiles', newFile2);

fetch('/api/test/123', {
    method: 'PUT',
    body: formData
});
```

#### Response Format
```json
{
    "success": true,
    "message": "Test updated successfully",
    "data": {
        "success": true,
        "message": "Test updated successfully",
        "updatedTest": {
            "id": 123,
            "code": "TEST001",
            "title": "Updated Test Title",
            "content": "Updated test description",
            "studentId": 456,
            "examId": 789,
            // ... other test properties
        },
        "newFilesUploaded": [
            {
                "publicId": "test-documents/xyz789_newfile",
                "url": "https://res.cloudinary.com/..../test-documents/xyz789_newfile.pdf",
                "secureUrl": "https://res.cloudinary.com/..../test-documents/xyz789_newfile.pdf",
                "originalFileName": "newfile.pdf",
                "fileType": ".pdf",
                "fileSize": 1024000,
                "uploadedAt": "2024-01-15T10:30:00Z"
            }
        ],
        "filesRemoved": ["test-documents/abc123_oldfile"],
        "totalNewFilesUploaded": 1,
        "totalFilesRemoved": 1,
        "updatedAt": "2024-01-15T10:30:00Z"
    }
}
```

### 2. Delete Test
**DELETE** `/api/test/{id}`

Deletes a test and all its associated files from Cloudinary.

#### Response Format
```json
{
    "success": true,
    "message": "Test with ID 123 deleted successfully"
}
```

## File Management Features

### Supported File Types
- `.doc` - Microsoft Word 97-2003 Document
- `.docx` - Microsoft Word Document
- `.pdf` - Portable Document Format
- `.txt` - Plain Text File

### File Size Limits
- Maximum file size: 10MB per file
- No limit on number of files per test

### File Storage
- Files are stored in Cloudinary under the `test-documents` folder
- Each file gets a unique public ID for identification
- Secure HTTPS URLs are provided for file access

### File Management Operations
1. **Add Files**: Upload new files while keeping existing ones
2. **Remove Files**: Delete specific files by public ID
3. **Replace Files**: Remove all existing files and upload new ones
4. **Keep Files**: Update test metadata without touching files

## Error Handling

### Common Error Responses

#### 400 Bad Request - Invalid File
```json
{
    "success": false,
    "message": "Invalid files detected",
    "errors": [
        "document.exe: Invalid file type. Allowed types: .doc, .docx, .pdf, .txt",
        "largefile.pdf: File size (15.5MB) exceeds maximum allowed size (10MB)"
    ]
}
```

#### 404 Not Found - Test Not Found
```json
{
    "success": false,
    "message": "Test with ID 123 not found"
}
```

#### 500 Internal Server Error
```json
{
    "success": false,
    "message": "An error occurred while updating the test",
    "error": "Detailed error message"
}
```

## Usage Examples

### C# HttpClient Example
```csharp
public async Task<bool> UpdateTestAsync(int testId, string title, IFormFile newFile)
{
    using var client = new HttpClient();
    using var formData = new MultipartFormDataContent();
    
    formData.Add(new StringContent(testId.ToString()), "Id");
    formData.Add(new StringContent(title), "Title");
    formData.Add(new StringContent("true"), "KeepExistingFiles");
    
    if (newFile != null)
    {
        var fileContent = new StreamContent(newFile.OpenReadStream());
        fileContent.Headers.ContentType = new MediaTypeHeaderValue(newFile.ContentType);
        formData.Add(fileContent, "NewFiles", newFile.FileName);
    }
    
    var response = await client.PutAsync($"/api/test/{testId}", formData);
    return response.IsSuccessStatusCode;
}
```

### JavaScript Fetch Example
```javascript
async function updateTest(testId, updateData) {
    const formData = new FormData();
    
    // Add basic fields
    formData.append('Id', testId);
    if (updateData.title) formData.append('Title', updateData.title);
    if (updateData.content) formData.append('Content', updateData.content);
    
    // Add new files
    if (updateData.newFiles) {
        updateData.newFiles.forEach(file => {
            formData.append('NewFiles', file);
        });
    }
    
    // Add files to remove
    if (updateData.filesToRemove) {
        updateData.filesToRemove.forEach(publicId => {
            formData.append('FilesToRemove', publicId);
        });
    }
    
    try {
        const response = await fetch(`/api/test/${testId}`, {
            method: 'PUT',
            body: formData
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating test:', error);
        return { success: false, message: error.message };
    }
}
```