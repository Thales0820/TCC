@extends('app')
@section('content')
<h1>Editar Perfil</h1>
<form action="{{ route('dashboardPerfil.update', $perfil->id) }}" method="POST">
    @csrf
    @method('PUT')
    <div class="mb-3">
        <label for="tipo" class="form-label">Tipo:</label>
        <input
        type="text"
        class="form-control"
        id="tipo"
        name="tipo"
        value="{{ $perfil->tipo }}"
        required
        >
    </div>
    <button type="submit" class="btn btn-primary">Atualizar</button>
</form>
@endsection
