<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Config;

class ImageService
{
    public function uploadToImgbb($filePath)
    {
        $client = new Client();
        $apiKey = env('IMAGEBB_API_KEY', Config::get('services.imgbb.key'));
        $apiUrl = env('IMAGEBB_URL', 'https://api.imgbb.com/1/upload');

        \Log::debug('Uploading image to imgbb (multipart)', [
            'filePath' => $filePath,
            'apiKey' => $apiKey,
            'apiUrl' => $apiUrl
        ]);

        try {
            $base64Image = base64_encode(file_get_contents($filePath));
            $response = $client->post($apiUrl . '?expiration=600&key=' . $apiKey, [
                'multipart' => [
                    [
                        'name' => 'image',
                        'contents' => $base64Image
                    ]
                ]
            ]);
            $body = json_decode($response->getBody(), true);
            \Log::debug('Imgbb response', ['body' => $body]);

            if (isset($body['data']['url'])) {
                \Log::info('Image uploaded to imgbb', ['url' => $body['data']['url']]);
                return $body['data']['url'];
            }

            \Log::error('Imgbb upload failed', ['error' => $body['error']['message'] ?? 'Unknown error']);
            throw new \Exception('Image upload failed: ' . ($body['error']['message'] ?? 'Unknown error'));
        } catch (\Exception $e) {
            \Log::error('Exception during imgbb upload', ['exception' => $e->getMessage()]);
            throw $e;
        }
    }



}
