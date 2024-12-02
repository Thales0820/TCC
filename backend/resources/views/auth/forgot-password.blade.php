<link rel="shortcut icon" href="{{ asset('image/logoDark.png') }}" type="image/png">
<link rel="stylesheet" href="{{ asset('css/style.css') }}">
<link href="https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" rel="stylesheet"></link>

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
        <div class="input">
            <input type="text" name="email" placeholder="Seu email">
        </div>

        <button type="submit">Enviar Link</button>
    </form>
</div>
