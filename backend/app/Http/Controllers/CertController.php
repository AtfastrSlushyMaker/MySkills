<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
// Change this line from:
// use Intervention\Image\Facades\Image;
// To:
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Http\Request;

use App\Services\imageService;

use App\Models\SessionCompletion;
use App\Models\Registration;
use App\Models\TrainingSession;

use App\Models\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class CertController extends Controller
{
    /**
     * Generate a certificate for a session completion.
     */
    public function generateCertificate(Request $request, SessionCompletion $sessionCompletion): JsonResponse
    {
        // Validate the session completion exists and is completed
        if (!$sessionCompletion->isCompleted()) {
            return response()->json(['error' => 'Session completion not found or not completed'], 404);
        }

        // Check if certificate already issued
        if ($sessionCompletion->hasCertificate()) {
            return response()->json(['message' => 'Certificate already issued', 'certificate_url' => $sessionCompletion->certificate_url]);
        }

        // Generate certificate logic here (e.g., create image, save to storage)
        $certificateUrl = $this->createCertificateImage($sessionCompletion);

        // Update session completion with certificate details
        $sessionCompletion->update([
            'certificate_issued' => true,
            'certificate_url' => $certificateUrl,
        ]);

        return response()->json(['message' => 'Certificate generated successfully', 'certificate_url' => $certificateUrl]);
    }

    private function createCertificateImage(SessionCompletion $sessionCompletion): string
    {
        // Personalized certificate image
        $user = $sessionCompletion->registration->user;
        $session = $sessionCompletion->trainingSession;
        $trainer = $session->trainer ?? null;
        $sessionDate = $session->date ? (new \DateTime($session->date))->format('F j, Y') : '';
        $completionDate = $sessionCompletion->completed_at ? $sessionCompletion->completed_at->format('F j, Y') : date('F j, Y');

        $image = Image::canvas(1000, 700, '#f8fafc');
        // Title
        $image->text('Certificate of Completion', 500, 100, function($font) {
            $font->file(public_path('fonts/arial.ttf'));
            $font->size(54);
            $font->color('#1e293b');
            $font->align('center');
            $font->valign('top');
        });
        // Recipient name
        $image->text($user->first_name . ' ' . $user->last_name, 500, 210, function($font) {
            $font->file(public_path('fonts/arial.ttf'));
            $font->size(44);
            $font->color('#0ea5e9');
            $font->align('center');
            $font->valign('top');
        });
        // Subtitle
        $image->text('has successfully completed the training session', 500, 270, function($font) {
            $font->file(public_path('fonts/arial.ttf'));
            $font->size(28);
            $font->color('#334155');
            $font->align('center');
            $font->valign('top');
        });
        // Session name
        $image->text('"' . ($session->skill_name ?? 'Session') . '"', 500, 320, function($font) {
            $font->file(public_path('fonts/arial.ttf'));
            $font->size(36);
            $font->color('#16a34a');
            $font->align('center');
            $font->valign('top');
        });
        // Session date
        if ($sessionDate) {
            $image->text('Session Date: ' . $sessionDate, 500, 380, function($font) {
                $font->file(public_path('fonts/arial.ttf'));
                $font->size(24);
                $font->color('#64748b');
                $font->align('center');
                $font->valign('top');
            });
        }
        // Completion date
        $image->text('Completion Date: ' . $completionDate, 500, 420, function($font) {
            $font->file(public_path('fonts/arial.ttf'));
            $font->size(24);
            $font->color('#64748b');
            $font->align('center');
            $font->valign('top');
        });
        // Trainer name (if available)
        if ($trainer && ($trainer->first_name ?? null)) {
            $image->text('Trainer: ' . $trainer->first_name . ' ' . ($trainer->last_name ?? ''), 500, 470, function($font) {
                $font->file(public_path('fonts/arial.ttf'));
                $font->size(22);
                $font->color('#334155');
                $font->align('center');
                $font->valign('top');
            });
        }
        // Signature placeholder
        $image->text('_________________________', 750, 600, function($font) {
            $font->file(public_path('fonts/arial.ttf'));
            $font->size(24);
            $font->color('#334155');
            $font->align('center');
            $font->valign('top');
        });
        $image->text('Training Coordinator', 750, 635, function($font) {
            $font->file(public_path('fonts/arial.ttf'));
            $font->size(20);
            $font->color('#334155');
            $font->align('center');
            $font->valign('top');
        });

        // Save the image to a temp file and upload to imgbb
        $tmpPath = sys_get_temp_dir() . '/' . uniqid('cert_', true) . '.png';
        $image->save($tmpPath);
        $url = app(\App\Services\ImageService::class)->uploadImage($tmpPath);
        @unlink($tmpPath);
        return $url;
    }
}
