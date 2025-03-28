document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const profileForm = document.getElementById('profileForm');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    let isEditing = false;

    // Hiển thị thông tin người dùng
    function displayUserInfo() {
        document.getElementById('fullName').value = user.fullName || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('address').value = user.address || '';
        document.getElementById('bio').value = user.bio || '';
    }

    // Xử lý nút chỉnh sửa
    editProfileBtn.addEventListener('click', function() {
        isEditing = !isEditing;
        const inputs = profileForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.readOnly = !isEditing;
        });
        editProfileBtn.textContent = isEditing ? 'Lưu' : 'Chỉnh sửa';
    });

    // Xử lý form submit
    profileForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (!isEditing) return;

        const formData = {
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            bio: document.getElementById('bio').value
        };

        try {
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Cập nhật thông tin người dùng trong localStorage
                Object.assign(user, formData);
                localStorage.setItem('user', JSON.stringify(user));
                
                isEditing = false;
                editProfileBtn.textContent = 'Chỉnh sửa';
                const inputs = profileForm.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.readOnly = true;
                });
                alert('Cập nhật thông tin thành công!');
            } else {
                alert(data.message || 'Cập nhật thông tin thất bại.');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    });

    // Xử lý đăng xuất
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });

    // Hiển thị thông tin ban đầu
    displayUserInfo();
}); 