@extends('app')
@section('content')
<h1>Nova Leitura</h1>
<form action="{{ route('dashboardLeitura.store') }}" method="POST">
    @csrf
    <div class="mb-3">
        <label for="tipo" class="form-label">Leitura:</label>
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
