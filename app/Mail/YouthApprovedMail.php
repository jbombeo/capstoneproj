<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class YouthApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $password;

    public function __construct(User $user, $password)
    {
        $this->user = $user;
        $this->password = $password;
    }

    public function build()
    {
        $htmlContent = "
            <p>Hello {$this->user->name},</p>

            <p>Your SK Portal account has been approved.</p>

            <p><strong>Email:</strong> {$this->user->email}<br>
            <strong>Password:</strong> {$this->password}</p>

            <p>You may now log in using the link below:</p>
            <p><a href='" . url('/login') . "'>Login Here</a></p>

            <p>Please change your password after logging in.</p>

            <p>Thank you!</p>
        ";

        return $this->subject('Your SK Portal Account is Approved')
                    ->html($htmlContent);
    }
}
