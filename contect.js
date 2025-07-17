document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const toggler = document.querySelector('.navbar-toggler');
    const nav = document.querySelector('.navbar-nav');
    
    if (toggler && nav) {
        toggler.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('open');
        });
    }

    // File upload handling
    const fileInput = document.getElementById('attachments');
    const fileList = document.getElementById('fileList');
    
    if (fileInput && fileList) {
        fileInput.addEventListener('change', function() {
            fileList.innerHTML = '';
            
            if (this.files && this.files.length > 0) {
                Array.from(this.files).forEach((file, index) => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    
                    const fileName = document.createElement('span');
                    fileName.textContent = file.name.length > 20 
                        ? `${file.name.substring(0, 17)}...` 
                        : file.name;
                    fileName.title = file.name;
                    
                    const fileSize = document.createElement('span');
                    fileSize.className = 'file-size';
                    fileSize.textContent = formatFileSize(file.size);
                    
                    const removeBtn = document.createElement('i');
                    removeBtn.className = 'fas fa-times';
                    removeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // Create new DataTransfer to remove the file
                        const dataTransfer = new DataTransfer();
                        const filesArray = Array.from(fileInput.files);
                        filesArray.splice(index, 1);
                        
                        filesArray.forEach(f => dataTransfer.items.add(f));
                        fileInput.files = dataTransfer.files;
                        
                        fileItem.remove();
                    });
                    
                    fileItem.appendChild(fileName);
                    fileItem.appendChild(fileSize);
                    fileItem.appendChild(removeBtn);
                    fileList.appendChild(fileItem);
                });
            }
        });
        
        // Drag and drop functionality
        const fileUploadLabel = document.querySelector('.file-upload-label');
        
        if (fileUploadLabel) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                fileUploadLabel.addEventListener(eventName, preventDefaults, false);
            });
            
            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            ['dragenter', 'dragover'].forEach(eventName => {
                fileUploadLabel.addEventListener(eventName, highlight, false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                fileUploadLabel.addEventListener(eventName, unhighlight, false);
            });
            
            function highlight() {
                fileUploadLabel.classList.add('highlight');
            }
            
            function unhighlight() {
                fileUploadLabel.classList.remove('highlight');
            }
            
            fileUploadLabel.addEventListener('drop', handleDrop, false);
            
            function handleDrop(e) {
                const dt = e.dataTransfer;
                if (dt.files && dt.files.length > 0) {
                    fileInput.files = dt.files;
                    const event = new Event('change');
                    fileInput.dispatchEvent(event);
                }
            }
        }
    }
    
    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    const statusMessage = document.getElementById('statusMessage');
    
    if (contactForm && statusMessage) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            statusMessage.className = 'status-message';
            statusMessage.textContent = '';
            
            try {
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.success) {
                    statusMessage.className = 'status-message success';
                    statusMessage.textContent = data.message;
                    contactForm.reset();
                    if (fileList) fileList.innerHTML = '';
                } else {
                    statusMessage.className = 'status-message error';
                    statusMessage.textContent = data.message || 'Form submission failed';
                    if (data.errors) {
                        console.error('Validation errors:', data.errors);
                    }
                }
            } catch (error) {
                console.error('Submission error:', error);
                statusMessage.className = 'status-message error';
                statusMessage.textContent = determineErrorMessage(error);
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    function determineErrorMessage(error) {
        if (error.message.includes('Failed to fetch')) {
            return 'Network error: Please check your internet connection';
        } else if (error.message.includes('HTTP error')) {
            return 'Server error: Please try again later';
        } else if (error instanceof SyntaxError) {
            return 'Invalid server response';
        } else {
            return 'An unexpected error occurred';
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
});
