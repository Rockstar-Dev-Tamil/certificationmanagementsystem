import bcrypt from 'bcryptjs';

async function generate() {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash('admin123', salt);
    console.log(hash);
}

generate();
