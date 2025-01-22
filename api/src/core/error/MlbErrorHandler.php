<?php

namespace MLB\core\error;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Interfaces\ErrorHandlerInterface;
use Slim\Psr7\Response;
use Throwable;

class MlbErrorHandler implements ErrorHandlerInterface
{
    public function __invoke(
        Request   $request,
        Throwable $exception,
        bool      $displayErrorDetails,
        bool      $logErrors,
        bool      $logErrorDetails
    ): ResponseInterface
    {
        $payload = ['message' => $exception->getMessage()];
        if ($displayErrorDetails) {
            $payload = ['message' => $exception->getMessage(), 'details' => $exception->getTrace()];
        }

        $response = new Response();
        $response->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE));

        $status = $this->findBestStatusCode($exception);

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }

    private function findBestStatusCode(Throwable $exception): int
    {
        $status = 500;

        if ($exception->getMessage() == "Not found.") $status = 404;

        return $status;
    }
}