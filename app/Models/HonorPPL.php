<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HonorPPL extends Model
{

    protected $table = 'honor_ppls';
    protected $guarded = ['id'];

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function tugas()
    {
        return $this->hasMany(HonorPPLTugas::class, 'honor_ppl_id');
    }
}
