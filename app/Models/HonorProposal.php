<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HonorProposal extends Model
{
    protected $guarded = ['id'];

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function tugas(){
        return $this->hasMany(HonorProposalTugas::class, 'honor_proposal_id');
    }
}
