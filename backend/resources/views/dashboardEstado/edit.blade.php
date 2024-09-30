@extends('app')
@section('content')
<h1>Editar Estado</h1>
<form action="{{ route('dashboardEstado.update', $estado->id) }}" method="POST">
    @csrf
    @method('PUT')
    <div class="mb-3">
        <label for="estado" class="form-label">Estado:</label>
        <input
        type="text"
        class="form-control"
        id="nome"
        name="nome"
        value="{{ $estado->nome }}"
        required
        >
    </div>
    <button type="submit" class="btn btn-primary">Atualizar</button>
</form>
@endsection
