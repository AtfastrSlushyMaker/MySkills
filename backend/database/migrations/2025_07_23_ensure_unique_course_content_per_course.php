<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('course_contents', function (Blueprint $table) {
            $table->unique('training_course_id');
        });
    }

    public function down()
    {
        Schema::table('course_contents', function (Blueprint $table) {
            $table->dropUnique(['training_course_id']);
        });
    }
};
