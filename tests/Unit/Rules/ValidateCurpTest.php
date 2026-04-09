<?php

use App\Rules\ValidCurp;

$validCurps = [
    'GAVM540516HJCRRR02', 'CIMA561206HSPSNG00', 'VASA420527HSPZNG05',
    'GUEA520913HSPRSM10', 'VATA540713HSPZVN06', 'PAOA261130HSPLSN08',
    'ZAMB420521MSPPNL09', 'CAVC570405MSPSLT08', 'ROMC680603HSPDRC00',
    'COVD510819HSPNZM00', 'VARE490805HSPZMM01', 'VAPF420526HSPZLL00',
    'TUPF331116MSPRLD06', 'EAHF540328HSPSRR08', 'TARS441029HSPPMN12',
    'RAZJ650420HSPMPS06', 'TAMS760329HSPPNN07', 'CAMJ730722HSPRRN09',
    'VAMJ450506HSPSNN06', 'TOGL720107HSPRLC19', 'GAML320621MSPLXS09',
    'VAQC670503MSPZRR04', 'CECD410404MSPRML04', 'BAGE381027MSPRLN07',
    'AAME290801MSPMRS02',
];

/**
 * Test Case 1: A completely valid CURP should pass validation.
 * */
test('it correctly validates a list of known valid CURPs', function (string $curp) {
    $rule = new ValidCurp();
    $fails = false;

    $rule->validate('curp', $curp, function ($message) use (&$fails) {
        $fails = true;
    });

    expect($fails)->toBeFalse("Failed validating CURP: {$curp}");

})->with($validCurps);


/**
 * Test Case 2: A CURP with an incorrect format should fail.
 * */
test('it correctly invalidates a list of bad CURPs', function (string $invalidCurp) {
    // Arrange
    $rule = new ValidCurp();
    $fails = false;

    // Act
    $rule->validate('curp', $invalidCurp, function ($message) use (&$fails) {
        $fails = true;
    });

    // Assert: La validación SÍ debe fallar.
    expect($fails)->toBeTrue("Incorrectly validated a bad CURP: {$invalidCurp}");

})->with([
    'INVALIDCURP',          // Formato incorrecto
    'GODE880101HDFLRN01',   // Dígito verificador incorrecto (debería ser 08)
    'GODE880101HDFLRN0',    // Muy corto
    '',                     // Vacío
]);
