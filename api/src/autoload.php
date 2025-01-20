<?php

spl_autoload_register(function ($className) {
    $classPath = str_replace('\\', '/', $className);
    $classRelativeFromSrc = str_replace("/app", "", $classPath);
    $fileName = lcfirst($classRelativeFromSrc . '.php');
    $filePath = __DIR__ . "/" . $fileName;

    if (file_exists($filePath)) {
        require $filePath;
    }
});