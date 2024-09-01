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
        Schema::create('obras', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('capa');
            $table->text('sinopse');
            $table->unsignedBigInteger('autor_id');
            $table->unsignedInteger('likes')->default(0);
            $table->date('data_publicacao')->nullable(false);
            $table->date('data_encerramento')->nullable();
            $table->unsignedBigInteger('tipo_id');
            $table->unsignedBigInteger('estado_id');
            $table->timestamps();

            $table->foreign('autor_id')->references('id')->on('usuarios')->onDelete('cascade');
            $table->foreign('tipo_id')->references('id')->on('tipos')->onDelete('cascade');
            $table->foreign('estado_id')->references('id')->on('estados')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('obras');
    }
};
