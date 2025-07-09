<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test users first
        User::factory()->create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@myskills.com',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'first_name' => 'John',
            'last_name' => 'Trainer',
            'email' => 'trainer@myskills.com',
            'role' => 'trainer',
        ]);

        User::factory()->create([
            'first_name' => 'Jane',
            'last_name' => 'Student',
            'email' => 'trainee@myskills.com',
            'role' => 'trainee',
        ]);

        User::factory()->create([
            'first_name' => 'Sam',
            'last_name' => 'Coordinator',
            'email' => 'coordinator@myskills.com',
            'role' => 'coordinator',
        ]);

        // Create additional sample users
        User::factory(6)->create();

        // Run other seeders
        $this->call([
            NotificationSeeder::class,
        ]);
    }
}
