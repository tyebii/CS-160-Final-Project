const bcrypt = require('bcrypt')

const { v4: uuidv4 } = require('uuid');

const generateUniqueID = async (func, limit = 5) => {
    let id = uuidv4();
    let count = 0;
    while (await func(id)) {
        if (++count === limit) throw new Error("ID generation failed after multiple attempts");
        id = uuidv4();
    }
    return id;
};

//Password hash generation
const generateHash = async (password) => {
    // Hashed Password
    let salt;
    let hashedPassword;
    try{
        salt = await bcrypt.genSalt(10); // Generates the salt -- purpose: can't use list of precomputed hashes
        return hashedPassword = await bcrypt.hash(password, salt); //Generates the hash based on round factor of salt
    }catch(error){
        throw new Error("Failed To Hash Password");
    }
}

module.exports = {
    generateHash,
    generateUniqueID
}