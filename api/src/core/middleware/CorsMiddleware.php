<?php

namespace MLB\core\middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface as Middleware;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class CorsMiddleware implements Middleware
{
    public function process(Request $request, RequestHandler $handler): Response
    {
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

        return $response;    }
}