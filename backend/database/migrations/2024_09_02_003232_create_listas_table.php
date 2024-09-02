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
        Schema::create('listas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('usuario_id');
            $table->unsignedBigInteger('obra_id');
            $table->unsignedBigInteger('leitura_id'); // Se for um timestamp ou identificador
            $table->timestamps();

            // Definindo as chaves estrangeiras
            $table->foreign('usuario_id')->references('id')->on('usuario')->onDelete('cascade');
            $table->foreign('obra_id')->references('id')->on('obras')->onDelete('cascade');
            $table->foreign('leitura_id')->references('id')->on('leituras')->onDelete('cascade'); // Se houver uma tabela de leituras
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listas');
    }
};
