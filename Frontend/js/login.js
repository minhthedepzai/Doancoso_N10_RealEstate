document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    rememberMe: rememberMe
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Lưu token vào localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Chuyển hướng đến trang xác nhận OTP
                window.location.href = `verify-otp.html?email=${encodeURIComponent(email)}&type=login`;
            } else {
                alert(data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    });
}); 