<?php

namespace MLB\core\middleware;

use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use Kreait\Firebase\Exception\Auth\FailedToVerifyToken;
use Kreait\Firebase\Exception\Auth\RevokedIdToken;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as SlimResponse;

class TokenMiddleware
{
    private FirebaseAuth $auth;

    /**
     * @param FirebaseAuth $auth
     */
    public function __construct(FirebaseAuth $auth)
    {
        $this->auth = $auth;
    }


    public function __invoke(Request $request, RequestHandler $handler): SlimResponse|Response
    {
        $response = new SlimResponse();

        // Get token from Authorization header
        $authHeader = $request->getHeader('Authorization');
        if (!$authHeader || !isset($authHeader[0])) {
            $response->getBody()->write(json_encode(['error' => 'Authorization header missing']));
            return $response->withStatus(401);
        }

        // Authenticate with a test-user if profile is development
        if ($_ENV['PROFILE'] == "development") {
            $request = $request->withAttribute('user', "test-user");
            $request = $request->withAttribute('name', "Test User");
            $request = $request->withAttribute('provider', "test");
            return $handler->handle($request);
        };

        // Otherwise validate token with Firebase and continue from there
        return $this->verifyFirebaseAuthenticationToken($authHeader[0], $this->auth, $request, $handler, $response);
    }

    private function verifyFirebaseAuthenticationToken(
        string         $authHeader,
        FirebaseAuth   $firebase,
        Request        $request,
        RequestHandler $handler,
        SlimResponse   $response
    ): SlimResponse|Response
    {
        try {
            // Verify the Firebase token and add the
            $idToken = str_replace('Bearer ', '', $authHeader);
            $verifiedIdToken = $firebase->verifyIdToken($idToken);

            $request = $request->withAttribute('user', $verifiedIdToken->claims()->get('sub'));
            $request = $request->withAttribute('name', $verifiedIdToken->claims()->get('name'));
            $request = $request->withAttribute('provider', $verifiedIdToken->claims()->get('firebase')["sign_in_provider"]);
            return $handler->handle($request);
        } catch (FailedToVerifyToken|RevokedIdToken $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(401);
        }
    }
}