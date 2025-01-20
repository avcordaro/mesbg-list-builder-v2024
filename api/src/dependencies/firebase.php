<?php

use Kreait\Firebase\Factory;

// Firebase initialization
$firebase = (new Factory)
    ->withServiceAccount(__DIR__ . '/../../' . $_ENV['SERVICE_ACCOUNT_CREDENTIALS'])
    ->createAuth();
