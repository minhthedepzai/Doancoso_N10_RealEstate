document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Kiểm tra mật khẩu xác nhận
        if (password !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    phone,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Chuyển hướng đến trang xác nhận OTP
                window.location.href = `verify-otp.html?email=${encodeURIComponent(email)}&type=register`;
            } else {
                alert(data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    });
}); 