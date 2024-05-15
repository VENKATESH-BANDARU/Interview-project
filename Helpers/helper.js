const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


class Helpers {
    async hashPasscode(passcode) {
        let password = await bcrypt.hashSync(passcode, 12);
        return password;
    }

    async comparePasscode(current, old) {
        let compare = await bcrypt.compareSync(current, old);
        return compare;
    }

    async jwtToken(data, secret) {
        let Verify = await jwt.sign(data, secret, { expiresIn: '30d' });
        return Verify
    }

    successMessage(data) {
        let message = "Success";
        let StatusCode = 200;
        return { message, StatusCode, data };
    }

    failureMessage(data) {
        let message = "Failed";
        let StatusCode = 400;
        return { message, StatusCode, data };
    }

    getFilename(files, name) {
        return files[name] ? files[name][0]["filename"] : null;
    }

    getMultiFilename(files) {
        return files.map((_) => {
            return _.filename;
        });
    }
}

module.exports = new Helpers();