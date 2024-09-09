@extends('app')
@section('content')
<h1>Novo Tipo</h1>
<form action="{{ route('dashboardTipo.store') }}" method="POST">
    @csrf
    <div class="mb-3">
        <label for="nome" class="form-label">Tipo:</label>
        <input
        type="text"
        class="form-control"
        id="nome"
        name="nome"
        placeholder="Digite o tipo"
        required
        >
    </div>
    <button type="submit" class="btn btn-primary">Enviar</button>
</form>
@endsection
