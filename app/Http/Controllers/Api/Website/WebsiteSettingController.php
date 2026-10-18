<?php

namespace App\Http\Controllers\Api\Website;

use App\Http\Controllers\Controller;
use App\Models\WebsiteSetting;
use Illuminate\Http\JsonResponse;

class WebsiteSettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = WebsiteSetting::query()
            ->where('status', true)
            ->first();

        if (!$settings) {
            return response()->json([
                'success' => false,
                'message' => 'Website settings not found.',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Website settings fetched successfully.',
            'data' => [
                'website_name' => $settings->website_name,
                'website_logo' => $settings->website_logo,
                'favicon' => $settings->favicon,
                'website_tagline' => $settings->website_tagline,
                'website_description' => $settings->website_description,
                'meta_title' => $settings->meta_title,
                'meta_description' => $settings->meta_description,
                'meta_keywords' => $settings->meta_keywords,
                'address' => $settings->address,
                'contact_email' => $settings->contact_email,
                'contact_phone' => $settings->contact_phone,
                'working_hours' => $settings->working_hours,
                'social_links' => $settings->social_links ?? [],
                'privacy_url' => $settings->privacy_url,
                'terms_url' => $settings->terms_url,
                'copyright_text' => $settings->copyright_text,
                'copyright_year' => $settings->copyright_year,
            ],
        ]);
    }
}
