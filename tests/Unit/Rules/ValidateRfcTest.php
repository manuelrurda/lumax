<?php

use App\Rules\ValidRfc;

$validRfcs = [
  'MUPA850612T38', 'PEHA980930IQ7', 'BALA780128JE4',
  'COZA760507P86', 'SOPA820330FDA', 'OIRA4703205C3',
  'RAGB630520RW7', 'LELB940225I18', 'SAPN8806203P9',
  'PAHM820929N35', 'ZAPD950920J24', 'EIHA460530981',
  'RICE8901251P2', 'CULE620303HJ1', 'PALT950119H96',
  'HECF7904026B2', 'EUGR441024RR3', 'PASG870423LB3',
  'ROVA840312SI1', 'CUSG6905094MA', 'MEFG8102214M5',
  'AERG710916AB7', 'ROFG420113S71', 'PEEA950510IJ4',
  'VAQJ600515L20', 'LOVJ911031DR6', 'HEPM8503292Z6',
  'ROGG601202AZ5', 'MAGR741019UD9', 'MABJ570319FW2',
  'SAHJ8203091A6', 'LELR7106169G8', 'SOPL8806146W2',
  'VAGD731224CT8', 'VAAN7002159I6', 'CACM7011027Y0',
  'MERA8912285B7', 'MABE870421G93', 'EORC5812087D5',
  'CORE590208TL2', 'PAGG860816DX2', 'LOVA850806DC4',
  'HECM610401K86'
];



test('it correctly validates a list of known valid RFCs', function (string $rfc) {
    $rule = new ValidRfc();
    $fails = false;

    $rule->validate('rfc', $rfc, function ($message) use (&$fails) {
        $fails = true;
    });

    expect($fails)->toBeFalse("Failed validating RFC: {$rfc}");
})->with($validRfcs);

test('it correctly invalidates a list of bad RFCs', function (string $invalidRfc) {
    $rule = new ValidRfc();
    $fails = false;

    $rule->validate('rfc', $invalidRfc, function ($message) use (&$fails) {
        $fails = true;
    });

    expect($fails)->toBeTrue("Incorrectly validated a bad RFC: {$invalidRfc}");
})->with([
    'INVALIDRFC',
    'GODE880101HDFLRN01',
    'GODE880101HDFLRN0',
    '',
]);