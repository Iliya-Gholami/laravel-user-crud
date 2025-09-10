const API_BASE_URL = '/api';

let isEditing = false;
let editingUserId = null;
let currentPage = 1;

// DOM Elements
const userModal = document.getElementById('userModal');
const userForm = document.getElementById('user-form');
const modalTitle = document.getElementById('modal-title');
const submitBtn = document.getElementById('submit-btn');
const usersContainer = document.getElementById('users-container');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error-message');
const successDiv = document.getElementById('success-message');
const emptyState = document.getElementById('empty-state');
const paginationDiv = document.getElementById('pagination');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    
    userForm.addEventListener('submit', handleFormSubmit);
    
    // Close modal when clicking outside
    userModal.addEventListener('click', function(e) {
        if (e.target === userModal) {
            closeModal();
        }
    });
});

// Modal functions
function openModal() {
    resetForm();
    isEditing = false;
    modalTitle.textContent = 'Add New User';
    submitBtn.textContent = 'Create User';
    userModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    userModal.classList.remove('show');
    document.body.style.overflow = '';
    clearFieldErrors();
}

// Load all users
async function loadUsers(page = 1) {
    showLoading(true);
    hideMessages();
    currentPage = page;
    
    try {
        const response = await fetch(`${API_BASE_URL}/users?page=${page}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            displayUsers(data.users.data);
            displayPagination(data.users);
        } else {
            throw new Error(data.message || 'Failed to load users');
        }
        
    } catch (error) {
        console.error('Error loading users:', error);
        showError('Failed to load users. Please check your API connection.');
        showEmptyState(true);
    } finally {
        showLoading(false);
    }
}

// Display users in grid
function displayUsers(users) {
    if (users.length === 0) {
        showEmptyState(true);
        paginationDiv.classList.add('hidden');
        return;
    }
    
    showEmptyState(false);
    
    const usersHTML = users.map(user => `
        <div class="user-card" data-user-id="${user.id}">
            <div class="user-info">
                <h3>${escapeHtml(user.name)}</h3>
                <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
                <p><strong>Created:</strong> ${formatDate(user.created_at)}</p>
            </div>
            <div class="user-actions">
                <button class="btn btn-primary btn-sm" onclick="editUser(${user.id})">
                    Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
    
    usersContainer.innerHTML = usersHTML;
}

// Display pagination
function displayPagination(paginationData) {
    if (paginationData.last_page <= 1) {
        paginationDiv.classList.add('hidden');
        return;
    }
    
    paginationDiv.classList.remove('hidden');
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button onclick="loadUsers(${paginationData.current_page - 1})" 
                ${paginationData.current_page === 1 ? 'disabled' : ''}>
            Previous
        </button>
    `;
    
    // Page numbers
    const startPage = Math.max(1, paginationData.current_page - 2);
    const endPage = Math.min(paginationData.last_page, paginationData.current_page + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button onclick="loadUsers(${i})" 
                    class="${i === paginationData.current_page ? 'active' : ''}">
                ${i}
            </button>
        `;
    }
    
    // Next button
    paginationHTML += `
        <button onclick="loadUsers(${paginationData.current_page + 1})" 
                ${paginationData.current_page === paginationData.last_page ? 'disabled' : ''}>
            Next
        </button>
    `;
    
    paginationDiv.innerHTML = paginationHTML;
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    hideMessages();
    clearFieldErrors();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = isEditing ? 'Updating...' : 'Creating...';

    try {
        let response;
        
        if (isEditing) {
            // Update user (PUT)
            response = await fetch(`${API_BASE_URL}/users/${editingUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        } else {
            // Create new user (POST)
            response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        }

        const result = await response.json();

        if (!response.ok) {
            if (response.status === 422 && result.errors) {
                // Validation errors
                displayFieldErrors(result.errors);
                return;
            } else {
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }
        }

        if (result.success) {
            showSuccess(result.message);
            closeModal();
            loadUsers(currentPage);
        } else {
            throw new Error(result.message || 'Operation failed');
        }
        
    } catch (error) {
        console.error('Error saving user:', error);
        showError('Failed to save user: ' + error.message);
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = isEditing ? 'Update User' : 'Create User';
    }
}

// Display field errors
function displayFieldErrors(errors) {
    Object.keys(errors).forEach(field => {
        const fieldElement = document.getElementById(field);
        const errorElement = document.getElementById(`${field}-error`);
        
        if (fieldElement && errorElement) {
            fieldElement.classList.add('error');
            errorElement.textContent = errors[field][0]; // First error message
            errorElement.classList.add('show');
        }
    });
}

// Clear field errors
function clearFieldErrors() {
    const errorElements = document.querySelectorAll('.field-error');
    const fieldElements = document.querySelectorAll('.form-control');
    
    errorElements.forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
    
    fieldElements.forEach(el => {
        el.classList.remove('error');
    });
}

// Edit user
async function editUser(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            const user = result.user;
            
            // Populate form
            document.getElementById('user-id').value = user.id;
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('password').value = ''; // Don't populate password
            
            // Update modal state
            isEditing = true;
            editingUserId = userId;
            modalTitle.textContent = 'Edit User';
            submitBtn.textContent = 'Update User';
            
            // Open modal
            userModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
            throw new Error(result.message || 'Failed to load user');
        }
        
    } catch (error) {
        console.error('Error loading user for editing:', error);
        showError('Failed to load user details.');
    }
}

// Delete user
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }
        
        if (result.success) {
            showSuccess(result.message);
            loadUsers(currentPage);
        } else {
            throw new Error(result.message || 'Failed to delete user');
        }
        
    } catch (error) {
        console.error('Error deleting user:', error);
        showError('Failed to delete user: ' + error.message);
    }
}

// Reset form
function resetForm() {
    userForm.reset();
    document.getElementById('user-id').value = '';
    isEditing = false;
    editingUserId = null;
    clearFieldErrors();
}

// Utility functions
function showLoading(show) {
    loadingDiv.classList.toggle('hidden', !show);
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function showSuccess(message) {
    successDiv.textContent = message;
    successDiv.classList.remove('hidden');
    setTimeout(() => {
        successDiv.classList.add('hidden');
    }, 5000);
}

function hideMessages() {
    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');
}

function showEmptyState(show) {
    emptyState.classList.toggle('hidden', !show);
    usersContainer.style.display = show ? 'none' : 'grid';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}