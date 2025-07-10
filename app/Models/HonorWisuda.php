<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HonorWisuda extends Model
{
    protected $guarded = ['id'];
    

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }
}
