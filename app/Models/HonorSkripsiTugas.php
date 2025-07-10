<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HonorSkripsiTugas extends Model
{
    protected $table = 'honor_skripsi_jobs';
    protected $guarded = ['id'];

    public function honorSkripsi()
    {
        return $this->belongsTo(HonorSkripsi::class, 'honor_skripsi_id');
    }
}
