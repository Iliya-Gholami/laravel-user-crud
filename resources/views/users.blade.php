<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Users Management</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Users Management</h1>
            <p>Manage your users with style</p>
        </div>

        <!-- Actions Bar -->
        <div class="actions-bar">
            <h2>All Users</h2>
            <button class="btn btn-primary" onclick="openModal()">
                + Add New User
            </button>
        </div>

        <!-- Main Content -->
        <div class="card">
            <div class="card-body">
                <div id="loading" class="loading hidden">
                    <div class="spinner"></div>
                    Loading users...
                </div>
                
                <div id="error-message" class="error hidden"></div>
                <div id="success-message" class="success hidden"></div>
                
                <div id="users-container" class="users-grid">
                    <!-- Users will be loaded here -->
                </div>
                
                <div id="empty-state" class="empty-state hidden">
                    <h3>No users found</h3>
                    <p>Start by adding your first user using the button above</p>
                </div>
                
                <div id="pagination" class="pagination hidden">
                    <!-- Pagination will be loaded here -->
                </div>
            </div>
        </div>
    </div>

    <!-- User Modal -->
    <div id="userModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title">Add New User</h2>
                <button class="close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="user-form">
                    <input type="hidden" id="user-id">
                    
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" class="form-control" required>
                        <div class="field-error" id="name-error"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" class="form-control" required>
                        <div class="field-error" id="email-error"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" class="form-control" required>
                        <div class="field-error" id="password-error"></div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary" id="submit-btn">
                            Create User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/script.js') }}"></script>
</body>
</html>