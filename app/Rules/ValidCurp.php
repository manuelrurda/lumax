<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidCurp implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if(!$this->isValidCurp($value)){
            $fail('CURP inválido.');
        }
    }

    /**
     * Validates CURP against regex and verification digit
     * 
     * @param string $str
     * @return bool
     */
    private function isValidCurp($str): bool
    {
        if (is_null($str)) {
            return false;
        }

        $curp = mb_strtoupper($str, "UTF-8");
        $pattern = "/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/";
        $validacionRegex = preg_match($pattern, $curp);
        
        if ($validacionRegex === 0) {
            #No cumple con un formato válido
            return false;
        }
        
        #De aquí en adelante se verifica el dígito verificador
        $diccionario = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
        $lngSuma = 0.0;
        $lngDigito = 0.0;
        $curp17 = substr($curp, 0, 17);
        
        for ($i = 0; $i < 17; $i++) {
            $lngSuma = $lngSuma + mb_strpos($diccionario, mb_substr($curp17, $i, 1)) * (18 - $i);
        }

        $lngDigito = 10 - ($lngSuma % 10);
        $digitoVerificador = ($lngDigito == 10) ? 0 : $lngDigito;
        
        return $digitoVerificador == $curp[17];
    }
}
