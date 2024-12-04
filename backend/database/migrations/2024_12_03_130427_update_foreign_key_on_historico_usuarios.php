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
        Schema::table('historico_usuarios', function (Blueprint $table) {
            $table->dropForeign(['pagina_id']);
            $table->foreign('capitulo_id')->references('id')->on('capitulos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('historico_usuarios', function (Blueprint $table) {
            $table->dropForeign(['capitulo_id']);
            $table->foreign('pagina_id')->references('id')->on('paginas')->onDelete('cascade');
        });
    }
};
