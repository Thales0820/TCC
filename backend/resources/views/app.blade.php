<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="{{ asset('css/menu.css') }}">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="shortcut icon" href="{{ asset('image/logoDark.png') }}" type="image/png">

    <script>
        function logout(event) {
            event.preventDefault();
            document.getElementById('logout-form').submit();
        }
    </script>
</head>

<body>
    <!-- Botão para abrir o menu -->
    <div id="menuBtn" class="menu-btn" onclick="toggleNav()">☰ Menu</div>

    <!-- Sidebar -->
    <div id="sidebar" class="sidebar">
        <a href="javascript:void(0)" class="closebtn" onclick="toggleNav()">×</a>
        <a href="{{ route('dashboard.index') }}"><i class="bi bi-house-door-fill"></i> Home</a>
        <a href="{{ route('dashboardEstado.index') }}"><i class="bi bi-journal-bookmark-fill"></i> Estados</a>
        <a href="{{ route('dashboardLeitura.index') }}"><i class="bi bi-bookmark-fill"></i> Leituras</a>
        <a href="{{ route('dashboardTipo.index') }}"><i class="bi bi-book-half"></i> Tipos</a>
        <a href="{{ route('dashboardGenero.index') }}"><i class="bi bi-journal-medical"></i> Gêneros</a>
        <a href="{{ route('dashboardObra.index') }}"><i class="bi bi-chat-fill"></i> Obras</a>
        <a href="{{ route('dashboardPerfil.index') }}"><i class="bi bi-people-fill"></i> Perfil</a>
        <a href="{{ route('dashboard.index') }}"><i class="bi bi-person-fill"></i> Usuários</a>
        <a href="{{ route('dashboardComentario.index') }}"><i class="bi bi-chat-left-text-fill"></i> Comentários</a>

        <!-- Link de Logout com JavaScript para envio via POST -->
        <a href="{{ route('logout') }}" onclick="logout(event)">
            <i class="bi bi-box-arrow-left"></i> Sair
        </a>
    </div>

    <!-- Formulário de logout invisível -->
    <form id="logout-form" method="POST" action="{{ route('logout') }}" style="display: none;">
        @csrf
    </form>

    <div id="main" class="main-content">
        <br>
        <div class="container mt-4">
            @yield('content')
        </div>
    </div>

    <script src="{{ asset('js/menu.js') }}"></script>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

</html>
