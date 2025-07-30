<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;


class GenericNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subjectLine;
    public $messageBody;
    public $actionUrl;
    public $actionText;
    public $recipientName;

    /**
     * Create a new message instance.
     */
    public function __construct($subjectLine, $messageBody, $actionUrl = null, $actionText = null, $recipientName = null)
    {
        $this->subjectLine = $subjectLine;
        $this->messageBody = $messageBody;
        $this->actionUrl = $actionUrl;
        $this->actionText = $actionText;
        $this->recipientName = $recipientName;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject($this->subjectLine)
            ->view('emails.generic_notification')
            ->with([
                'recipientName' => $this->recipientName,
            ]);
    }
}
