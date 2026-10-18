<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('website_settings', function (Blueprint $table) {
            $table->id();

            // Website branding
            $table->string('website_name')->default('TaskFlow');
            $table->string('website_logo')->nullable();
            $table->string('favicon')->nullable();
            $table->string('website_tagline')->nullable();
            $table->text('website_description')->nullable();

            // SEO metadata
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('meta_keywords', 1000)->nullable();

            // Contact details
            $table->text('address')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone', 30)->nullable();
            $table->string('working_hours')->nullable();

            // Social media links stored as JSON
            $table->json('social_links')->nullable();

            // Legal pages
            $table->string('privacy_url')->nullable();
            $table->string('terms_url')->nullable();

            // Footer copyright
            $table->string('copyright_text')->nullable();
            $table->year('copyright_year')->nullable();

            // Status
            $table->boolean('status')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('website_settings');
    }
};
