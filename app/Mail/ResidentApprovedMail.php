<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResidentApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $resident;
    public $password;

    public function __construct($resident, $password)
    {
        $this->resident = $resident;
        $this->password = $password;
    }

    public function build()
    {
        return $this->subject('Your Barangay Portal Account is Approved')
            ->view('emails.resident_approved');
    }
}
