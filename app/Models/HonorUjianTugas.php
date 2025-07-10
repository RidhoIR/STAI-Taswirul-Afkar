<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HonorUjianTugas extends Model
{
    protected $table = 'honor_ujian_jobs';
    protected $guarded = ['id'];

    public function honor_ujian(){
        return $this->belongsTo(HonorUjian::class, 'honor_ujian_id');
    }
}
