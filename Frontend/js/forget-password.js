document.addEventListener('DOMContentLoaded', function() {
    const forgetPasswordForm = document.getElementById('forgetPasswordForm');
    
    forgetPasswordForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/forget-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Chuyển hướng đến trang xác nhận OTP
                window.location.href = `verify-otp.html?email=${encodeURIComponent(email)}&type=reset-password`;
            } else {
                alert(data.message || 'Không tìm thấy tài khoản với email này');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại');
        }
    });
}); 