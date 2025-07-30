<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', Cantarell, sans-serif;
            background: linear-gradient(135deg, #f0f4ff 0%, #f9fafb 100%);
            color: #1f2937;
            padding: 20px;
            margin: 0;
            min-height: 100vh;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .email-wrapper {
            max-width: 650px;
            margin: 0 auto;
            background: transparent;
        }
        .container {
            background: #ffffff;
            border-radius: 20px;
            box-shadow:
                0 20px 40px rgba(124,58,237,0.08),
                0 8px 16px rgba(59,130,246,0.06),
                0 0 0 1px rgba(224,231,255,0.8);
            overflow: hidden;
            position: relative;
        }
        .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, #06b6d4 0%, #8b5cf6 50%, #7c3aed 100%);
        }
        .header {
            background: linear-gradient(135deg, #fefbff 0%, #f8faff 100%);
            padding: 48px 40px 32px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(124,58,237,0.03) 0%, transparent 70%);
            animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(180deg); }
        }
        .logo-section {
            margin-bottom: 24px;
            position: relative;
            z-index: 2;
        }
        .logo-container {
            width: 80px;
            height: 80px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(59,130,246,0.1) 100%);
            border-radius: 20px;
            padding: 12px;
            box-shadow: 0 4px 12px rgba(124,58,237,0.15);
        }
        .logo-container img {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            object-fit: contain;
        }
        .logo-fallback {
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: bold;
        }
        .header h1 {
            color: #7c3aed;
            font-size: 2.2rem;
            margin: 0 0 12px 0;
            font-weight: 700;
            letter-spacing: -0.025em;
            position: relative;
            z-index: 2;
        }
        .header .subtitle {
            color: #6366f1;
            font-size: 1.1rem;
            font-weight: 500;
            margin: 0;
            opacity: 0.9;
            position: relative;
            z-index: 2;
        }
        .divider {
            width: 80px;
            height: 4px;
            background: linear-gradient(90deg, #06b6d4 0%, #8b5cf6 100%);
            border-radius: 3px;
            margin: 24px auto 0 auto;
            position: relative;
            z-index: 2;
        }
        .content-section {
            padding: 40px;
        }
        .content {
            font-size: 17px;
            line-height: 1.8;
            color: #374151;
            margin-bottom: 36px;
            position: relative;
        }
        .content p {
            margin: 0 0 20px 0;
        }
        .content p:last-child {
            margin-bottom: 0;
        }
        .action-section {
            text-align: center;
            margin: 48px 0;
        }
        .action-btn {
            display: inline-block;
            background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
            color: #ffffff !important;
            padding: 16px 42px;
            border-radius: 14px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            box-shadow:
                0 4px 14px rgba(59,130,246,0.15),
                0 2px 4px rgba(124,58,237,0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        .action-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        .action-btn:hover::before {
            left: 100%;
        }
        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow:
                0 8px 25px rgba(59,130,246,0.2),
                0 4px 8px rgba(124,58,237,0.15);
        }
        .footer {
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            padding: 32px 40px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer-content {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.6;
        }
        .footer-brand {
            font-weight: 700;
            color: #7c3aed;
            text-decoration: none;
        }
        .footer-copyright {
            margin-top:18px; color:#94a3b8; font-size:12px;
        }
        @media (max-width: 640px) {
            body { padding: 10px; }
            .header { padding: 32px 24px 24px 24px; }
            .header h1 { font-size: 1.8rem; }
            .content-section { padding: 24px; }
            .action-btn { padding: 14px 32px; font-size: 1rem; }
            .footer { padding: 24px; }
        }
        @media (prefers-color-scheme: dark) {
            body { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); }
            .container { background: #1f2937; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
            .header { background: linear-gradient(135deg, #374151 0%, #4b5563 100%); }
            .content { color: #d1d5db; }
            .footer { background: linear-gradient(135deg, #374151 0%, #4b5563 100%); }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="container">
            <div class="header">
                <div class="logo-section">
                    <div class="logo-container">
                        <img src="https://i.ibb.co/Qv8TXgcp/myskills-logo-icon.png"
                             alt="MySkills Logo"
                             style="display:block; margin:0 auto; max-width:100%; max-height:100%; object-fit:contain;"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="logo-fallback" style="display: none;">MySkills</div>
                    </div>
                </div>
                <h1>Password Reset Request</h1>
                <p class="subtitle">MySkills Platform</p>
                <div class="divider"></div>
            </div>
            <div class="content-section">
                <div class="content">
                    <p>Hello{!! $user->first_name ? ', <strong>' . e($user->first_name) . '</strong>' : '' !!},</p>
                    <p>We received a request to reset your password for your MySkills account.</p>
                    <p>Click the button below to set a new password:</p>
                </div>
                <div class="action-section">
                    <a href="{{ $resetUrl }}" class="action-btn">Reset Password</a>
                    <div class="secondary-action" style="margin-top: 12px;">
                        <a href="{{ $resetUrl }}">Or click here if the button doesn't work</a>
                    </div>
                </div>
                <div class="content" style="margin-top: 24px;">
                    <p>If you did not request a password reset, you can safely ignore this email.</p>
                </div>
            </div>
            <div class="footer">
                <div class="footer-content">
                    This is an automated message from <a href="#" class="footer-brand">MySkills</a>.<br>
                    You're receiving this because you're part of our learning community.<br>
                    <span style="color:#94a3b8; font-size:12px;">Sent on {{ now()->format('F j, Y, g:i a') }}</span>
                </div>
                <div class="footer-copyright">
                    &copy; {{ date('Y') }} MySkills. All rights reserved.
                </div>
            </div>
        </div>
    </div>
</body>
</html>
