<?php

$addHeadersMiddleware = function ($request, $handler) {
    $response = $handler->handle($request);
    $response = $response
        ->withHeader('Content-Type', 'application/json')
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight OPTIONS requests
    if ($request->getMethod() === 'OPTIONS') {
        return $response->withStatus(200);
    }

    return $response;
};