<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jabatan extends Model
{
    protected $fillable = [
        'name',
        'honor'
    ];

    public function honorariums(){
        return $this->hasMany(Honorarium::class);
    }

}
