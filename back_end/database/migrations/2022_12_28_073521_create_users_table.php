<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('email', 255)->unique();
            $table->string('password', 255);
            $table->string('confirm_password', 255)->nullable();
            $table->tinyInteger('is_active')->default(1)->comment('1=active, 0=disconnect');
            $table->tinyInteger('is_delete')->default(0)->comment('0=active, 1=deleted');
            $table->tinyInteger('role')->default('0')->comment('0=reviewer, 1=admin, 2=editor');
            $table->string('remember_token', 100)->nullable();
            $table->string('verify_email', 100)->nullable();
            $table->string('last_login_ip', 40)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('master_users');
    }
};