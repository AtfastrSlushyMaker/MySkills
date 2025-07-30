<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\CustomPasswordResetMail;

class ForgotPasswordController extends Controller
{
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'If your email exists in our system, you will receive a password reset link.'], 200);
        }
        $token = Password::broker()->createToken($user);
        // Use frontend dev URL in local, otherwise use APP_URL
        $frontendUrl = config('app.env') === 'local'
            ? 'http://localhost:5173'
            : config('app.url');
        $resetUrl = $frontendUrl . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);
        Mail::to($user->email)->send(new CustomPasswordResetMail($user, $token, $resetUrl));
        return response()->json(['message' => 'If your email exists in our system, you will receive a password reset link.'], 200);
    }
}
