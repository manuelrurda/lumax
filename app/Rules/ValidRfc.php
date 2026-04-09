<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidRfc implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if(!$this->isValidRfc($value)){
            $fail('RFC inválido.');
        }
    }
    
    function isValidRfc(string $rfc, bool $aceptarGenerico = true): string|false
    {
        $rfc = strtoupper(trim($rfc));
        $regex = '/^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/';

        if (!preg_match($regex, $rfc, $matches)) {
            return false;
        }

        // Separar el dígito verificador
        $digitoVerificador = array_pop($matches);
        $rfcSinDigito      = implode('', array_slice($matches, 1));
        $len               = strlen($rfcSinDigito);

        // Diccionario oficial
        $diccionario = "0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ";
        $indice      = $len + 1;

        // Ajuste persona física / moral
        $suma = ($len === 12) ? 0 : 481;

        for ($i = 0; $i < $len; $i++) {
            $suma += strpos($diccionario, $rfcSinDigito[$i]) * ($indice - $i);
        }

        $digitoEsperado = 11 - ($suma % 11);

        if ($digitoEsperado === 11) {
            $digitoEsperado = '0';
        } elseif ($digitoEsperado === 10) {
            $digitoEsperado = 'A';
        } else {
            $digitoEsperado = (string) $digitoEsperado;
        }

        $rfcCompleto = $rfcSinDigito . $digitoVerificador;

        // Validación final
        if (
            $digitoVerificador !== $digitoEsperado &&
            (!$aceptarGenerico || $rfcCompleto !== 'XAXX010101000')
        ) {
            return false;
        }

        if (!$aceptarGenerico && $rfcCompleto === 'XEXX010101000') {
            return false;
        }

        return $rfcCompleto;
    }
  }
