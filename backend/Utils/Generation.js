const bcrypt = require('bcrypt')

const { v4: uuidv4 } = require('uuid');

//Unique ID Generation
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

    let salt;

    let hashedPassword;

    try{

        salt = await bcrypt.genSalt(10); 

        return hashedPassword = await bcrypt.hash(password, salt); 

    }catch(error){

        throw new Error("Failed To Hash Password");

    }

}

module.exports = {

    generateHash,

    generateUniqueID
    
}