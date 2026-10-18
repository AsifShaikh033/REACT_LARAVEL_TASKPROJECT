<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteSetting extends Model
{
    protected $fillable = [
        'website_name',
        'website_logo',
        'favicon',
        'website_tagline',
        'website_description',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'address',
        'contact_email',
        'contact_phone',
        'working_hours',
        'social_links',
        'privacy_url',
        'terms_url',
        'copyright_text',
        'copyright_year',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'social_links' => 'array',
            'status' => 'boolean',
            'copyright_year' => 'integer',
        ];
    }
}
