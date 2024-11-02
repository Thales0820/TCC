<div class="row">


    @php dump(session()->all()) @endphp
    @if(session()->has('status'))

    <span class="text text-succes">{{ session()->get('status')}}</span>
    @endif

    <h2>Resetar </h2>


    <form action="{{route('password.update')}}" method="post">
        @Csrf
        <input type="hidden" name="token" value="{{ $token }}">

        @error('email')
        <div class="text text-danger">{{$message}}</div>
        @enderror
        <input type="text" name="email" placeholder="Seu email">

        @error('password')
        <div class="text text-danger">{{$message}}</div>
        @enderror
        <input type="text" name="password" placeholder="Sua Nova Senha">

        @error('password')
        <div class="text text-danger">{{$message}}</div>
        @enderror
        <input type="text" name="password_confirmation" placeholder="Sua Nova Senha">

        <button type="submit">Enviar Link</button>
    </form>

</div>
