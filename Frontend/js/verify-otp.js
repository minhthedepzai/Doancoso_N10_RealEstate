document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử từ form
    const otpInputs = document.querySelectorAll('.otp-input');
    const verifyForm = document.getElementById('verifyOtpForm');
    const resendButton = document.getElementById('resendOtp');
    const countdownSpan = document.getElementById('countdown');
    const changeEmailLink = document.getElementById('changeEmail');
    
    // Lấy thông tin từ URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const type = urlParams.get('type'); // login, register, or reset-password
    
    // Xử lý nhập OTP
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            // Chỉ cho phép nhập số
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Tự động chuyển sang ô tiếp theo
            if (this.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', function(e) {
            // Xử lý phím backspace
            if (e.key === 'Backspace' && !this.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
    
    // Xử lý gửi form
    verifyForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Lấy mã OTP từ các input
        const otp = Array.from(otpInputs).map(input => input.value).join('');
        
        try {
            // Gọi API xác nhận OTP
            const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    otp: otp,
                    type: type
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Xử lý khi xác nhận thành công
                if (type === 'login') {
                    // Lưu token và thông tin user
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    // Chuyển hướng về trang chủ
                    window.location.href = 'index.html';
                } else if (type === 'register') {
                    // Chuyển hướng về trang đăng nhập
                    window.location.href = 'login.html';
                } else if (type === 'reset-password') {
                    // Chuyển hướng về trang đặt lại mật khẩu
                    window.location.href = 'reset-password.html';
                }
            } else {
                alert(data.message || 'Mã OTP không chính xác');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại');
        }
    });
    
    // Xử lý gửi lại mã OTP
    let countdown = 60;
    const timer = setInterval(() => {
        countdown--;
        countdownSpan.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            resendButton.disabled = false;
            resendButton.addEventListener('click', async function() {
                try {
                    const response = await fetch('http://localhost:5000/api/auth/resend-otp', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email,
                            type: type
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        alert('Đã gửi lại mã OTP');
                        // Reset countdown
                        countdown = 60;
                        countdownSpan.textContent = countdown;
                        resendButton.disabled = true;
                        clearInterval(timer);
                    } else {
                        alert(data.message || 'Không thể gửi lại mã OTP');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Có lỗi xảy ra, vui lòng thử lại');
                }
            });
        }
    }, 1000);
    
    // Xử lý đổi email
    changeEmailLink.addEventListener('click', function(e) {
        e.preventDefault();
        // Chuyển hướng về trang tương ứng
        if (type === 'login') {
            window.location.href = 'login.html';
        } else if (type === 'register') {
            window.location.href = 'register.html';
        } else if (type === 'reset-password') {
            window.location.href = 'forget-password.html';
        }
    });
}); 