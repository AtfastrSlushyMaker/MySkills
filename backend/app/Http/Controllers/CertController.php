<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Http\Request;
use App\Services\ImageService;
use App\Models\SessionCompletion;
use App\Models\Registration;
use App\Models\TrainingSession;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class CertController extends Controller
{
    /**
     * Generate a certificate for a session completion.
     */
    public function generateCertificate(Request $request, SessionCompletion $sessionCompletion): JsonResponse
    {
        try {
            $certificateUrl = $this->createCertificateImage($sessionCompletion);

            // Update the session completion with certificate info
            $sessionCompletion->update([
                'certificate_url' => $certificateUrl,
                'certificate_issued' => true
            ]);

            return response()->json([
                'message' => 'Certificate generated successfully',
                'certificate_url' => $certificateUrl
            ]);
        } catch (\Exception $e) {
            Log::error('Certificate generation failed: ' . $e->getMessage(), [
                'session_completion_id' => $sessionCompletion->id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to generate certificate',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function createCertificateImage(SessionCompletion $sessionCompletion): string
    {
        try {
            // Load relationships if not already loaded
            $sessionCompletion->load(['registration.user', 'trainingSession.trainer']);

            $user = $sessionCompletion->registration->user;
            $session = $sessionCompletion->trainingSession;
            $trainer = $session->trainer ?? null;

            // Format dates safely
            $sessionDate = $session->date ? (new \DateTime($session->date))->format('F j, Y') : '';
            $completionDate = $sessionCompletion->completed_at ?
                $sessionCompletion->completed_at->format('F j, Y') :
                date('F j, Y');

            // Create ImageManager instance with GD driver
            $manager = new ImageManager(new Driver());

            // Create certificate image
            $image = $manager->create(1000, 700)->fill('f8fafc');

            // Prepare text content
            $recipientName = trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? ''));
            if (empty($recipientName)) {
                $recipientName = $user->email ?? 'Training Participant';
            }

            $sessionName = $session->skill_name ?? $session->title ?? 'Training Session';

            // Check if font file exists
            $fontPath = public_path('fonts/arial.ttf');
            $useCustomFont = file_exists($fontPath);

            // Add text elements using the new v3 syntax

            // Title
            $image->text('Certificate of Completion', 500, 100, function($font) use ($fontPath, $useCustomFont) {
                if ($useCustomFont) {
                    $font->file($fontPath);
                }
                $font->size(54);
                $font->color('1e293b');
                $font->align('center');
                $font->valign('top');
            });

            // Recipient name
            $image->text($recipientName, 500, 210, function($font) use ($fontPath, $useCustomFont) {
                if ($useCustomFont) {
                    $font->file($fontPath);
                }
                $font->size(44);
                $font->color('0ea5e9');
                $font->align('center');
                $font->valign('top');
            });

            // Subtitle
            $image->text('has successfully completed the training session', 500, 270, function($font) use ($fontPath, $useCustomFont) {
                if ($useCustomFont) {
                    $font->file($fontPath);
                }
                $font->size(28);
                $font->color('334155');
                $font->align('center');
                $font->valign('top');
            });

            // Session name
            $image->text('"' . $sessionName . '"', 500, 320, function($font) use ($fontPath, $useCustomFont) {
                if ($useCustomFont) {
                    $font->file($fontPath);
                }
                $font->size(36);
                $font->color('16a34a');
                $font->align('center');
                $font->valign('top');
            });

            // Session date
            if ($sessionDate) {
                $image->text('Session Date: ' . $sessionDate, 500, 380, function($font) use ($fontPath, $useCustomFont) {
                    if ($useCustomFont) {
                        $font->file($fontPath);
                    }
                    $font->size(24);
                    $font->color('64748b');
                    $font->align('center');
                    $font->valign('top');
                });
            }

            // Completion date
            $image->text('Completion Date: ' . $completionDate, 500, 420, function($font) use ($fontPath, $useCustomFont) {
                if ($useCustomFont) {
                    $font->file($fontPath);
                }
                $font->size(24);
                $font->color('64748b');
                $font->align('center');
                $font->valign('top');
            });

            // Trainer name (if available)
            if ($trainer && ($trainer->first_name ?? null)) {
                $trainerName = trim(($trainer->first_name ?? '') . ' ' . ($trainer->last_name ?? ''));
                $image->text('Trainer: ' . $trainerName, 500, 470, function($font) use ($fontPath, $useCustomFont) {
                    if ($useCustomFont) {
                        $font->file($fontPath);
                    }
                    $font->size(22);
                    $font->color('334155');
                    $font->align('center');
                    $font->valign('top');
                });
            }

            // Signature placeholder
            $image->text('_________________________', 750, 600, function($font) use ($fontPath, $useCustomFont) {
                if ($useCustomFont) {
                    $font->file($fontPath);
                }
                $font->size(24);
                $font->color('334155');
                $font->align('center');
                $font->valign('top');
            });

            $image->text('Training Coordinator', 750, 635, function($font) use ($fontPath, $useCustomFont) {
                if ($useCustomFont) {
                    $font->file($fontPath);
                }
                $font->size(20);
                $font->color('334155');
                $font->align('center');
                $font->valign('top');
            });

            // Save the image to a temp file
            $tmpPath = sys_get_temp_dir() . '/' . uniqid('cert_', true) . '.png';
            $image->save($tmpPath);

            // Upload using ImageService
            $imageService = app(ImageService::class);
            $url = $imageService->uploadImage($tmpPath);

            // Clean up temp file
            @unlink($tmpPath);

            return $url;

        } catch (\Exception $e) {
            Log::error('Certificate image creation failed', [
                'error' => $e->getMessage(),
                'session_completion_id' => $sessionCompletion->id ?? null,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}
