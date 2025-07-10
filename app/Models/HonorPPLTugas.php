<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HonorPPLTugas extends Model
{
    protected $table = 'honor_ppl_jobs';
    protected $guarded = ['id'];

    public function honorPPL()
    {
        return $this->belongsTo(HonorPPL::class, 'honor_ppl_id');
    }
}
