<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bug_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // bug | mejora
            $table->string('title');
            $table->text('description');
            $table->string('page_path', 1024);
            $table->text('page_url')->nullable();
            $table->string('page_component')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('viewport', 32)->nullable();
            $table->string('status')->default('nuevo'); // nuevo | en_progreso | resuelto | descartado
            $table->timestamps();
        });

        Schema::create('bug_report_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bug_report_id')->constrained()->cascadeOnDelete();
            $table->string('kind'); // screenshot | attachment
            $table->text('file_url');
            $table->string('file_name');
            $table->string('file_type')->nullable();
            $table->unsignedInteger('file_size')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bug_report_attachments');
        Schema::dropIfExists('bug_reports');
    }
};
