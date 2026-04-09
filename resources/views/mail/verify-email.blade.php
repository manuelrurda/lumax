<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificar dirección de correo electrónico</title>
    <style>

        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333; }
        table { border-collapse: collapse; width: 100%; }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .header {
            background-color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header img {
            max-height: 50px;
            width: auto;
        }

        .content { padding: 30px 20px; }
        .h1 { font-size: 22px; margin-bottom: 20px; color: #1a202c; }
        .text { line-height: 1.6; margin-bottom: 20px; }
        
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #cf7032;
            padding: 15px;
            margin-bottom: 20px;
            color: #555;
        }

        .btn-container { text-align: center; margin: 30px 0; }
        .btn {
            background-color: #2e2e71;
            color: #ffffff;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
        }
        .btn:hover { background-color: #221f61; }

        .footer {
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #888;
        }
        .footer a { color: #888; text-decoration: underline; }
    </style>
</head>
<body>

    <div style="padding: 20px;">
        <table role="presentation" class="email-container">
            <tr>
                <td class="header">
                    <img src="{{ $message->embed(public_path('logo.png')) }}" alt="Logo Lumax">
                </td>
            </tr>

            <tr>
                <td class="content">
                    <h1 class="h1">Verificar dirección de correo electrónico</h1>
                    <p class="text">
                        Hola <strong>{{ $user->full_name }}</strong>,
                    </p>
                    <p class="text">
                        Gracias por registrarte. Por favor, haz clic en el botón de abajo para verificar tu dirección de correo electrónico.
                    </p>

                    <div class="info-box">
                        <p style="margin: 0;">
                            <strong>Importante:</strong> Este enlace de verificación expirará en 60 minutos por razones de seguridad.
                        </p>
                    </div>

                    <div class="btn-container">
                        <a href="{{ $verificationUrl }}" class="btn">Verificar correo electrónico</a>
                    </div>

                    <p class="text" style="font-size: 13px; color: #666;">
                        Si tiene problemas para hacer clic en el botón "Verificar correo electrónico", copie y pegue la siguiente URL en su navegador:
                        <br>
                        <a href="{{ $verificationUrl }}" style="color: #004aad; word-break: break-all;">{{ $verificationUrl }}</a>
                    </p>

                    <p class="text" style="font-size: 13px; color: #666;">
                        Si no creó una cuenta, no es necesario realizar ninguna acción.
                    </p>
                </td>
            </tr>

            <tr>
                <td class="footer">
                    <p>&copy; {{ date('Y') }} {{ config('app.name') }}. Todos los derechos reservados.</p>
                    <p>Este es un correo automático, por favor no responda a este mensaje.</p>
                </td>
            </tr>
        </table>
    </div>

</body>
</html>

