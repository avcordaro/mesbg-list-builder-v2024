<?php

namespace MLB\core;

use Kreait\Firebase\Contract\Auth;
use Kreait\Firebase\Factory;

class FireAuth
{
    private Auth $auth;

    public function __construct()
    {
        $factory = new Factory();
        $this->auth = $factory
            ->withServiceAccount(__DIR__ . '/../../' . $_ENV['SERVICE_ACCOUNT_CREDENTIALS'])
            ->createAuth();
    }

    public function getAuth(): Auth
    {
        return $this->auth;
    }
}