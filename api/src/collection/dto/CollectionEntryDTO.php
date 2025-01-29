<?php

namespace MLB\collection\dto;

class CollectionEntryDTO
{
    public string|array $options; // can be string or array of strings
    public string $mount;
    public string $amount;
}
