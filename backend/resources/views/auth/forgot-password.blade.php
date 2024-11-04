<link rel="shortcut icon" href="{{ asset('image/logoDark.png') }}" type="image/png">
<link rel="stylesheet" href="{{ asset('css/style.css') }}">
<div class="row">
    <!-- @php dump(session()->all()) @endphp -->
    @if(session()->has('status'))
    <span class="text text-succes">{{ session()->get('status')}}</span>
    @endif

    <h2>Resetar Senha </h2>
    <form action="{{route('password.email')}}" method="post">
        @Csrf

        @error('email')
        <div class="text text-danger">{{$message}}</div>
        @enderror
        <input type="text" name="email" placeholder="Seu email">

        <button type="submit">Enviar Link</button>
    </form>

</div>
