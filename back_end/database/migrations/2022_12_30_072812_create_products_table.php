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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_id', 255)->nullable();
            $table->string('product_name', 255);
          
            $table->string('id_group',10)->nullable();
            $table->string('product_detail', 255)->nullable();
            $table->string('product_price', 255);
            $table->string('image')->nullable();
            $table->tinyInteger('is_delete')->default(0)->comment('0=active, 1=deleted');
            $table->tinyInteger('status')->default('0')->comment('0=on-sale, 1=stop-selling, 2=sold-out');

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
        Schema::dropIfExists('products');
    }
};