<link rel="stylesheet" href="{{ asset('css/reset.style.css') }}">
<div class="row">
    <!-- @php dump(session()->all()) @endphp -->

    @if(session()->has('status'))
        <span class="text text-success">{{ session()->get('status') }}</span>
    @endif

    <h2>Resetar Senha</h2>

    <form action="{{ route('password.update') }}" method="post">
        @csrf
        <input type="hidden" name="token" value="{{ $token }}">

        <!-- Campo de email oculto, com o valor do email preenchido automaticamente -->
        <input type="hidden" name="email" value="{{ request()->query('email', old('email')) }}">

        @error('password')
            <div class="text text-danger">{{ $message }}</div>
        @enderror
        <input type="password" name="password" placeholder="Sua Nova Senha">

        @error('password_confirmation')
            <div class="text text-danger">{{ $message }}</div>
        @enderror
        <input type="password" name="password_confirmation" placeholder="Confirme sua Nova Senha">

        <button type="submit">Enviar Link</button>
    </form>
</div>
