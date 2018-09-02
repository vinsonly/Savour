const validator = require('validator');

module.exports = {

    /* 
    * @param { data } - Object that contains the values for registration
    * @return { boolean } - Whether the input passed or failed validation
    */
    validateRegInputs(data) {
        if(!validator.equals(data.password, data.password_confirm)) {
            return "Passwords do not match."
        }

        if(!validator.isEmail(data.email)) {
            return "Email is invalid."
        }

        return true;
    }  
}
