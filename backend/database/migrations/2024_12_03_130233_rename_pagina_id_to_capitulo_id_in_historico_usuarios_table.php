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
            $table->renameColumn('pagina_id', 'capitulo_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('historico_usuarios', function (Blueprint $table) {
            $table->renameColumn('capitulo_id', 'pagina_id');
        });
    }
};
