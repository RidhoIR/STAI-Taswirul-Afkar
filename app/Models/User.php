<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'jabatan',
        'niy',
        'nidn',
        'tempat_lahir',
        'tgl_lahir',
        'alamat',
        'no_telp',
        'ijazah_terakhir',
        'foto',
        'role',
    ];

    public function anggarans()
    {
        return $this->hasMany(Anggaran::class);
    }

    public function transaksis()
    {
        return $this->hasMany(Transaksi::class);
    }

    public function hasRole($role)
    {
        return $this->role === $role;
    }

    public function transaksi_harians()
    {
        return $this->hasMany(TransaksiHarian::class);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
