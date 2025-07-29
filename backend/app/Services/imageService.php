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

            // Check for success and valid image link
            if (isset($body['success']) && $body['success'] === true && isset($body['data']['url']) && !empty($body['data']['url'])) {
                \Log::info('Image uploaded to imgbb', ['url' => $body['data']['url']]);
                return $body['data']['url'];
            }

            $errorMsg = $body['error']['message'] ?? 'Unknown error';
            \Log::error('Imgbb upload failed', ['error' => $errorMsg, 'body' => $body]);
            return null;
        } catch (\Exception $e) {
            \Log::error('Exception during imgbb upload', ['exception' => $e->getMessage()]);
            return null;
        }
    }

    public function uploadImage($image)
    {
        if (is_string($image) && file_exists($image)) {
            return $this->uploadToImgbb($image);
        } elseif (is_array($image) && isset($image['tmp_name']) && file_exists($image['tmp_name'])) {
            return $this->uploadToImgbb($image['tmp_name']);
        } else {
            \Log::error('Invalid image provided for upload', ['image' => $image]);
            return null;
        }
    }



}
