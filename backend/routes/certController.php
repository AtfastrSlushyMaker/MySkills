
<?php
use App\Http\Controllers\CertController;
// Certificate generation for a session completion
Route::post('/session-completions/{sessionCompletion}/generate-certificate', [CertController::class, 'generateCertificate']);

