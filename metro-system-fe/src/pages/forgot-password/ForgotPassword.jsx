import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, Send, Lock, Key, Eye, EyeOff } from 'lucide-react';
import axiosInstance from '../../config/axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: nhập email, 2: xác nhận OTP và đặt mật khẩu mới
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Vui lòng nhập địa chỉ email');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await axiosInstance.post('/security/forgot-password', {
                email: email
            });

            if (response.data.status === 200 || response.status === 200) {
                console.log('Forgot password response:', response.data);
                setMessage('Mã xác nhận đã được gửi đến email của bạn');
                // Lưu token nếu backend trả về
                if (response.data.token) {
                    console.log('Token received from backend:', response.data.token);
                    setToken(response.data.token);
                }
                setStep(2);
            }
        } catch (error) {
            console.error('Forgot password error:', error.response?.data);
            if (error.response?.status === 404) {
                setError('Email không tồn tại trong hệ thống');
            } else if (error.response?.status === 400) {
                setError('Email không hợp lệ');
            } else {
                setError('Có lỗi xảy ra. Vui lòng thử lại sau');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!otp || !newPassword || !confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            setError('Mã OTP phải là 6 chữ số');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Thử nhiều format khác nhau cho token
            let resetToken;

            if (token) {
                // Nếu có token từ backend, dùng trực tiếp
                resetToken = token;
            } else {
                // Thử các format khác nhau
                const otpNumber = parseInt(otp, 10);

                // Format 1: email:otp
                resetToken = `${email}:${otp}`;

                // Log để debug
                console.log('Token being sent:', resetToken);
                console.log('OTP:', otp, 'Type:', typeof otp);
                console.log('OTP Number:', otpNumber, 'Type:', typeof otpNumber);
            }

            const response = await axiosInstance.post('/security/reset-password', {
                token: resetToken,
                newPassword: newPassword
            });

            if (response.data.status === 200 || response.status === 200) {
                setMessage('Mật khẩu đã được đặt lại thành công!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            console.error('Reset password error:', error.response?.data);
            console.error('Full error:', error);
            if (error.response?.status === 400) {
                const errorMsg = error.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn';
                setError(errorMsg);
            } else if (error.response?.status === 404) {
                setError('Không tìm thấy yêu cầu đặt lại mật khẩu');
            } else {
                setError('Có lỗi xảy ra. Vui lòng thử lại');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBackToStep1 = () => {
        setStep(1);
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setMessage('');
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <div className="forgot-password-header">
                    <div className="icon-wrapper">
                        {step === 1 ? <Mail size={24} /> : <Key size={24} />}
                    </div>
                    <h2>{step === 1 ? 'Quên Mật Khẩu' : 'Đặt Lại Mật Khẩu'}</h2>
                    <p className="subtitle">
                        {step === 1
                            ? 'Nhập email để nhận mã xác nhận'
                            : 'Nhập mã OTP và mật khẩu mới'
                        }
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleForgotPassword} className="forgot-password-form">
                        <div className="form-group">
                            <label htmlFor="email">Địa chỉ Email</label>
                            <div className="input-wrapper">
                                <Mail size={20} className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    className="form-input"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="alert alert-error">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="alert alert-success">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="spin" />
                                    Đang gửi...
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Gửi Mã Xác Nhận
                                </>
                            )}
                        </button>

                        <div className="forgot-password-footer">
                            <Link to="/login" className="back-link">
                                <ArrowLeft size={16} />
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="forgot-password-form">
                        <div className="form-group">
                            <label htmlFor="otp">Mã OTP</label>
                            <div className="input-wrapper">
                                <Key size={20} className="input-icon" />
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => {
                                        // Chỉ cho phép nhập số
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        setOtp(value);
                                    }}
                                    placeholder="Nhập mã 6 chữ số"
                                    className="form-input"
                                    maxLength={6}
                                    disabled={loading}
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">Mật Khẩu Mới</label>
                            <div className="input-wrapper">
                                <Lock size={20} className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu mới"
                                    className="form-input"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</label>
                            <div className="input-wrapper">
                                <Lock size={20} className="input-icon" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Xác nhận mật khẩu mới"
                                    className="form-input"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="alert alert-error">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="alert alert-success">
                                {message}
                            </div>
                        )}

                        <div className="button-group">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleBackToStep1}
                                disabled={loading}
                            >
                                <ArrowLeft size={20} />
                                Quay Lại
                            </button>

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <Key size={20} />
                                        Đặt Lại Mật Khẩu
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
