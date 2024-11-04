<link rel="shortcut icon" href="{{ asset('image/logoDark.png') }}" type="image/png">
<link rel="stylesheet" href="{{ asset('css/login.style.css') }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
    <div class="login-container">
        <img src="{{ asset('image/logoDark.png') }}" alt="logo" style="text-align: center;">
        <h2>Login Indie Comics</h2>
        <form method="POST" action="{{ route('login') }}">
            @csrf
            <div class="form-group">
                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" placeholder="Email">
            </div>
            <div class="form-group">
                <label for="password">Senha</label>
                <input type="password" id="password" name="password" placeholder="Senha" required>
            </div>
            <button type="submit" class="login-button">Entrar</button>
        </form>

        @if ($errors->any())
            <div class="error-messages">
                <strong>Erro:</strong>
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif
    </div>
</body>
</html>
