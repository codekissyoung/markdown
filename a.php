#!/usr/bin/php
<?php
$data = ['a', 'b', 'c'];
foreach ($data as $key=>$val)
{
    $val = &$data[$key];
    var_dump($data);
}
var_dump($data);