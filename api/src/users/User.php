<?php

namespace App\users;


class User
{

    private string $firebase_id;
    private string $name;
    private string $provider;

    /**
     * @param string $firebase_id
     * @param string $name
     * @param string $provider
     */
    public function __construct(string $firebase_id, string $name, string $provider)
    {
        $this->firebase_id = $firebase_id;
        $this->name = $name;
        $this->provider = $provider;
    }

    public function getFirebaseId(): string
    {
        return $this->firebase_id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getProvider(): string
    {
        return $this->provider;
    }

}