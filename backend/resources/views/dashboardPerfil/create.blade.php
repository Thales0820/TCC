@extends('app')

@section('content')
<h1>Novo Perfil</h1>
<form action="{{ route('dashboardPerfil.store') }}" method="POST">
    @csrf
    <div class="mb-3">
        <label for="tipo" class="form-label">Tipo:</label>
        <input
        type="text"
        class="form-control"
        id="tipo"
        name="tipo"
        placeholder="Digite o tipo"
        required
        >
    </div>
    <button type="submit" class="btn btn-primary">Enviar</button>
</form>
@endsection
