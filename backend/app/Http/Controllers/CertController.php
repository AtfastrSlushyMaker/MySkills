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

            // Notify user of certificate generation
            $user = $sessionCompletion->registration->user ?? null;
            if ($user) {
                app(\App\Services\NotificationService::class)->sendCustomNotification(
                    $user,
                    'certificate_generated',
                    'Certificate Generated',
                    'Your certificate is now available for download.',
                    'normal',
                    $certificateUrl,
                    '📜',
                    null,
                    [
                        'certificate_url' => $certificateUrl,
                        'session_completion_id' => $sessionCompletion->id,
                    ]
                );
            }

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

        // Create certificate image with larger dimensions for better quality
        $image = $manager->create(1200, 900);

        // Create gradient background
        $image->fill('ffffff');

        // Add decorative border
        // Outer border - using logo colors
        $image->drawRectangle(20, 20, function ($draw) {
            $draw->size(1160, 860);
            $draw->border('22c55e', 8); // Green from logo
            $draw->background('transparent');
        });

        // Inner border
        $image->drawRectangle(40, 40, function ($draw) {
            $draw->size(1120, 820);
            $draw->border('3b82f6', 3); // Blue from logo
            $draw->background('transparent');
        });

        // Add corner decorations using logo colors
        $cornerSize = 80;
        // Top-left corner decoration (Green)
        $image->drawCircle(80, 80, function ($draw) use ($cornerSize) {
            $draw->radius($cornerSize / 4);
            $draw->background('22c55e'); // Green
            $draw->border('16a34a', 2);
        });

        // Top-right corner decoration (Blue)
        $image->drawCircle(1120, 80, function ($draw) use ($cornerSize) {
            $draw->radius($cornerSize / 4);
            $draw->background('3b82f6'); // Blue
            $draw->border('2563eb', 2);
        });

        // Bottom-left corner decoration (Orange)
        $image->drawCircle(80, 820, function ($draw) use ($cornerSize) {
            $draw->radius($cornerSize / 4);
            $draw->background('f97316'); // Orange
            $draw->border('ea580c', 2);
        });

        // Bottom-right corner decoration (Purple)
        $image->drawCircle(1120, 820, function ($draw) use ($cornerSize) {
            $draw->radius($cornerSize / 4);
            $draw->background('8b5cf6'); // Purple
            $draw->border('7c3aed', 2);
        });

        // Add company logo
        $logoPath = public_path('images/logos/myskills-logo-icon.png');
        if (file_exists($logoPath)) {
            try {
                // Load and resize logo
                $logo = $manager->read($logoPath);

                // Resize logo to fit nicely (max 150px width, maintain aspect ratio)
                $logo->scaleDown(width: 150);

                // Place logo in top center
                $logoWidth = $logo->width();
                $logoHeight = $logo->height();
                $logoX = (1200 - $logoWidth) / 2; // Center horizontally
                $logoY = 60; // Position from top

                $image->place($logo, 'top-left', $logoX, $logoY);

                // Adjust title position to accommodate logo
                $titleY = $logoY + $logoHeight + 20;
            } catch (\Exception $e) {
                Log::warning('Logo could not be loaded: ' . $e->getMessage());
                $titleY = 140; // Default position if logo fails
            }
        } else {
            $titleY = 140; // Default position if no logo
        }

        // Add a subtle background pattern/watermark
        $image->drawRectangle(200, 200, function ($draw) {
            $draw->size(800, 500);
            $draw->background('f8fafc');
            $draw->border('e2e8f0', 1);
        });

        // Prepare text content
        $recipientName = trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? ''));
        if (empty($recipientName)) {
            $recipientName = $user->email ?? 'Training Participant';
        }

        $sessionName = $session->skill_name ?? $session->title ?? 'Training Session';

        // Check if font file exists
        $fontPath = public_path('fonts/arial.ttf');
        $useCustomFont = file_exists($fontPath);

        // Add elegant header decoration (adjust position based on logo)
        $headerY = isset($titleY) ? $titleY - 20 : 120;
        $image->drawRectangle(300, $headerY, function ($draw) {
            $draw->size(600, 4);
            $draw->background('22c55e'); // Green from logo
        });

        // Certificate Title with enhanced styling (dynamic positioning)
        $certTitleY = isset($titleY) ? $titleY : 140;
        $image->text('CERTIFICATE', 600, $certTitleY, function($font) use ($fontPath, $useCustomFont) {
            if ($useCustomFont) {
                $font->file($fontPath);
            }
            $font->size(48);
            $font->color('1e40af'); // Dark blue
            $font->align('center');
            $font->valign('top');
        });

        $image->text('OF COMPLETION', 600, $certTitleY + 50, function($font) use ($fontPath, $useCustomFont) {
            if ($useCustomFont) {
                $font->file($fontPath);
            }
            $font->size(32);
            $font->color('8b5cf6'); // Purple from logo
            $font->align('center');
            $font->valign('top');
        });

        // Calculate dynamic positions based on title
        $baseY = $certTitleY + 100; // Start content after title

        // Decorative line under title
        $image->drawRectangle(400, $baseY - 20, function ($draw) {
            $draw->size(400, 2);
            $draw->background('3b82f6'); // Blue from logo
        });

        // "This is to certify that" text
        $image->text('This is to certify that', 600, $baseY + 20, function($font) use ($fontPath, $useCustomFont) {
            if ($useCustomFont) {
                $font->file($fontPath);
            }
            $font->size(26);
            $font->color('374151');
            $font->align('center');
            $font->valign('top');
        });

        // Recipient name with enhanced styling and background
        $nameY = $baseY + 70;
        $image->drawRectangle(250, $nameY, function ($draw) {
            $draw->size(700, 80);
            $draw->background('dbeafe'); // Light blue background
            $draw->border('3b82f6', 2); // Blue border
        });

        $image->text($recipientName, 600, $nameY + 40, function($font) use ($fontPath, $useCustomFont) {
            if ($useCustomFont) {
                $font->file($fontPath);
            }
            $font->size(42);
            $font->color('1e40af'); // Dark blue
            $font->align('center');
            $font->valign('middle');
        });

        // "has successfully completed" text
        $completedY = $nameY + 110;
        $image->text('has successfully completed the training session', 600, $completedY, function($font) use ($fontPath, $useCustomFont) {
            if ($useCustomFont) {
                $font->file($fontPath);
            }
            $font->size(26);
            $font->color('374151');
            $font->align('center');
            $font->valign('top');
        });

        // Session name with enhanced styling
        $sessionY = $completedY + 50;
        $image->drawRectangle(200, $sessionY, function ($draw) {
            $draw->size(800, 60);
            $draw->background('dcfce7'); // Light green background
            $draw->border('22c55e', 2); // Green border
        });

        $image->text('"' . $sessionName . '"', 600, $sessionY + 30, function($font) use ($fontPath, $useCustomFont) {
            if ($useCustomFont) {
                $font->file($fontPath);
            }
            $font->size(34);
            $font->color('15803d'); // Dark green
            $font->align('center');
            $font->valign('middle');
        });

        // Date information with better layout
        $dateY = $sessionY + 100;

        if ($sessionDate) {
            $image->text('Session Date: ' . $sessionDate, 400, $dateY, function($font) use ($fontPath, $useCustomFont) {
                if ($useCustomFont) {
                    $font->file($fontPath);
                }
                $font->size(22);
                $font->color('1f2937');
                $font->align('center');
                $font->valign('top');
            });
        }

        $image->text('Completion Date: ' . $completionDate, 800, $dateY, function($font) use ($fontPath, $useCustomFont) {
            if ($useCustomFont) {
                $font->file($fontPath);
            }
            $font->size(22);
            $font->color('1f2937');
            $font->align('center');
            $font->valign('top');
        });

        // Trainer information with better positioning
        $trainerY = $dateY + 50;
        if ($trainer && ($trainer->first_name ?? null)) {
            $trainerName = trim(($trainer->first_name ?? '') . ' ' . ($trainer->last_name ?? ''));
            $image->text('Conducted by: ' . $trainerName, 600, $trainerY, function($font) use ($fontPath, $useCustomFont) {
                if ($useCustomFont) {
                    $font->file($fontPath);
                }
                $font->size(24);
                $font->color('374151');
                $font->align('center');
                $font->valign('top');
            });
        }

        // Enhanced signature section
        $signatureY = $trainerY + 80;
        $image->drawRectangle(750, $signatureY, function ($draw) {
            $draw->size(300, 2);
            $draw->background('374151');
        });

        $image->text('Authorized Signature', 900, $signatureY + 20, function($font) use ($fontPath, $useCustomFont) {
            if ($useCustomFont) {
                $font->file($fontPath);
            }
            $font->size(18);
            $font->color('6b7280');
            $font->align('center');
            $font->valign('top');
        });

        // Add a seal/badge decoration
        $sealY = $signatureY - 30;
        $image->drawCircle(150, $sealY, function ($draw) {
            $draw->radius(60);
            $draw->background('f97316'); // Orange from logo
            $draw->border('ea580c', 4);
        });

        $image->text('CERTIFIED', 150, $sealY - 10, function($font) use ($fontPath, $useCustomFont) {
            if ($useCustomFont) {
                $font->file($fontPath);
            }
            $font->size(14);
            $font->color('ffffff'); // White text on orange
            $font->align('center');
            $font->valign('top');
        });

        $image->text(date('Y'), 150, $sealY + 10, function($font) use ($fontPath, $useCustomFont) {
            if ($useCustomFont) {
                $font->file($fontPath);
            }
            $font->size(18);
            $font->color('ffffff'); // White text on orange
            $font->align('center');
            $font->valign('top');
        });

        // Add decorative stars (adjust positions dynamically)
        $starPositions = [
            [300, $certTitleY - 10], [900, $certTitleY - 10],
            [180, $nameY + 40], [1020, $nameY + 40]
        ];

        foreach ($starPositions as $i => $pos) {
            // Use different colors from logo for each star
            $colors = ['22c55e', '3b82f6', 'f97316', '8b5cf6']; // Green, Blue, Orange, Purple
            $image->text('★', $pos[0], $pos[1], function($font) use ($fontPath, $useCustomFont, $colors, $i) {
                if ($useCustomFont) {
                    $font->file($fontPath);
                }
                $font->size(20);
                $font->color($colors[$i % 4]);
                $font->align('center');
                $font->valign('middle');
            });
        }

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
