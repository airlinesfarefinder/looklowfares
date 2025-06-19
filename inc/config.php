<?php


function config($key)
{
    static $configuration = [
        'domain_name' => 'https://www.looklowfares.com',
        'brand_name' => 'LookLowFares',
        'phone_number' => '0204 542 1333',
        'email_id' => 'info@looklowfares.com',
        'address' => 'Suite 156 Unit B.  62-66 Hatton Garden,Holborn,London EC1N8LE UK',
        'lead_receiving_email' => 'mickey@aceflighthub.com'
    ];

    return $configuration[$key] ?? null;
}
