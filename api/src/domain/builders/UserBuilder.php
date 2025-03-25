<?php

namespace MLB\domain\builders;

use MLB\domain\User;

class UserBuilder
{
    private string $firebase_id;
    private string $name;
    private string $provider;

    public function setFirebaseId(string $firebase_id): self
    {
        $this->firebase_id = $firebase_id;
        return $this;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function setProvider(string $provider): self
    {
        $this->provider = $provider;
        return $this;
    }

    public function build(): User
    {
        return new User(
            $this->firebase_id,
            $this->name,
            $this->provider
        );
    }

}