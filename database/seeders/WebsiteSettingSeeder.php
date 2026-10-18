<?php

namespace Database\Seeders;

use App\Models\WebsiteSetting;
use Illuminate\Database\Seeder;

class WebsiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        WebsiteSetting::firstOrCreate(
            ['id' => 1],
            [
                'website_name' => 'TaskFlow',
                'website_logo' => 'storage/website/logo.png',
                'favicon' => 'storage/website/favicon.ico',
                'website_tagline' => 'Organize your work. Achieve more.',
                'website_description' =>
                    'Organize your work, focus on what matters, and turn your plans into progress with TaskFlow.',

                'meta_title' => 'TaskFlow - Smart Task Management',
                'meta_description' =>
                    'Manage your tasks, organize priorities, and track your progress with TaskFlow.',
                'meta_keywords' =>
                    'TaskFlow, task management, productivity, task planner',

                'address' => 'Indore, Madhya Pradesh, India',
                'contact_email' => 'support@example.com',
                'contact_phone' => '+91 9876543210',
                'working_hours' => 'Monday - Friday, 9:00 AM - 6:00 PM',

                'social_links' => [
                    [
                        'platform' => 'Facebook',
                        'url' => 'https://facebook.com/',
                        'icon' => 'bi-facebook',
                    ],
                    [
                        'platform' => 'Instagram',
                        'url' => 'https://instagram.com/',
                        'icon' => 'bi-instagram',
                    ],
                    [
                        'platform' => 'LinkedIn',
                        'url' => 'https://linkedin.com/',
                        'icon' => 'bi-linkedin',
                    ],
                    [
                        'platform' => 'YouTube',
                        'url' => 'https://youtube.com/',
                        'icon' => 'bi-youtube',
                    ],
                ],

                'privacy_url' => '/privacy-policy',
                'terms_url' => '/terms-and-conditions',

                'copyright_text' => 'All rights reserved.',
                'copyright_year' => now()->year,

                'status' => true,
            ]
        );
    }
}
