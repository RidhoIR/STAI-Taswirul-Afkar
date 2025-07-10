<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HonorProposalTugas extends Model
{
    protected $table = 'honor_proposal_jobs';
    protected $guarded = ['id'];

    public function honor_proposal()
    {
        return $this->belongsTo(HonorProposal::class, 'honor_proposal_id');
    }
}
